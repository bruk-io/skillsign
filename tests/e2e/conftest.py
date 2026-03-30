"""E2E test configuration — skips unless SKILLSIGN_E2E=1.

Provides a session-scoped ``signed_artifacts`` fixture that performs ONE
real Sigstore signing, then caches the artifacts to disk for 24 hours.
Subsequent test runs within 24h reuse the cache — no browser prompt needed.
"""

import json
import os
import time
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

_CACHE_DIR = Path(__file__).resolve().parent / ".cache"
_CACHE_FILE = _CACHE_DIR / "signed_artifacts.json"
_CACHE_MAX_AGE = 24 * 60 * 60  # 24 hours


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


def _load_cached() -> SignedArtifacts | None:
    """Load cached artifacts if they exist and are fresh enough."""
    if not _CACHE_FILE.exists():
        return None
    try:
        raw = json.loads(_CACHE_FILE.read_text())
        if time.time() - raw["timestamp"] > _CACHE_MAX_AGE:
            return None
        return SignedArtifacts(
            skill_content=raw["skill_content"],
            manifest_content=raw["manifest_content"],
            sidecar_text=raw["sidecar_text"],
            signer=raw["signer"],
            sidecar_fields=raw["sidecar_fields"],
        )
    except json.JSONDecodeError, KeyError, OSError:
        return None


def _save_cache(artifacts: SignedArtifacts) -> None:
    """Save artifacts to disk cache."""
    _CACHE_DIR.mkdir(parents=True, exist_ok=True)
    _CACHE_FILE.write_text(
        json.dumps(
            {
                "timestamp": time.time(),
                "skill_content": artifacts.skill_content,
                "manifest_content": artifacts.manifest_content,
                "sidecar_text": artifacts.sidecar_text,
                "signer": artifacts.signer,
                "sidecar_fields": artifacts.sidecar_fields,
            },
            indent=2,
        )
    )


@pytest.fixture(scope="session")
def signed_artifacts(
    tmp_path_factory: pytest.TempPathFactory,
) -> SignedArtifacts:
    """Sign a SKILL.md once, cached to disk for 24 hours.

    First run: signs with real Sigstore (browser prompt), caches result.
    Subsequent runs within 24h: loads from cache, no auth needed.
    """
    cached = _load_cached()
    if cached is not None:
        return cached

    base = tmp_path_factory.mktemp("signed")
    skill_file = base / "SKILL.md"
    skill_file.write_text(SKILL_CONTENT)
    manifest = base / "skillsign.yaml"
    manifest.write_text(MANIFEST_CONTENT)

    sidecar_data = sign_skill(skill_file, force=True)
    sidecar_path = Path(str(skill_file) + ".skillsign")
    write_sidecar(sidecar_data, sidecar_path)

    parsed = read_sidecar(sidecar_path)

    artifacts = SignedArtifacts(
        skill_content=SKILL_CONTENT,
        manifest_content=MANIFEST_CONTENT,
        sidecar_text=sidecar_path.read_text(),
        signer=sidecar_data["signer"],
        sidecar_fields=parsed,
    )

    _save_cache(artifacts)
    return artifacts


def setup_signed_copy(signed: SignedArtifacts, dest: Path) -> Path:
    """Copy signed artifacts to dest directory. Returns skill file path."""
    skill_file = dest / "SKILL.md"
    skill_file.write_text(signed.skill_content)
    sidecar_path = Path(str(skill_file) + ".skillsign")
    sidecar_path.write_text(signed.sidecar_text)
    return skill_file
