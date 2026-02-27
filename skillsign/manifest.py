"""Manifest reader per Section 7.3 of the SkillSign spec."""

from pathlib import Path

from strictyaml import Map, Str, YAMLError, load

from skillsign.digest import validate_skill_id, validate_skill_version
from skillsign.errors import SkillSignError

_MAX_MANIFEST_SIZE = 65_536  # 64KB
_MANIFEST_SCHEMA = Map({"skill_id": Str(), "skill_version": Str()})


def read_manifest(manifest_path: Path) -> tuple[str, str]:
    """Read and validate skillsign.yaml, returning (skill_id, skill_version).

    Parse with YAML 1.2 semantics and Section 6.1 restrictions:
    no duplicate keys, no anchors/aliases, no tags, no multi-document streams,
    max 64KB file size. Validate skill_id and skill_version per spec.

    Raises SkillSignError with exit_code=10 on any validation failure.
    """
    # Read raw bytes for size check
    try:
        raw = manifest_path.read_bytes()
    except FileNotFoundError as e:
        raise SkillSignError(
            f"Manifest not found: {manifest_path}", exit_code=10
        ) from e
    except OSError as e:
        raise SkillSignError(f"Cannot read manifest: {e}", exit_code=10) from e

    # Size check
    if len(raw) > _MAX_MANIFEST_SIZE:
        raise SkillSignError(
            f"Manifest exceeds 64KB size limit ({len(raw)} bytes)", exit_code=10
        )

    # Decode as UTF-8
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as e:
        raise SkillSignError(
            f"Manifest contains invalid UTF-8: {e}", exit_code=10
        ) from e

    # Parse with strictyaml (enforces YAML 1.2, rejects duplicates,
    # anchors, aliases, tags, and multi-document streams)
    try:
        parsed = load(text, _MANIFEST_SCHEMA)
    except YAMLError as e:
        raise SkillSignError(f"Invalid manifest YAML: {e}", exit_code=10) from e

    data = parsed.data
    skill_id = validate_skill_id(data["skill_id"])
    skill_version = validate_skill_version(data["skill_version"])

    return skill_id, skill_version
