"""E2E tests exercising real Sigstore infrastructure.

These tests are skipped by default. Set SKILLSIGN_E2E=1 to run them.
In CI, they run under GitHub Actions ambient OIDC (id-token: write).

The tests use production Sigstore (not staging) because:
- GitHub Actions OIDC tokens are issued for production Sigstore
- sigstore-python's default ClientTrustConfig targets production
"""

from pathlib import Path

import pytest

from skillsign.sidecar import read_sidecar, write_sidecar
from skillsign.signing import sign_skill
from skillsign.verify import VerificationResult, verify_skill

pytestmark = pytest.mark.e2e

_SKILL_CONTENT = """\
# E2E Test Skill

This skill exists solely for automated end-to-end testing.
"""

_SKILL_ID = "github.com/bruk-io/skillsign-e2e-test"
_SKILL_VERSION = "0.0.1"


@pytest.fixture
def skill_dir(tmp_path: Path) -> tuple[Path, Path]:
    """Create a temporary skill directory with SKILL.md and manifest."""
    skill_file = tmp_path / "SKILL.md"
    skill_file.write_text(_SKILL_CONTENT)

    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(f"skill_id: {_SKILL_ID}\nskill_version: {_SKILL_VERSION}\n")

    return skill_file, tmp_path


def test_sign_and_verify_round_trip(skill_dir: tuple[Path, Path]) -> None:
    """Sign a SKILL.md with real Sigstore, then verify the sidecar."""
    skill_file, tmp_path = skill_dir

    # Sign
    sidecar_data = sign_skill(skill_file, force=True)
    sidecar_path = Path(str(skill_file) + ".skillsign")
    write_sidecar(sidecar_data, sidecar_path)

    # Verify basic sidecar structure
    assert sidecar_path.exists()
    parsed = read_sidecar(sidecar_path)
    assert parsed["skill_id"] == _SKILL_ID
    assert parsed["skill_version"] == _SKILL_VERSION
    assert parsed["signer"]  # Non-empty signer
    assert parsed["certificate"]  # Non-empty cert
    assert parsed["signature"]  # Non-empty sig
    assert parsed["rekor_log_id"]  # Recorded in transparency log
    assert parsed["rekor_timestamp"]  # Has timestamp

    # Verify
    result, meta = verify_skill(skill_file)
    assert result == VerificationResult.VERIFIED, (
        f"Expected VERIFIED, got {result}: {meta}"
    )
    assert meta["signer"]
    assert meta["skill_id"] == _SKILL_ID
    assert meta["skill_version"] == _SKILL_VERSION


def test_verify_tampered_file_after_signing(skill_dir: tuple[Path, Path]) -> None:
    """Sign a file, tamper with it, then verify detects TAMPERED."""
    skill_file, tmp_path = skill_dir

    # Sign
    sidecar_data = sign_skill(skill_file, force=True)
    sidecar_path = Path(str(skill_file) + ".skillsign")
    write_sidecar(sidecar_data, sidecar_path)

    # Tamper
    skill_file.write_text("# TAMPERED CONTENT\n\nThis was modified after signing.\n")

    # Verify should detect tampering
    result, meta = verify_skill(skill_file)
    assert result == VerificationResult.TAMPERED, (
        f"Expected TAMPERED, got {result}: {meta}"
    )
