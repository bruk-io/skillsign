"""Unit tests for the verification engine (Section 8.2)."""

import base64
import datetime
from pathlib import Path
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.ec import ECDSA
from cryptography.hazmat.primitives.asymmetric.utils import Prehashed
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.serialization import Encoding
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID

from skillsign.canonical import canonicalize
from skillsign.digest import compute_digest
from skillsign.verify import (
    VerificationResult,
    _is_email_signer,
    _reconstruct_hashedrekord_body,
    _verify_cert_chain,
    _verify_set_temporal_window,
    exit_code_for,
    verify_skill,
)

# ---------------------------------------------------------------------------
# Test fixtures
# ---------------------------------------------------------------------------

_SKILL_ID = "github.com/test-org/my-skill"
_SKILL_VERSION = "1.0.0"
_SIGNER_URL = "https://github.com/test-org/repo"

# ISO timestamp that falls within the cert's validity window.
# _make_cert uses [now - 1h, now + 1h] so any recent timestamp works.
_VALID_REKOR_TS = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


_SIGNER_EMAIL = "testuser@gmail.com"


def _make_cert(
    key: ec.EllipticCurvePrivateKey,
    signer_url: str,
    include_code_signing_eku: bool = True,
    *,
    san_email: str | None = None,
) -> x509.Certificate:
    """Generate a self-signed ECDSA P-256 certificate with SAN URI/email and EKU."""
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "SkillSign Test")])
    san_names: list[x509.GeneralName] = []
    if signer_url:
        san_names.append(x509.UniformResourceIdentifier(signer_url))
    if san_email:
        san_names.append(x509.RFC822Name(san_email))
    builder = (
        x509.CertificateBuilder()
        .subject_name(name)
        .issuer_name(name)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(
            datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
        )
        .not_valid_after(
            datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        )
    )
    if san_names:
        builder = builder.add_extension(
            x509.SubjectAlternativeName(san_names),
            critical=False,
        )
    if include_code_signing_eku:
        builder = builder.add_extension(
            x509.ExtendedKeyUsage([ExtendedKeyUsageOID.CODE_SIGNING]),
            critical=False,
        )
    return builder.sign(key, SHA256())


def _make_sidecar(
    skill_content: bytes,
    *,
    skill_id: str = _SKILL_ID,
    skill_version: str = _SKILL_VERSION,
    signer_url: str = _SIGNER_URL,
    include_code_signing_eku: bool = True,
    corrupt_signature: bool = False,
    override_signer_in_sidecar: str | None = None,
    rekor_timestamp: str = _VALID_REKOR_TS,
) -> tuple[dict[str, Any], ec.EllipticCurvePrivateKey]:
    """Build a valid sidecar dict for the given skill content.

    Returns (sidecar_dict, private_key).
    """
    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, signer_url, include_code_signing_eku)
    cert_pem = cert.public_bytes(Encoding.PEM).decode()

    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, skill_id, skill_version)
    digest_hex = f"sha256:{digest_bytes.hex()}"

    if corrupt_signature:
        sig_bytes = b"\x00" * 64
    else:
        sig_bytes = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))
    sig_b64 = base64.b64encode(sig_bytes).decode()

    if override_signer_in_sidecar is not None:
        sidecar_signer = override_signer_in_sidecar
    else:
        sidecar_signer = signer_url

    sidecar: dict[str, Any] = {
        "version": 1,
        "skill_id": skill_id,
        "skill_version": skill_version,
        "signer": sidecar_signer,
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": digest_hex,
        "rekor_log_id": "a" * 64,
        "rekor_timestamp": rekor_timestamp,
        "rekor_set": base64.b64encode(b"fake-rekor-set-data").decode(),
        "certificate": cert_pem,
        "signature": sig_b64,
    }
    return sidecar, key


def _write_sidecar_yaml(sidecar: dict[str, Any], path: Path) -> None:
    """Write sidecar dict to a .skillsign YAML file in canonical order."""
    lines: list[str] = [
        f"version: {sidecar['version']}",
        f"skill_id: {sidecar['skill_id']}",
        f"skill_version: {sidecar['skill_version']}",
        f"signer: {sidecar['signer']}",
        f"timestamp: {sidecar['timestamp']}",
        f"digest: {sidecar['digest']}",
        f"rekor_log_id: {sidecar['rekor_log_id']}",
        f"rekor_timestamp: {sidecar['rekor_timestamp']}",
        f"rekor_set: {sidecar['rekor_set']}",
        "certificate: |",
    ]
    for cert_line in sidecar["certificate"].splitlines():
        lines.append(f"  {cert_line}")
    lines.append(f"signature: {sidecar['signature']}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _setup_files(
    tmp_path: Path,
    skill_content: bytes = b"# My Skill\n\nDoes stuff.\n",
    **sidecar_kwargs: Any,
) -> tuple[Path, Path]:
    """Write skill file and sidecar to tmp_path. Returns (skill_path, sidecar_path)."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    sidecar, _ = _make_sidecar(skill_content, **sidecar_kwargs)
    sidecar_path = Path(str(skill_path) + ".skillsign")
    _write_sidecar_yaml(sidecar, sidecar_path)

    return skill_path, sidecar_path


# ---------------------------------------------------------------------------
# Helper: patch _get_trusted_root to skip cert chain (unit test isolation)
# ---------------------------------------------------------------------------

# In unit tests, we use self-signed certificates that will never validate
# against the Sigstore Fulcio root. We patch _verify_cert_chain to return None
# (pass), skipping chain validation entirely. This is intentional: unit tests
# exercise all other logic. Integration / E2E tests cover the live TUF +
# chain validation path.
_SKIP_CHAIN = patch(
    "skillsign.verify._verify_cert_chain",
    return_value=None,
)


# ---------------------------------------------------------------------------
# Test cases
# ---------------------------------------------------------------------------


@_SKIP_CHAIN
def test_verified_happy_path(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """A valid sidecar with matching content and signature returns VERIFIED."""
    skill_path, _ = _setup_files(tmp_path)
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED
    assert meta["signer"] == _SIGNER_URL
    assert meta["skill_id"] == _SKILL_ID
    assert meta["skill_version"] == _SKILL_VERSION
    assert "error" not in meta


@_SKIP_CHAIN
def test_unsigned_no_sidecar(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """Missing sidecar returns UNSIGNED with empty metadata."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(b"# Unsigned\n")
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.UNSIGNED
    assert meta == {}


@_SKIP_CHAIN
def test_malformed_sidecar_corrupt_yaml(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """A sidecar that is not valid YAML returns MALFORMED_SIDECAR."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(b"# Hello\n")
    sidecar_path = Path(str(skill_path) + ".skillsign")
    sidecar_path.write_text(
        "this is not: valid: yaml: at: all: !!!\n", encoding="utf-8"
    )

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.MALFORMED_SIDECAR
    assert "error" in meta


@_SKIP_CHAIN
def test_malformed_sidecar_missing_required_field(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    """A sidecar missing required fields returns MALFORMED_SIDECAR."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(b"# Hello\n")
    sidecar_path = Path(str(skill_path) + ".skillsign")
    # Write a YAML that is valid YAML but missing required sidecar fields
    sidecar_path.write_text("version: 1\nskill_id: github.com/x/y\n", encoding="utf-8")

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.MALFORMED_SIDECAR
    assert "error" in meta


@_SKIP_CHAIN
def test_tampered_digest_mismatch(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """Modifying skill file content after signing causes TAMPERED (digest mismatch)."""
    skill_path, _ = _setup_files(tmp_path, skill_content=b"# Original\n")
    # Modify the skill file after signing
    skill_path.write_bytes(b"# TAMPERED\n")

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta
    assert "mismatch" in meta["error"].lower() or "tamper" in meta["error"].lower()


@_SKIP_CHAIN
def test_tampered_corrupt_signature(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """A signature that does not verify against the cert returns TAMPERED."""
    skill_path, _ = _setup_files(tmp_path, corrupt_signature=True)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta


@_SKIP_CHAIN
def test_identity_mismatch_san_does_not_match_signer(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    """Sidecar signer field mismatch with cert SAN returns IDENTITY_MISMATCH."""
    # The cert has signer_url = _SIGNER_URL but sidecar claims a different signer
    skill_content = b"# Skill\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    sidecar, _ = _make_sidecar(
        skill_content,
        signer_url=_SIGNER_URL,
        override_signer_in_sidecar="https://github.com/attacker/evil",
    )
    sidecar_path = Path(str(skill_path) + ".skillsign")
    _write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.IDENTITY_MISMATCH
    assert "error" in meta


@_SKIP_CHAIN
def test_invalid_cert_missing_eku(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """A certificate without the codeSigning EKU returns INVALID_CERT."""
    skill_path, _ = _setup_files(tmp_path, include_code_signing_eku=False)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.INVALID_CERT
    assert "error" in meta


@_SKIP_CHAIN
def test_skill_id_mismatch_different_owner(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """Signer at org-a signing skill_id for org-b returns SKILL_ID_MISMATCH."""
    skill_content = b"# Skill\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    # Signer URL is github.com/test-org but skill_id claims github.com/other-org
    sidecar, _ = _make_sidecar(
        skill_content,
        skill_id="github.com/other-org/my-skill",
        signer_url=_SIGNER_URL,  # https://github.com/test-org/repo
    )
    sidecar_path = Path(str(skill_path) + ".skillsign")
    _write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.SKILL_ID_MISMATCH
    assert "error" in meta
    assert "mismatch" in meta["error"].lower()


@_SKIP_CHAIN
def test_skill_id_match_same_owner(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """Signer and skill_id with same owner passes SKILL_ID_MISMATCH check."""
    skill_path, _ = _setup_files(
        tmp_path,
        skill_id="github.com/test-org/another-skill",
        signer_url="https://github.com/test-org/repo",
    )
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED


@_SKIP_CHAIN
def test_skill_id_mismatch_case_insensitive(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    """Owner comparison is case-insensitive per spec."""
    skill_path, _ = _setup_files(
        tmp_path,
        skill_id="github.com/Test-Org/my-skill",
        signer_url="https://github.com/test-org/repo",
    )
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED


@_SKIP_CHAIN
def test_tampered_wrong_key_signature(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """A valid DER ECDSA signature from a different key returns TAMPERED."""
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    # Build sidecar with the correct key
    sidecar, correct_key = _make_sidecar(skill_content)

    # Re-sign the digest with a DIFFERENT key
    wrong_key = ec.generate_private_key(ec.SECP256R1())
    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, _SKILL_ID, _SKILL_VERSION)
    wrong_sig = wrong_key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))
    sidecar["signature"] = base64.b64encode(wrong_sig).decode()

    sidecar_path = Path(str(skill_path) + ".skillsign")
    _write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta


@_SKIP_CHAIN
def test_unreadable_skill_file_raises_error(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    """An unreadable skill file raises SkillSignError (exit code 10), not TAMPERED."""
    from skillsign.errors import SkillSignError

    skill_path, _ = _setup_files(tmp_path)
    # Remove the skill file after sidecar is written
    skill_path.unlink()

    with pytest.raises(SkillSignError) as exc_info:
        verify_skill(skill_path)
    assert exc_info.value.exit_code == 10


# ---------------------------------------------------------------------------
# Step 7: Certificate chain validation
# ---------------------------------------------------------------------------


def test_cert_chain_fails_closed_when_tuf_unavailable(tmp_path: Path) -> None:
    """When TUF root is unavailable, cert chain check fails closed (INVALID_CERT)."""
    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, _SIGNER_URL)
    meta: dict[str, Any] = {"signer": _SIGNER_URL}
    sidecar: dict[str, Any] = {"rekor_timestamp": _VALID_REKOR_TS}

    with patch("skillsign.verify._get_trusted_root", return_value=None):
        result = _verify_cert_chain(cert, meta, sidecar)
    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    assert "unavailable" in result_meta["error"].lower()


def test_cert_chain_fails_for_self_signed_with_real_tuf(tmp_path: Path) -> None:
    """A self-signed cert fails chain validation when Fulcio certs are available."""
    # Build a mock TrustedRoot that returns a Fulcio cert that is NOT the
    # self-signed test cert's issuer. This simulates the real Sigstore scenario
    # where a test cert is not signed by a Fulcio CA.
    key = ec.generate_private_key(ec.SECP256R1())
    fulcio_key = ec.generate_private_key(ec.SECP256R1())

    # Generate a "Fulcio CA" cert (also self-signed, different key)
    fulcio_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Fake Fulcio CA")])
    fulcio_cert = (
        x509.CertificateBuilder()
        .subject_name(fulcio_name)
        .issuer_name(fulcio_name)
        .public_key(fulcio_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(
            datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
        )
        .not_valid_after(
            datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        )
        .add_extension(
            x509.BasicConstraints(ca=True, path_length=None),
            critical=True,
        )
        .sign(fulcio_key, SHA256())
    )

    # The leaf cert is signed by a different key (not fulcio_key)
    leaf_cert = _make_cert(key, _SIGNER_URL)

    mock_trusted_root = MagicMock()
    mock_trusted_root.get_fulcio_certs.return_value = [fulcio_cert]
    meta: dict[str, Any] = {"signer": _SIGNER_URL}

    sidecar: dict[str, Any] = {"rekor_timestamp": _VALID_REKOR_TS}
    with patch("skillsign.verify._get_trusted_root", return_value=mock_trusted_root):
        result = _verify_cert_chain(leaf_cert, meta, sidecar)

    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    err = result_meta["error"].lower()
    assert "chain" in err or "certificate" in err


def test_cert_chain_passes_when_signed_by_fulcio_ca(tmp_path: Path) -> None:
    """A cert properly signed by a Fulcio CA passes chain validation."""
    # Generate a CA key and cert (acts as the Fulcio CA)
    ca_key = ec.generate_private_key(ec.SECP256R1())
    ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Fake Fulcio CA")])
    ca_cert = (
        x509.CertificateBuilder()
        .subject_name(ca_name)
        .issuer_name(ca_name)
        .public_key(ca_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(
            datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=2)
        )
        .not_valid_after(
            datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=24)
        )
        .add_extension(
            x509.BasicConstraints(ca=True, path_length=None),
            critical=True,
        )
        .add_extension(
            x509.KeyUsage(
                digital_signature=True,
                key_cert_sign=True,
                crl_sign=True,
                content_commitment=False,
                key_encipherment=False,
                data_encipherment=False,
                key_agreement=False,
                encipher_only=False,
                decipher_only=False,
            ),
            critical=True,
        )
        .add_extension(
            x509.SubjectKeyIdentifier.from_public_key(ca_key.public_key()),
            critical=False,
        )
        .sign(ca_key, SHA256())
    )

    # Generate a leaf cert signed by the CA, with required extensions
    leaf_key = ec.generate_private_key(ec.SECP256R1())
    leaf_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Leaf Cert")])
    leaf_cert = (
        x509.CertificateBuilder()
        .subject_name(leaf_name)
        .issuer_name(ca_name)  # Issued by the CA
        .public_key(leaf_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(
            datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
        )
        .not_valid_after(
            datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        )
        .add_extension(
            x509.SubjectAlternativeName([x509.UniformResourceIdentifier(_SIGNER_URL)]),
            critical=False,
        )
        .add_extension(
            x509.ExtendedKeyUsage([ExtendedKeyUsageOID.CODE_SIGNING]),
            critical=False,
        )
        .add_extension(
            x509.SubjectKeyIdentifier.from_public_key(leaf_key.public_key()),
            critical=False,
        )
        .add_extension(
            x509.AuthorityKeyIdentifier.from_issuer_public_key(ca_key.public_key()),
            critical=False,
        )
        .sign(ca_key, SHA256())  # Signed by the CA key
    )

    mock_trusted_root = MagicMock()
    mock_trusted_root.get_fulcio_certs.return_value = [ca_cert]
    meta: dict[str, Any] = {"signer": _SIGNER_URL}

    sidecar: dict[str, Any] = {"rekor_timestamp": _VALID_REKOR_TS}
    with patch("skillsign.verify._get_trusted_root", return_value=mock_trusted_root):
        result = _verify_cert_chain(leaf_cert, meta, sidecar)

    assert result is None  # None = chain validation passed


# ---------------------------------------------------------------------------
# Step 9: SET temporal window verification
# ---------------------------------------------------------------------------


def test_set_temporal_window_timestamp_within_cert_validity(tmp_path: Path) -> None:
    """A rekor_timestamp within the cert's validity window passes step 9."""
    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, _SIGNER_URL)
    meta: dict[str, Any] = {"signer": _SIGNER_URL}

    # Timestamp is "now" which is within [now-1h, now+1h]
    ts = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    result = _verify_set_temporal_window(cert, ts, meta)
    assert result is None  # None = temporal check passed


def test_set_temporal_window_timestamp_before_cert_validity(tmp_path: Path) -> None:
    """A rekor_timestamp before the cert's notBefore fails with INVALID_CERT."""
    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, _SIGNER_URL)
    meta: dict[str, Any] = {"signer": _SIGNER_URL}

    # Timestamp is 2 hours ago — before not_valid_before (which is 1h ago)
    ts_early = (
        datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=2)
    ).strftime("%Y-%m-%dT%H:%M:%SZ")
    result = _verify_set_temporal_window(cert, ts_early, meta)
    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    assert "outside" in result_meta["error"].lower()


def test_set_temporal_window_timestamp_after_cert_expiry(tmp_path: Path) -> None:
    """A rekor_timestamp after the cert's notAfter fails with INVALID_CERT."""
    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, _SIGNER_URL)
    meta: dict[str, Any] = {"signer": _SIGNER_URL}

    # Timestamp is 2 hours in the future — after not_valid_after (which is 1h from now)
    ts_future = (
        datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=2)
    ).strftime("%Y-%m-%dT%H:%M:%SZ")
    result = _verify_set_temporal_window(cert, ts_future, meta)
    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    assert "outside" in result_meta["error"].lower()


def test_set_temporal_window_rejects_non_z_suffix(tmp_path: Path) -> None:
    """A rekor_timestamp with non-Z timezone offset is rejected per spec Section 6.2."""
    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, _SIGNER_URL)
    meta: dict[str, Any] = {"signer": _SIGNER_URL}

    result = _verify_set_temporal_window(cert, "2025-03-01T14:22:03+05:00", meta)
    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    assert "Z suffix" in result_meta["error"]


def test_set_temporal_window_invalid_timestamp_format(tmp_path: Path) -> None:
    """An unparseable rekor_timestamp fails with INVALID_CERT."""
    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, _SIGNER_URL)
    meta: dict[str, Any] = {"signer": _SIGNER_URL}

    result = _verify_set_temporal_window(cert, "not-a-timestamp", meta)
    assert result is not None
    result_code, _ = result
    assert result_code == VerificationResult.INVALID_CERT


@_SKIP_CHAIN
def test_rekor_timestamp_outside_cert_window_returns_invalid_cert(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    """Full verify_skill returns INVALID_CERT when rekor_timestamp is out of range."""
    # Create a cert with validity [1h ago, +1h], but set rekor_timestamp to 2h ago
    # so the timestamp is before not_valid_before.
    ts_before_cert = (
        datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=2)
    ).strftime("%Y-%m-%dT%H:%M:%SZ")

    skill_path, _ = _setup_files(tmp_path, rekor_timestamp=ts_before_cert)
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.INVALID_CERT
    assert "error" in meta
    assert "outside" in meta["error"].lower()


# ---------------------------------------------------------------------------
# Step 7+9 integration: cert chain failure takes priority over SET check
# ---------------------------------------------------------------------------


def test_cert_chain_failure_before_set_check(tmp_path: Path) -> None:
    """A cert chain failure (step 7) is reported before the SET check (step 9)."""
    # Provide a mock TUF root with a Fulcio CA that is NOT the test cert's issuer.
    fulcio_key = ec.generate_private_key(ec.SECP256R1())
    fulcio_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Fake Fulcio CA")])
    fake_fulcio_cert = (
        x509.CertificateBuilder()
        .subject_name(fulcio_name)
        .issuer_name(fulcio_name)
        .public_key(fulcio_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(
            datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
        )
        .not_valid_after(
            datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        )
        .add_extension(
            x509.BasicConstraints(ca=True, path_length=None),
            critical=True,
        )
        .sign(fulcio_key, SHA256())
    )

    mock_trusted_root = MagicMock()
    mock_trusted_root.get_fulcio_certs.return_value = [fake_fulcio_cert]

    skill_path, _ = _setup_files(tmp_path)

    with patch("skillsign.verify._get_trusted_root", return_value=mock_trusted_root):
        result, meta = verify_skill(skill_path)

    assert result == VerificationResult.INVALID_CERT
    assert "chain" in meta["error"].lower() or "fulcio" in meta["error"].lower()


# ---------------------------------------------------------------------------
# _reconstruct_hashedrekord_body unit tests
# ---------------------------------------------------------------------------


def test_reconstruct_hashedrekord_body_structure() -> None:
    """_reconstruct_hashedrekord_body produces valid JSON with expected keys."""
    import json

    cert_pem = "-----BEGIN CERTIFICATE-----\nfakedata\n-----END CERTIFICATE-----\n"
    sig_b64 = base64.b64encode(b"\xde\xad\xbe\xef").decode()
    digest_hex = "sha256:" + "ab" * 32

    body_bytes = _reconstruct_hashedrekord_body(cert_pem, sig_b64, digest_hex)
    body = json.loads(body_bytes)

    assert body["kind"] == "hashedrekord"
    assert body["apiVersion"] == "0.0.1"
    assert body["spec"]["data"]["hash"]["algorithm"] == "sha256"
    assert body["spec"]["data"]["hash"]["value"] == "ab" * 32
    assert body["spec"]["signature"]["content"] == sig_b64
    # cert content should be base64 of the PEM bytes
    expected_cert_b64 = base64.b64encode(cert_pem.encode("ascii")).decode("ascii")
    assert body["spec"]["signature"]["publicKey"]["content"] == expected_cert_b64


def test_reconstruct_hashedrekord_body_strips_sha256_prefix() -> None:
    """Digest field with sha256: prefix is stripped in the body."""
    import json

    body_bytes = _reconstruct_hashedrekord_body(
        "-----BEGIN CERTIFICATE-----\nAA==\n-----END CERTIFICATE-----\n",
        base64.b64encode(b"sig").decode(),
        "sha256:" + "cc" * 32,
    )
    body = json.loads(body_bytes)
    # Value should NOT include the sha256: prefix
    assert body["spec"]["data"]["hash"]["value"] == "cc" * 32
    assert not body["spec"]["data"]["hash"]["value"].startswith("sha256:")


# ---------------------------------------------------------------------------
# Exit code mapping
# ---------------------------------------------------------------------------


def test_exit_code_verified() -> None:
    assert exit_code_for(VerificationResult.VERIFIED) == 0


def test_exit_code_tampered() -> None:
    assert exit_code_for(VerificationResult.TAMPERED) == 1


def test_exit_code_invalid_cert() -> None:
    assert exit_code_for(VerificationResult.INVALID_CERT) == 1


def test_exit_code_identity_mismatch() -> None:
    assert exit_code_for(VerificationResult.IDENTITY_MISMATCH) == 1


def test_exit_code_unsigned() -> None:
    assert exit_code_for(VerificationResult.UNSIGNED) == 2


def test_exit_code_policy_fail() -> None:
    assert exit_code_for(VerificationResult.POLICY_FAIL) == 3


def test_exit_code_skill_id_mismatch() -> None:
    assert exit_code_for(VerificationResult.SKILL_ID_MISMATCH) == 1


def test_exit_code_malformed_sidecar() -> None:
    assert exit_code_for(VerificationResult.MALFORMED_SIDECAR) == 1


# ---------------------------------------------------------------------------
# Email SAN tests
# ---------------------------------------------------------------------------


@_SKIP_CHAIN
def test_verified_email_san(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """A valid sidecar with an email SAN signer returns VERIFIED."""
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    sidecar, _ = _make_sidecar(
        skill_content,
        signer_url="",
        override_signer_in_sidecar=_SIGNER_EMAIL,
        include_code_signing_eku=True,
    )
    # Re-create the sidecar with a cert that has an email SAN
    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, "", san_email=_SIGNER_EMAIL)
    cert_pem = cert.public_bytes(Encoding.PEM).decode()

    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, _SKILL_ID, _SKILL_VERSION)
    sig_bytes = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))

    sidecar["signer"] = _SIGNER_EMAIL
    sidecar["certificate"] = cert_pem
    sidecar["signature"] = base64.b64encode(sig_bytes).decode()

    sidecar_path = Path(str(skill_path) + ".skillsign")
    _write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED
    assert meta["signer"] == _SIGNER_EMAIL


@_SKIP_CHAIN
def test_identity_mismatch_email_san(mock_tuf: MagicMock, tmp_path: Path) -> None:
    """Sidecar claims different email than cert SAN returns IDENTITY_MISMATCH."""
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, "", san_email="real@example.com")
    cert_pem = cert.public_bytes(Encoding.PEM).decode()

    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, _SKILL_ID, _SKILL_VERSION)
    sig_bytes = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))

    sidecar: dict[str, Any] = {
        "version": 1,
        "skill_id": _SKILL_ID,
        "skill_version": _SKILL_VERSION,
        "signer": "fake@example.com",  # Different from cert
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": f"sha256:{digest_bytes.hex()}",
        "rekor_log_id": "a" * 64,
        "rekor_timestamp": _VALID_REKOR_TS,
        "rekor_set": base64.b64encode(b"fake-rekor-set-data").decode(),
        "certificate": cert_pem,
        "signature": base64.b64encode(sig_bytes).decode(),
    }

    sidecar_path = Path(str(skill_path) + ".skillsign")
    _write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.IDENTITY_MISMATCH
    assert "error" in meta


@_SKIP_CHAIN
def test_email_signer_skips_skill_id_owner_check(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    """Email signers skip SKILL_ID_MISMATCH owner-path check."""
    # The skill_id is github.com/some-org/skill but signer is an email.
    # This should NOT return SKILL_ID_MISMATCH — email signers skip the check.
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    key = ec.generate_private_key(ec.SECP256R1())
    cert = _make_cert(key, "", san_email=_SIGNER_EMAIL)
    cert_pem = cert.public_bytes(Encoding.PEM).decode()

    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, _SKILL_ID, _SKILL_VERSION)
    sig_bytes = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))

    sidecar: dict[str, Any] = {
        "version": 1,
        "skill_id": _SKILL_ID,
        "skill_version": _SKILL_VERSION,
        "signer": _SIGNER_EMAIL,
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": f"sha256:{digest_bytes.hex()}",
        "rekor_log_id": "a" * 64,
        "rekor_timestamp": _VALID_REKOR_TS,
        "rekor_set": base64.b64encode(b"fake-rekor-set-data").decode(),
        "certificate": cert_pem,
        "signature": base64.b64encode(sig_bytes).decode(),
    }

    sidecar_path = Path(str(skill_path) + ".skillsign")
    _write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED


# ---------------------------------------------------------------------------
# _is_email_signer unit tests
# ---------------------------------------------------------------------------


def test_is_email_signer_true_for_email() -> None:
    assert _is_email_signer("user@example.com") is True


def test_is_email_signer_false_for_url() -> None:
    assert _is_email_signer("https://github.com/user") is False


def test_is_email_signer_false_for_url_with_at() -> None:
    """A URL with @ in userinfo is not treated as email."""
    assert _is_email_signer("https://user@github.com/repo") is False
