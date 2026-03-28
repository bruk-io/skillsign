"""E2E tests exercising real Sigstore infrastructure (library level).

These tests are skipped by default. Set SKILLSIGN_E2E=1 to run them.

The ``signed_artifacts`` session fixture signs ONCE. All verification-path
tests copy those artifacts and manipulate them locally.
"""

from pathlib import Path

import pytest

from skillsign.verify import VerificationResult, verify_skill

from .conftest import (
    SKILL_CONTENT,
    SKILL_ID,
    SKILL_VERSION,
    SignedArtifacts,
    setup_signed_copy,
)

pytestmark = pytest.mark.e2e


# --- Sign + verify round trip (uses session fixture, no extra auth) ---


def test_sign_and_verify_round_trip(
    signed_artifacts: SignedArtifacts, tmp_path: Path
) -> None:
    """Verify that real Sigstore-signed artifacts pass full verification."""
    # Validate sidecar structure from the session sign
    fields = signed_artifacts.sidecar_fields
    assert fields["skill_id"] == SKILL_ID
    assert fields["skill_version"] == SKILL_VERSION
    assert fields["signer"]
    assert fields["certificate"]
    assert fields["signature"]
    assert fields["rekor_log_id"]
    assert fields["rekor_timestamp"]

    # Copy and verify through the verification engine
    skill_file = setup_signed_copy(signed_artifacts, tmp_path)
    result, meta = verify_skill(skill_file)
    assert result == VerificationResult.VERIFIED, (
        f"Expected VERIFIED, got {result}: {meta}"
    )
    assert meta["signer"]
    assert meta["skill_id"] == SKILL_ID
    assert meta["skill_version"] == SKILL_VERSION


# --- Verification-path tests (reuse signed_artifacts, no extra auth) ---


def test_verify_tampered_file(
    signed_artifacts: SignedArtifacts, tmp_path: Path
) -> None:
    """Tamper with a signed file, verify detects TAMPERED."""
    skill_file = setup_signed_copy(signed_artifacts, tmp_path)
    skill_file.write_text("# TAMPERED\n\nModified after signing.\n")

    result, meta = verify_skill(skill_file)
    assert result == VerificationResult.TAMPERED, (
        f"Expected TAMPERED, got {result}: {meta}"
    )


def test_verify_unsigned(tmp_path: Path) -> None:
    """Verify a file with no sidecar returns UNSIGNED."""
    skill_file = tmp_path / "SKILL.md"
    skill_file.write_text(SKILL_CONTENT)

    result, _meta = verify_skill(skill_file)
    assert result == VerificationResult.UNSIGNED


def test_verify_malformed_sidecar(
    signed_artifacts: SignedArtifacts, tmp_path: Path
) -> None:
    """Corrupt the sidecar YAML, verify returns MALFORMED_SIDECAR."""
    skill_file = setup_signed_copy(signed_artifacts, tmp_path)
    sidecar_path = Path(str(skill_file) + ".skillsign")
    sidecar_path.write_text("not valid yaml: :::{{garbage")

    result, _meta = verify_skill(skill_file)
    assert result == VerificationResult.MALFORMED_SIDECAR


def test_verify_identity_mismatch(
    signed_artifacts: SignedArtifacts, tmp_path: Path
) -> None:
    """Change signer in sidecar, verify returns IDENTITY_MISMATCH."""
    skill_file = setup_signed_copy(signed_artifacts, tmp_path)
    sidecar_path = Path(str(skill_file) + ".skillsign")

    original_signer = signed_artifacts.signer
    if original_signer.startswith("https://"):
        fake = (
            "https://github.com/attacker-org/repo"
            "/.github/workflows/ci.yml@refs/heads/main"
        )
    else:
        fake = "nobody@example.com"

    raw = sidecar_path.read_text()
    sidecar_path.write_text(
        raw.replace(f"signer: {original_signer}", f"signer: {fake}", 1)
    )

    result, _meta = verify_skill(skill_file)
    assert result == VerificationResult.IDENTITY_MISMATCH


def test_verify_skill_id_mismatch(
    signed_artifacts: SignedArtifacts, tmp_path: Path
) -> None:
    """Change skill_id owner in sidecar — digest includes skill_id, so
    the verification engine detects TAMPERED at step 5 (digest mismatch)
    before reaching step 11 (SKILL_ID_MISMATCH owner check).
    """
    skill_file = setup_signed_copy(signed_artifacts, tmp_path)
    sidecar_path = Path(str(skill_file) + ".skillsign")

    raw = sidecar_path.read_text()
    fake_id = "github.com/attacker-org/skillsign-e2e-test"
    sidecar_path.write_text(
        raw.replace(f"skill_id: {SKILL_ID}", f"skill_id: {fake_id}", 1)
    )

    result, _meta = verify_skill(skill_file)
    # skill_id is part of the signed digest input (Section 5.2), so
    # changing it causes a digest mismatch before the owner check runs.
    assert result == VerificationResult.TAMPERED
