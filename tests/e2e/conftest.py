"""E2E test configuration — skips unless SKILLSIGN_E2E=1.

Provides a session-scoped ``signed_artifacts`` fixture that performs ONE
real Sigstore signing. All verification-path tests copy these artifacts
to their own tmp_path and manipulate as needed, avoiding repeated OIDC
browser prompts.
"""

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import pytest

from skillsign.sidecar import read_sidecar, write_sidecar
from skillsign.signing import sign_skill

SKILL_CONTENT = """\
# E2E Test Skill

This skill exists solely for automated end-to-end testing.
"""

SKILL_ID = "github.com/bruk-io/skillsign-e2e-test"
SKILL_VERSION = "0.0.1"
MANIFEST_CONTENT = f"skill_id: {SKILL_ID}\nskill_version: {SKILL_VERSION}\n"


def pytest_collection_modifyitems(
    config: pytest.Config, items: list[pytest.Item]
) -> None:
    if not os.getenv("SKILLSIGN_E2E"):
        skip = pytest.mark.skip(reason="Set SKILLSIGN_E2E=1 to run e2e tests")
        for item in items:
            if "e2e" in item.keywords:
                item.add_marker(skip)


@dataclass(frozen=True)
class SignedArtifacts:
    """Real Sigstore-signed artifacts for e2e test reuse."""

    skill_content: str
    manifest_content: str
    sidecar_text: str
    signer: str
    sidecar_fields: dict[str, Any] = field(default_factory=dict)


@pytest.fixture(scope="session")
def signed_artifacts(
    tmp_path_factory: pytest.TempPathFactory,
) -> SignedArtifacts:
    """Sign a SKILL.md once for the entire test session.

    Returns artifacts that verification tests can copy and manipulate
    without needing additional OIDC authentication.
    """
    base = tmp_path_factory.mktemp("signed")
    skill_file = base / "SKILL.md"
    skill_file.write_text(SKILL_CONTENT)
    manifest = base / "skillsign.yaml"
    manifest.write_text(MANIFEST_CONTENT)

    sidecar_data = sign_skill(skill_file, force=True)
    sidecar_path = Path(str(skill_file) + ".skillsign")
    write_sidecar(sidecar_data, sidecar_path)

    parsed = read_sidecar(sidecar_path)

    return SignedArtifacts(
        skill_content=SKILL_CONTENT,
        manifest_content=MANIFEST_CONTENT,
        sidecar_text=sidecar_path.read_text(),
        signer=sidecar_data["signer"],
        sidecar_fields=parsed,
    )


def setup_signed_copy(signed: SignedArtifacts, dest: Path) -> Path:
    """Copy signed artifacts to dest directory. Returns skill file path."""
    skill_file = dest / "SKILL.md"
    skill_file.write_text(signed.skill_content)
    sidecar_path = Path(str(skill_file) + ".skillsign")
    sidecar_path.write_text(signed.sidecar_text)
    return skill_file
