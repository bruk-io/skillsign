"""Unit tests for the verification engine (Section 8.2)."""

import base64
import datetime
from pathlib import Path
from typing import Any

from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.ec import ECDSA
from cryptography.hazmat.primitives.asymmetric.utils import Prehashed
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.serialization import Encoding
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID

from skillsign.canonical import canonicalize
from skillsign.digest import compute_digest
from skillsign.verify import VerificationResult, exit_code_for, verify_skill

# ---------------------------------------------------------------------------
# Test fixtures
# ---------------------------------------------------------------------------

_SKILL_ID = "github.com/test-org/my-skill"
_SKILL_VERSION = "1.0.0"
_SIGNER_URL = "https://github.com/test-org/repo"


def _make_cert(
    key: ec.EllipticCurvePrivateKey,
    signer_url: str,
    include_code_signing_eku: bool = True,
) -> x509.Certificate:
    """Generate a self-signed ECDSA P-256 certificate with SAN URI and EKU."""
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "SkillSign Test")])
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
        .add_extension(
            x509.SubjectAlternativeName([x509.UniformResourceIdentifier(signer_url)]),
            critical=False,
        )
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
        "rekor_timestamp": "2026-01-01T00:00:01Z",
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
# Test cases
# ---------------------------------------------------------------------------


def test_verified_happy_path(tmp_path: Path) -> None:
    """A valid sidecar with matching content and signature returns VERIFIED."""
    skill_path, _ = _setup_files(tmp_path)
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED
    assert meta["signer"] == _SIGNER_URL
    assert meta["skill_id"] == _SKILL_ID
    assert meta["skill_version"] == _SKILL_VERSION
    assert "error" not in meta


def test_unsigned_no_sidecar(tmp_path: Path) -> None:
    """Missing sidecar returns UNSIGNED with empty metadata."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(b"# Unsigned\n")
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.UNSIGNED
    assert meta == {}


def test_malformed_sidecar_corrupt_yaml(tmp_path: Path) -> None:
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


def test_malformed_sidecar_missing_required_field(tmp_path: Path) -> None:
    """A sidecar missing required fields returns MALFORMED_SIDECAR."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(b"# Hello\n")
    sidecar_path = Path(str(skill_path) + ".skillsign")
    # Write a YAML that is valid YAML but missing required sidecar fields
    sidecar_path.write_text("version: 1\nskill_id: github.com/x/y\n", encoding="utf-8")

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.MALFORMED_SIDECAR
    assert "error" in meta


def test_tampered_digest_mismatch(tmp_path: Path) -> None:
    """Modifying skill file content after signing causes TAMPERED (digest mismatch)."""
    skill_path, _ = _setup_files(tmp_path, skill_content=b"# Original\n")
    # Modify the skill file after signing
    skill_path.write_bytes(b"# TAMPERED\n")

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta
    assert "mismatch" in meta["error"].lower() or "tamper" in meta["error"].lower()


def test_tampered_corrupt_signature(tmp_path: Path) -> None:
    """A signature that does not verify against the cert returns TAMPERED."""
    skill_path, _ = _setup_files(tmp_path, corrupt_signature=True)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta


def test_identity_mismatch_san_does_not_match_signer(tmp_path: Path) -> None:
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


def test_invalid_cert_missing_eku(tmp_path: Path) -> None:
    """A certificate without the codeSigning EKU returns INVALID_CERT."""
    skill_path, _ = _setup_files(tmp_path, include_code_signing_eku=False)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.INVALID_CERT
    assert "error" in meta


def test_skill_id_mismatch_different_owner(tmp_path: Path) -> None:
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


def test_skill_id_match_same_owner(tmp_path: Path) -> None:
    """Signer and skill_id with same owner passes SKILL_ID_MISMATCH check."""
    skill_path, _ = _setup_files(
        tmp_path,
        skill_id="github.com/test-org/another-skill",
        signer_url="https://github.com/test-org/repo",
    )
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED


def test_skill_id_mismatch_case_insensitive(tmp_path: Path) -> None:
    """Owner comparison is case-insensitive per spec."""
    skill_path, _ = _setup_files(
        tmp_path,
        skill_id="github.com/Test-Org/my-skill",
        signer_url="https://github.com/test-org/repo",
    )
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED


def test_tampered_wrong_key_signature(tmp_path: Path) -> None:
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


def test_unreadable_skill_file_raises_error(tmp_path: Path) -> None:
    """An unreadable skill file raises SkillSignError (exit code 10), not TAMPERED."""
    import pytest

    from skillsign.errors import SkillSignError

    skill_path, _ = _setup_files(tmp_path)
    # Remove the skill file after sidecar is written
    skill_path.unlink()

    with pytest.raises(SkillSignError) as exc_info:
        verify_skill(skill_path)
    assert exc_info.value.exit_code == 10


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
