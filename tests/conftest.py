"""Shared test fixtures for SkillSign test suite.

Consolidates duplicated helpers: certificate creation, mock bundle
construction, and skill directory setup.
"""

from datetime import UTC, datetime, timedelta
from pathlib import Path
from unittest.mock import MagicMock

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.ec import ECDSA
from cryptography.hazmat.primitives.asymmetric.utils import Prehashed
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID

# ---------------------------------------------------------------------------
# Certificate creation
# ---------------------------------------------------------------------------


def make_test_cert(
    san_uri: str | None = "https://github.com/test-user",
    san_email: str | None = None,
    *,
    include_code_signing_eku: bool = True,
    key: ec.EllipticCurvePrivateKey | None = None,
) -> tuple[x509.Certificate, ec.EllipticCurvePrivateKey]:
    """Create a self-signed P-256 test certificate.

    Returns (cert, private_key). Supports both URI and email SANs,
    optional code signing EKU, and an optional pre-existing key.
    """
    if key is None:
        key = ec.generate_private_key(ec.SECP256R1())

    subject = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "SkillSign Test")])
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
        .not_valid_before(datetime.now(UTC) - timedelta(hours=1))
        .not_valid_after(datetime.now(UTC) + timedelta(hours=1))
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
    cert = builder.sign(key, hashes.SHA256())
    return cert, key


# ---------------------------------------------------------------------------
# Mock Sigstore bundle
# ---------------------------------------------------------------------------


def make_mock_bundle(
    cert: x509.Certificate,
    key: ec.EllipticCurvePrivateKey | None = None,
    digest_bytes: bytes | None = None,
) -> MagicMock:
    """Create a mock Sigstore Bundle with realistic fields.

    If key and digest_bytes are provided, a real ECDSA signature is created.
    Otherwise, a fake signature is used.
    """
    bundle = MagicMock()
    bundle.signing_certificate = cert

    if key is not None and digest_bytes is not None:
        bundle.signature = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))
    else:
        bundle.signature = (
            b"\x30\x44\x02\x20" + b"\xab" * 32 + b"\x02\x20" + b"\xcd" * 32
        )

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


# ---------------------------------------------------------------------------
# Skill directory setup
# ---------------------------------------------------------------------------

_DEFAULT_SKILL_CONTENT = "# Test Skill\n\nDo something useful.\n"
_DEFAULT_SKILL_ID = "github.com/test-org/test-skill"
_DEFAULT_SKILL_VERSION = "1.0.0"


def setup_skill_dir(
    tmp_path: Path,
    *,
    skill_content: str = _DEFAULT_SKILL_CONTENT,
    skill_id: str = _DEFAULT_SKILL_ID,
    skill_version: str = _DEFAULT_SKILL_VERSION,
    create_sidecar: bool = False,
) -> tuple[Path, str, str]:
    """Create a skill directory with manifest and SKILL.md.

    Returns (skill_file_path, skill_id, skill_version).
    """
    skill_file = tmp_path / "SKILL.md"
    skill_file.write_text(skill_content)

    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(f"skill_id: {skill_id}\nskill_version: {skill_version}\n")

    if create_sidecar:
        sidecar = tmp_path / "SKILL.md.skillsign"
        sidecar.write_text("version: 1\n")

    return skill_file, skill_id, skill_version


# ---------------------------------------------------------------------------
# Sidecar YAML writer (for test setup — writes raw dict to .skillsign file)
# ---------------------------------------------------------------------------


def write_sidecar_yaml(sidecar: dict, path: Path) -> None:
    """Write sidecar dict to a .skillsign YAML file in canonical order."""
    lines: list[str] = [
        f"version: {sidecar['version']}",
        f"skill_id: {sidecar['skill_id']}",
        f"skill_version: {sidecar['skill_version']}",
        f"signer: {sidecar['signer']}",
        f"timestamp: {sidecar['timestamp']}",
        f"digest: {sidecar['digest']}",
        f"rekor_log_id: {sidecar['rekor_log_id']}",
        f"rekor_log_index: {sidecar['rekor_log_index']}",
        f"rekor_timestamp: {sidecar['rekor_timestamp']}",
        f"rekor_set: {sidecar['rekor_set']}",
        "certificate: |",
    ]
    for cert_line in sidecar["certificate"].splitlines():
        lines.append(f"  {cert_line}")
    lines.append(f"signature: {sidecar['signature']}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# Signing infra patches
# ---------------------------------------------------------------------------


def patch_signing_infra(mock_bundle: MagicMock) -> tuple:
    """Return patches for the signing infra (OIDC, Fulcio context, Rekor).

    Returns (patch_oidc, patch_fulcio, patch_rekor, mock_signer).
    """
    from unittest.mock import patch

    mock_signer = MagicMock()
    mock_ctx = MagicMock()
    mock_ctx.signer.return_value.__enter__ = MagicMock(return_value=mock_signer)
    mock_ctx.signer.return_value.__exit__ = MagicMock(return_value=False)

    return (
        patch("skillsign.signing.get_identity_token", return_value=MagicMock()),
        patch(
            "skillsign.signing.create_signing_context",
            return_value=(MagicMock(), mock_ctx),
        ),
        patch("skillsign.signing.sign_and_log", return_value=mock_bundle),
        mock_signer,
    )
