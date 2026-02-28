"""Integration tests for cross-component flows (Issue #15).

These tests exercise multiple components together with mocked
external dependencies (Sigstore SDK). They cover the CLI-level
sign and verify flows end-to-end.
"""

import base64
from datetime import UTC, datetime, timedelta
from pathlib import Path
from unittest.mock import MagicMock, patch

from click.testing import CliRunner
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.ec import ECDSA
from cryptography.hazmat.primitives.asymmetric.utils import Prehashed
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID

from skillsign.canonical import canonicalize
from skillsign.cli import cli
from skillsign.digest import compute_digest
from skillsign.sidecar import read_sidecar

# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------

_SKILL_CONTENT = "# Test Skill\n\nA skill for integration testing.\n"
_SKILL_ID = "github.com/test-org/test-skill"
_SKILL_VERSION = "1.0.0"
_SIGNER_URL = "https://github.com/test-org/repo"


_SIGNER_EMAIL = "testuser@gmail.com"


def _make_cert_and_key(
    signer_url: str = _SIGNER_URL,
    *,
    san_email: str | None = None,
) -> tuple[x509.Certificate, ec.EllipticCurvePrivateKey]:
    """Create a self-signed test cert with SAN URI/email and code signing EKU."""
    key = ec.generate_private_key(ec.SECP256R1())
    subject = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "test")])
    san_names: list[x509.GeneralName] = []
    if signer_url:
        san_names.append(x509.UniformResourceIdentifier(signer_url))
    if san_email:
        san_names.append(x509.RFC822Name(san_email))
    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(subject)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.now(UTC) - timedelta(hours=1))
        .not_valid_after(datetime.now(UTC) + timedelta(hours=1))
        .add_extension(
            x509.SubjectAlternativeName(san_names),
            critical=False,
        )
        .add_extension(
            x509.ExtendedKeyUsage([ExtendedKeyUsageOID.CODE_SIGNING]),
            critical=False,
        )
        .sign(key, hashes.SHA256())
    )
    return cert, key


def _make_mock_bundle(
    cert: x509.Certificate,
    key: ec.EllipticCurvePrivateKey,
    digest_bytes: bytes,
) -> MagicMock:
    """Create a mock Sigstore Bundle with a real ECDSA signature."""
    bundle = MagicMock()
    bundle.signing_certificate = cert

    # Real signature over the digest
    bundle.signature = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))

    # Mock log entry
    log_entry = MagicMock()
    inner = MagicMock()
    inner.log_id.key_id = b"\xaa" * 32
    inner.integrated_time = int(datetime.now(UTC).timestamp())
    inner.inclusion_promise.signed_entry_timestamp = b"mock-set-data"
    log_entry._inner = inner
    bundle.log_entry = log_entry

    # Mock verification material (no chain)
    vm = MagicMock()
    vm.certificate.raw_bytes = cert.public_bytes(serialization.Encoding.DER)
    vm.x509_certificate_chain = None
    bundle._inner = MagicMock()
    bundle._inner.verification_material = vm

    return bundle


def _setup_skill_dir(tmp_path: Path) -> Path:
    """Create a skill directory with manifest and SKILL.md."""
    skill_file = tmp_path / "SKILL.md"
    skill_file.write_text(_SKILL_CONTENT)

    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(f"skill_id: {_SKILL_ID}\nskill_version: {_SKILL_VERSION}\n")

    return skill_file


def _patch_sigstore(skill_file: Path, *, san_email: str | None = None):
    """Create patches for Sigstore SDK with a real ECDSA signature.

    Returns a context manager stack and the mock bundle for assertions.
    """
    cert, key = _make_cert_and_key(
        signer_url="" if san_email else _SIGNER_URL,
        san_email=san_email,
    )

    # Compute the real digest so the signature is valid
    raw = skill_file.read_bytes()
    canonical_bytes = canonicalize(raw)
    digest_bytes = compute_digest(canonical_bytes, _SKILL_ID, _SKILL_VERSION)

    mock_bundle = _make_mock_bundle(cert, key, digest_bytes)

    mock_signer = MagicMock()
    mock_signer.sign_artifact.return_value = mock_bundle
    mock_ctx = MagicMock()
    mock_ctx.signer.return_value.__enter__ = MagicMock(return_value=mock_signer)
    mock_ctx.signer.return_value.__exit__ = MagicMock(return_value=False)

    return (
        patch("skillsign.signing.get_identity_token", return_value=MagicMock()),
        patch("skillsign.signing.ClientTrustConfig"),
        patch(
            "skillsign.signing.SigningContext.from_trust_config",
            return_value=mock_ctx,
        ),
    )


# ---------------------------------------------------------------------------
# Integration: sign via CLI → sidecar written → parseable by reader
# ---------------------------------------------------------------------------


def test_sign_cli_produces_parseable_sidecar(tmp_path: Path) -> None:
    """CLI sign command writes a sidecar that read_sidecar can parse."""
    skill_file = _setup_skill_dir(tmp_path)
    sidecar_path = Path(str(skill_file) + ".skillsign")

    p1, p2, p3 = _patch_sigstore(skill_file)
    runner = CliRunner()

    with p1, p2, p3:
        result = runner.invoke(cli, ["sign", str(skill_file)])

    assert result.exit_code == 0, result.output
    assert sidecar_path.exists(), "Sidecar file should be written"
    assert "Signed:" in result.output
    assert "Signer:" in result.output

    # Read back with sidecar reader — must not raise
    sidecar = read_sidecar(sidecar_path)
    assert sidecar["version"] == 1
    assert sidecar["skill_id"] == _SKILL_ID
    assert sidecar["skill_version"] == _SKILL_VERSION
    assert sidecar["signer"] == _SIGNER_URL
    assert sidecar["digest"].startswith("sha256:")
    assert sidecar["certificate"].startswith("-----BEGIN CERTIFICATE-----")


# ---------------------------------------------------------------------------
# Integration: sign → verify → VERIFIED (exit 0)
# ---------------------------------------------------------------------------


def test_sign_then_verify_returns_verified(tmp_path: Path) -> None:
    """Sign a skill, then verify it — should return VERIFIED exit 0."""
    skill_file = _setup_skill_dir(tmp_path)

    p1, p2, p3 = _patch_sigstore(skill_file)
    runner = CliRunner()

    # Sign
    with p1, p2, p3:
        sign_result = runner.invoke(cli, ["sign", str(skill_file)])
    assert sign_result.exit_code == 0, sign_result.output

    # Verify (with cert chain validation skipped — no real Fulcio CA)
    with patch("skillsign.verify._verify_cert_chain", return_value=None):
        verify_result = runner.invoke(cli, ["verify", str(skill_file)])

    assert verify_result.exit_code == 0, verify_result.output
    assert "VERIFIED" in verify_result.output


# ---------------------------------------------------------------------------
# Integration: sign → tamper → verify → TAMPERED (exit 1)
# ---------------------------------------------------------------------------


def test_sign_then_tamper_returns_tampered(tmp_path: Path) -> None:
    """Sign a skill, tamper with the file, verify → TAMPERED exit 1."""
    skill_file = _setup_skill_dir(tmp_path)

    p1, p2, p3 = _patch_sigstore(skill_file)
    runner = CliRunner()

    # Sign
    with p1, p2, p3:
        sign_result = runner.invoke(cli, ["sign", str(skill_file)])
    assert sign_result.exit_code == 0, sign_result.output

    # Tamper with the skill file
    skill_file.write_text("# TAMPERED CONTENT\n\nThis is not the original.\n")

    # Verify
    with patch("skillsign.verify._verify_cert_chain", return_value=None):
        verify_result = runner.invoke(cli, ["verify", str(skill_file)])

    assert verify_result.exit_code == 1, verify_result.output
    assert "TAMPERED" in verify_result.output


# ---------------------------------------------------------------------------
# Integration: verify with no sidecar → UNSIGNED (exit 2)
# ---------------------------------------------------------------------------


def test_verify_no_sidecar_returns_unsigned(tmp_path: Path) -> None:
    """Verify a skill with no sidecar → UNSIGNED exit 2."""
    skill_file = _setup_skill_dir(tmp_path)
    runner = CliRunner()

    result = runner.invoke(cli, ["verify", str(skill_file)])

    assert result.exit_code == 2, result.output
    assert "UNSIGNED" in result.output


# ---------------------------------------------------------------------------
# Integration: email SAN sign → verify → VERIFIED
# ---------------------------------------------------------------------------


def test_sign_then_verify_email_san(tmp_path: Path) -> None:
    """Sign with email SAN cert, then verify — should return VERIFIED exit 0."""
    skill_file = _setup_skill_dir(tmp_path)

    p1, p2, p3 = _patch_sigstore(skill_file, san_email=_SIGNER_EMAIL)
    runner = CliRunner()

    # Sign
    with p1, p2, p3:
        sign_result = runner.invoke(cli, ["sign", str(skill_file)])
    assert sign_result.exit_code == 0, sign_result.output
    assert _SIGNER_EMAIL in sign_result.output

    # Verify (with cert chain validation skipped — no real Fulcio CA)
    with patch("skillsign.verify._verify_cert_chain", return_value=None):
        verify_result = runner.invoke(cli, ["verify", str(skill_file)])

    assert verify_result.exit_code == 0, verify_result.output
    assert "VERIFIED" in verify_result.output
