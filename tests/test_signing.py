"""Integration tests for signing engine (Section 7.2.1)."""

import base64
import hashlib
from datetime import UTC, datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.x509.oid import NameOID

from skillsign.canonical import canonicalize
from skillsign.errors import SkillSignError
from skillsign.signing import sign_skill


def _make_test_cert(
    san_uri: str | None = "https://github.com/test-user",
    san_email: str | None = None,
) -> x509.Certificate:
    """Create a self-signed test certificate with a SAN URI or email."""
    key = ec.generate_private_key(ec.SECP256R1())
    subject = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "test")])
    san_names: list[x509.GeneralName] = []
    if san_uri:
        san_names.append(x509.UniformResourceIdentifier(san_uri))
    if san_email:
        san_names.append(x509.RFC822Name(san_email))
    builder = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(subject)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.now(UTC))
        .not_valid_after(datetime.now(UTC) + timedelta(hours=1))
    )
    if san_names:
        builder = builder.add_extension(
            x509.SubjectAlternativeName(san_names),
            critical=False,
        )
    return builder.sign(key, hashes.SHA256())


def _make_mock_bundle(cert: x509.Certificate) -> MagicMock:
    """Create a mock Sigstore Bundle with realistic fields."""
    bundle = MagicMock()
    bundle.signing_certificate = cert
    bundle.signature = b"\x30\x44\x02\x20" + b"\xab" * 32 + b"\x02\x20" + b"\xcd" * 32

    # Mock log entry inner object
    log_entry = MagicMock()
    inner = MagicMock()
    inner.log_id.key_id = b"\xaa" * 32
    inner.integrated_time = 1709305323  # 2024-03-01T15:02:03Z
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


def _setup_skill_dir(
    tmp_path: pytest.TempPathFactory,
    *,
    skill_content: str = "# Test Skill\n\nDo something useful.\n",
    skill_id: str = "github.com/test-org/test-skill",
    skill_version: str = "1.0.0",
    create_sidecar: bool = False,
) -> tuple:
    """Create a skill directory with manifest and skill file."""
    skill_file = tmp_path / "SKILL.md"
    skill_file.write_text(skill_content)

    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(f"skill_id: {skill_id}\nskill_version: {skill_version}\n")

    if create_sidecar:
        sidecar = tmp_path / "SKILL.md.skillsign"
        sidecar.write_text("version: 1\n")

    return skill_file, skill_id, skill_version


# --- Happy path ---


@patch("skillsign.signing.get_identity_token")
@patch("skillsign.signing.ClientTrustConfig")
@patch("skillsign.signing.SigningContext")
def test_sign_skill_happy_path(
    mock_ctx_cls: MagicMock,
    mock_trust_cls: MagicMock,
    mock_get_token: MagicMock,
    tmp_path: pytest.TempPathFactory,
) -> None:
    """Full signing flow with mocked Sigstore produces valid sidecar data."""
    skill_file, skill_id, skill_version = _setup_skill_dir(tmp_path)

    cert = _make_test_cert()
    mock_bundle = _make_mock_bundle(cert)

    mock_get_token.return_value = MagicMock()
    mock_signer = MagicMock()
    mock_signer.sign_artifact.return_value = mock_bundle
    mock_ctx = MagicMock()
    mock_ctx.signer.return_value.__enter__ = MagicMock(return_value=mock_signer)
    mock_ctx.signer.return_value.__exit__ = MagicMock(return_value=False)
    mock_ctx_cls.from_trust_config.return_value = mock_ctx

    result = sign_skill(skill_file)

    # Verify all required sidecar fields are present
    assert result["version"] == 1
    assert result["skill_id"] == skill_id
    assert result["skill_version"] == skill_version
    assert result["signer"] == "https://github.com/test-user"
    assert result["digest"].startswith("sha256:")
    assert len(result["digest"]) == 7 + 64  # "sha256:" + 64 hex chars
    assert result["rekor_log_id"] == "aa" * 32
    assert result["rekor_timestamp"] == "2024-03-01T15:02:03Z"
    assert "rekor_set" in result
    assert result["certificate"].startswith("-----BEGIN CERTIFICATE-----")
    assert result["signature"]  # non-empty Base64
    assert result["timestamp"]  # non-empty ISO 8601

    # Verify signature is valid Base64
    base64.b64decode(result["signature"])


@patch("skillsign.signing.get_identity_token")
@patch("skillsign.signing.ClientTrustConfig")
@patch("skillsign.signing.SigningContext")
def test_digest_matches_expected(
    mock_ctx_cls: MagicMock,
    mock_trust_cls: MagicMock,
    mock_get_token: MagicMock,
    tmp_path: pytest.TempPathFactory,
) -> None:
    """Verify the digest field matches the expected computation."""
    content = "# Test Skill\n"
    skill_file, skill_id, skill_version = _setup_skill_dir(
        tmp_path, skill_content=content
    )

    cert = _make_test_cert()
    mock_bundle = _make_mock_bundle(cert)

    mock_get_token.return_value = MagicMock()
    mock_signer = MagicMock()
    mock_signer.sign_artifact.return_value = mock_bundle
    mock_ctx = MagicMock()
    mock_ctx.signer.return_value.__enter__ = MagicMock(return_value=mock_signer)
    mock_ctx.signer.return_value.__exit__ = MagicMock(return_value=False)
    mock_ctx_cls.from_trust_config.return_value = mock_ctx

    result = sign_skill(skill_file)

    # Compute expected digest manually
    canonical = canonicalize(content.encode("utf-8"))
    signed_input = (
        b"skillsign:v1\x00"
        + canonical
        + b"\x00"
        + skill_id.encode("utf-8")
        + b"\x00"
        + skill_version.encode("utf-8")
    )
    expected_hex = hashlib.sha256(signed_input).hexdigest()
    assert result["digest"] == f"sha256:{expected_hex}"


@patch("skillsign.signing.get_identity_token")
@patch("skillsign.signing.ClientTrustConfig")
@patch("skillsign.signing.SigningContext")
def test_hashed_input_passed_to_signer(
    mock_ctx_cls: MagicMock,
    mock_trust_cls: MagicMock,
    mock_get_token: MagicMock,
    tmp_path: pytest.TempPathFactory,
) -> None:
    """Verify the Hashed object passed to sign_artifact has correct digest."""
    skill_file, _, _ = _setup_skill_dir(tmp_path)

    cert = _make_test_cert()
    mock_bundle = _make_mock_bundle(cert)

    mock_get_token.return_value = MagicMock()
    mock_signer = MagicMock()
    mock_signer.sign_artifact.return_value = mock_bundle
    mock_ctx = MagicMock()
    mock_ctx.signer.return_value.__enter__ = MagicMock(return_value=mock_signer)
    mock_ctx.signer.return_value.__exit__ = MagicMock(return_value=False)
    mock_ctx_cls.from_trust_config.return_value = mock_ctx

    sign_skill(skill_file)

    # Verify sign_artifact was called with a Hashed object
    call_args = mock_signer.sign_artifact.call_args
    hashed = call_args[0][0]
    assert hashed.algorithm.value == "SHA2_256"
    assert len(hashed.digest) == 32  # SHA-256 is 32 bytes


# --- Error paths ---


def test_sidecar_already_exists(tmp_path: pytest.TempPathFactory) -> None:
    """Signing fails if sidecar already exists (no --force)."""
    skill_file, _, _ = _setup_skill_dir(tmp_path, create_sidecar=True)

    with pytest.raises(SkillSignError, match="already exists") as exc_info:
        sign_skill(skill_file)
    assert exc_info.value.exit_code == 10


def test_missing_manifest(tmp_path: pytest.TempPathFactory) -> None:
    """Signing fails if skillsign.yaml is missing."""
    skill_file = tmp_path / "SKILL.md"
    skill_file.write_text("# Test\n")
    # No manifest created

    with pytest.raises(SkillSignError, match="not found") as exc_info:
        sign_skill(skill_file)
    assert exc_info.value.exit_code == 10


def test_invalid_manifest(tmp_path: pytest.TempPathFactory) -> None:
    """Signing fails if manifest has invalid skill_id."""
    skill_file = tmp_path / "SKILL.md"
    skill_file.write_text("# Test\n")
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: bad-id\nskill_version: 1.0\n")

    with pytest.raises(SkillSignError) as exc_info:
        sign_skill(skill_file)
    assert exc_info.value.exit_code == 10


def test_missing_skill_file(tmp_path: pytest.TempPathFactory) -> None:
    """Signing fails if SKILL.md doesn't exist."""
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: 1.0\n")
    skill_file = tmp_path / "SKILL.md"
    # Don't create it

    with pytest.raises(SkillSignError, match="not found") as exc_info:
        sign_skill(skill_file)
    assert exc_info.value.exit_code == 10


@patch("skillsign.signing.get_identity_token")
def test_auth_failure(
    mock_get_token: MagicMock,
    tmp_path: pytest.TempPathFactory,
) -> None:
    """Signing fails if OIDC authentication fails."""
    skill_file, _, _ = _setup_skill_dir(tmp_path)
    mock_get_token.side_effect = SkillSignError(
        "OIDC authentication failed", exit_code=10
    )

    with pytest.raises(SkillSignError, match="authentication") as exc_info:
        sign_skill(skill_file)
    assert exc_info.value.exit_code == 10


@patch("skillsign.signing.get_identity_token")
@patch("skillsign.signing.ClientTrustConfig")
@patch("skillsign.signing.SigningContext")
def test_signing_failure(
    mock_ctx_cls: MagicMock,
    mock_trust_cls: MagicMock,
    mock_get_token: MagicMock,
    tmp_path: pytest.TempPathFactory,
) -> None:
    """Signing fails if Sigstore SDK signing/Rekor submission fails."""
    skill_file, _, _ = _setup_skill_dir(tmp_path)

    mock_get_token.return_value = MagicMock()
    mock_signer = MagicMock()
    mock_signer.sign_artifact.side_effect = RuntimeError("Rekor unavailable")
    mock_ctx = MagicMock()
    mock_ctx.signer.return_value.__enter__ = MagicMock(return_value=mock_signer)
    mock_ctx.signer.return_value.__exit__ = MagicMock(return_value=False)
    mock_ctx_cls.from_trust_config.return_value = mock_ctx

    with pytest.raises(SkillSignError, match="Signing failed") as exc_info:
        sign_skill(skill_file)
    assert exc_info.value.exit_code == 10


def test_invalid_utf8_skill_file(
    tmp_path: pytest.TempPathFactory,
) -> None:
    """Signing fails if skill file contains invalid UTF-8."""
    skill_file = tmp_path / "SKILL.md"
    skill_file.write_bytes(b"\xff\xfe bad bytes")
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: 1.0\n")

    with pytest.raises(SkillSignError, match="UTF-8") as exc_info:
        sign_skill(skill_file)
    assert exc_info.value.exit_code == 10


# --- Email SAN tests ---


@patch("skillsign.signing.get_identity_token")
@patch("skillsign.signing.ClientTrustConfig")
@patch("skillsign.signing.SigningContext")
def test_sign_skill_with_email_san(
    mock_ctx_cls: MagicMock,
    mock_trust_cls: MagicMock,
    mock_get_token: MagicMock,
    tmp_path: pytest.TempPathFactory,
) -> None:
    """Signing with an email SAN certificate extracts email as signer."""
    skill_file, skill_id, skill_version = _setup_skill_dir(tmp_path)

    cert = _make_test_cert(san_uri=None, san_email="user@gmail.com")
    mock_bundle = _make_mock_bundle(cert)

    mock_get_token.return_value = MagicMock()
    mock_signer = MagicMock()
    mock_signer.sign_artifact.return_value = mock_bundle
    mock_ctx = MagicMock()
    mock_ctx.signer.return_value.__enter__ = MagicMock(return_value=mock_signer)
    mock_ctx.signer.return_value.__exit__ = MagicMock(return_value=False)
    mock_ctx_cls.from_trust_config.return_value = mock_ctx

    result = sign_skill(skill_file)

    assert result["signer"] == "user@gmail.com"
    assert result["version"] == 1
    assert result["digest"].startswith("sha256:")


@patch("skillsign.signing.get_identity_token")
@patch("skillsign.signing.ClientTrustConfig")
@patch("skillsign.signing.SigningContext")
def test_sign_skill_uri_san_preferred_over_email(
    mock_ctx_cls: MagicMock,
    mock_trust_cls: MagicMock,
    mock_get_token: MagicMock,
    tmp_path: pytest.TempPathFactory,
) -> None:
    """When both URI and email SANs are present, URI is preferred."""
    skill_file, _, _ = _setup_skill_dir(tmp_path)

    cert = _make_test_cert(
        san_uri="https://github.com/test-user",
        san_email="user@gmail.com",
    )
    mock_bundle = _make_mock_bundle(cert)

    mock_get_token.return_value = MagicMock()
    mock_signer = MagicMock()
    mock_signer.sign_artifact.return_value = mock_bundle
    mock_ctx = MagicMock()
    mock_ctx.signer.return_value.__enter__ = MagicMock(return_value=mock_signer)
    mock_ctx.signer.return_value.__exit__ = MagicMock(return_value=False)
    mock_ctx_cls.from_trust_config.return_value = mock_ctx

    result = sign_skill(skill_file)

    assert result["signer"] == "https://github.com/test-user"


def test_extract_san_no_san_raises(tmp_path: pytest.TempPathFactory) -> None:
    """Certificate with no SAN extension raises SkillSignError."""
    from skillsign.signing import _extract_san

    cert = _make_test_cert(san_uri=None, san_email=None)
    with pytest.raises(SkillSignError, match="SAN URI or email"):
        _extract_san(cert)
