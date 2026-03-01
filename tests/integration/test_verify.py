"""Integration tests for the verification engine — file I/O + mocked cert chain."""

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
from cryptography.x509.oid import NameOID

from skillsign.canonical import canonicalize
from skillsign.digest import compute_digest
from skillsign.verify import (
    VerificationResult,
    verify_skill,
)
from tests.conftest import make_test_cert, write_sidecar_yaml
from tests.integration.conftest import (
    SIGNER_EMAIL,
    SIGNER_URL,
    SKILL_ID,
    SKILL_VERSION,
    VALID_REKOR_TS,
    make_sidecar,
    setup_files,
)

_SKIP_CHAIN = patch(
    "skillsign.verify._verify_cert_chain",
    return_value=None,
)


# ---------------------------------------------------------------------------
# verify_skill integration tests (file I/O + mocked cert chain)
# ---------------------------------------------------------------------------


@_SKIP_CHAIN
def test_verified_happy_path(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_path, _ = setup_files(tmp_path)
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED
    assert meta["signer"] == SIGNER_URL
    assert meta["skill_id"] == SKILL_ID
    assert meta["skill_version"] == SKILL_VERSION
    assert "error" not in meta


@_SKIP_CHAIN
def test_unsigned_no_sidecar(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(b"# Unsigned\n")
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.UNSIGNED
    assert meta == {}


@_SKIP_CHAIN
def test_malformed_sidecar_corrupt_yaml(mock_tuf: MagicMock, tmp_path: Path) -> None:
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
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(b"# Hello\n")
    sidecar_path = Path(str(skill_path) + ".skillsign")
    sidecar_path.write_text("version: 1\nskill_id: github.com/x/y\n", encoding="utf-8")
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.MALFORMED_SIDECAR
    assert "error" in meta


@_SKIP_CHAIN
def test_tampered_digest_mismatch(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_path, _ = setup_files(tmp_path, skill_content=b"# Original\n")
    skill_path.write_bytes(b"# TAMPERED\n")
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta
    assert "mismatch" in meta["error"].lower() or "tamper" in meta["error"].lower()


@_SKIP_CHAIN
def test_tampered_corrupt_signature(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_path, _ = setup_files(tmp_path, corrupt_signature=True)
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta


@_SKIP_CHAIN
def test_identity_mismatch_san_does_not_match_signer(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    skill_content = b"# Skill\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    sidecar, _ = make_sidecar(
        skill_content,
        signer_url=SIGNER_URL,
        override_signer_in_sidecar="https://github.com/attacker/evil",
    )
    sidecar_path = Path(str(skill_path) + ".skillsign")
    write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.IDENTITY_MISMATCH
    assert "error" in meta


@_SKIP_CHAIN
def test_invalid_cert_missing_eku(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_path, _ = setup_files(tmp_path, include_code_signing_eku=False)
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.INVALID_CERT
    assert "error" in meta


@_SKIP_CHAIN
def test_skill_id_mismatch_different_owner(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_content = b"# Skill\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    sidecar, _ = make_sidecar(
        skill_content,
        skill_id="github.com/other-org/my-skill",
        signer_url=SIGNER_URL,
    )
    sidecar_path = Path(str(skill_path) + ".skillsign")
    write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.SKILL_ID_MISMATCH
    assert "error" in meta
    assert "mismatch" in meta["error"].lower()


@_SKIP_CHAIN
def test_skill_id_match_same_owner(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_path, _ = setup_files(
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
    skill_path, _ = setup_files(
        tmp_path,
        skill_id="github.com/Test-Org/my-skill",
        signer_url="https://github.com/test-org/repo",
    )
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED


@_SKIP_CHAIN
def test_tampered_wrong_key_signature(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    sidecar, correct_key = make_sidecar(skill_content)

    wrong_key = ec.generate_private_key(ec.SECP256R1())
    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, SKILL_ID, SKILL_VERSION)
    wrong_sig = wrong_key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))
    sidecar["signature"] = base64.b64encode(wrong_sig).decode()

    sidecar_path = Path(str(skill_path) + ".skillsign")
    write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta


@_SKIP_CHAIN
def test_unreadable_skill_file_raises_error(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    from skillsign.errors import SkillSignError

    skill_path, _ = setup_files(tmp_path)
    skill_path.unlink()

    with pytest.raises(SkillSignError) as exc_info:
        verify_skill(skill_path)
    assert exc_info.value.exit_code == 10


@_SKIP_CHAIN
def test_rekor_timestamp_outside_cert_window_returns_invalid_cert(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    ts_before_cert = (
        datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=2)
    ).strftime("%Y-%m-%dT%H:%M:%SZ")

    skill_path, _ = setup_files(tmp_path, rekor_timestamp=ts_before_cert)
    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.INVALID_CERT
    assert "error" in meta
    assert "outside" in meta["error"].lower()


# ---------------------------------------------------------------------------
# Step 7+9 integration: cert chain failure takes priority over SET check
# ---------------------------------------------------------------------------


def test_cert_chain_failure_before_set_check(tmp_path: Path) -> None:
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

    skill_path, _ = setup_files(tmp_path)

    with patch("skillsign.verify._get_trusted_root", return_value=mock_trusted_root):
        result, meta = verify_skill(skill_path)

    assert result == VerificationResult.INVALID_CERT
    assert "chain" in meta["error"].lower() or "fulcio" in meta["error"].lower()


# ---------------------------------------------------------------------------
# Email SAN integration tests
# ---------------------------------------------------------------------------


@_SKIP_CHAIN
def test_verified_email_san(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    sidecar, _ = make_sidecar(
        skill_content,
        signer_url="",
        override_signer_in_sidecar=SIGNER_EMAIL,
        include_code_signing_eku=True,
    )
    cert, key = make_test_cert(san_uri=None, san_email=SIGNER_EMAIL)
    cert_pem = cert.public_bytes(Encoding.PEM).decode()

    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, SKILL_ID, SKILL_VERSION)
    sig_bytes = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))

    sidecar["signer"] = SIGNER_EMAIL
    sidecar["certificate"] = cert_pem
    sidecar["signature"] = base64.b64encode(sig_bytes).decode()

    sidecar_path = Path(str(skill_path) + ".skillsign")
    write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED
    assert meta["signer"] == SIGNER_EMAIL


@_SKIP_CHAIN
def test_identity_mismatch_email_san(mock_tuf: MagicMock, tmp_path: Path) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    cert, key = make_test_cert(san_uri=None, san_email="real@example.com")
    cert_pem = cert.public_bytes(Encoding.PEM).decode()

    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, SKILL_ID, SKILL_VERSION)
    sig_bytes = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))

    sidecar: dict[str, Any] = {
        "version": 1,
        "skill_id": SKILL_ID,
        "skill_version": SKILL_VERSION,
        "signer": "fake@example.com",
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": f"sha256:{digest_bytes.hex()}",
        "rekor_log_id": "a" * 64,
        "rekor_timestamp": VALID_REKOR_TS,
        "rekor_set": base64.b64encode(b"fake-rekor-set-data").decode(),
        "certificate": cert_pem,
        "signature": base64.b64encode(sig_bytes).decode(),
    }

    sidecar_path = Path(str(skill_path) + ".skillsign")
    write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.IDENTITY_MISMATCH
    assert "error" in meta


@_SKIP_CHAIN
def test_email_signer_skips_skill_id_owner_check(
    mock_tuf: MagicMock, tmp_path: Path
) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    cert, key = make_test_cert(san_uri=None, san_email=SIGNER_EMAIL)
    cert_pem = cert.public_bytes(Encoding.PEM).decode()

    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, SKILL_ID, SKILL_VERSION)
    sig_bytes = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))

    sidecar: dict[str, Any] = {
        "version": 1,
        "skill_id": SKILL_ID,
        "skill_version": SKILL_VERSION,
        "signer": SIGNER_EMAIL,
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": f"sha256:{digest_bytes.hex()}",
        "rekor_log_id": "a" * 64,
        "rekor_timestamp": VALID_REKOR_TS,
        "rekor_set": base64.b64encode(b"fake-rekor-set-data").decode(),
        "certificate": cert_pem,
        "signature": base64.b64encode(sig_bytes).decode(),
    }

    sidecar_path = Path(str(skill_path) + ".skillsign")
    write_sidecar_yaml(sidecar, sidecar_path)

    result, meta = verify_skill(skill_path)
    assert result == VerificationResult.VERIFIED
