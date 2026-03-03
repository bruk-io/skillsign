"""Unit tests for manifest reader (Section 7.3)."""

import pytest

from skillsign.errors import SkillSignError
from skillsign.manifest import read_manifest

# --- Happy path ---


def test_valid_manifest(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: 1.0.0\n")
    skill_id, skill_version = read_manifest(manifest)
    assert skill_id == "github.com/org/skill"
    assert skill_version == "1.0.0"


def test_calver_version(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: 2025.03.01\n")
    _, skill_version = read_manifest(manifest)
    assert skill_version == "2025.03.01"


def test_yes_treated_as_string(tmp_path: pytest.TempPathFactory) -> None:
    """YAML 1.2: bare 'yes' is a string, not a boolean."""
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: 'yes'\n")
    _, skill_version = read_manifest(manifest)
    assert skill_version == "yes"


def test_no_treated_as_string(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: 'no'\n")
    _, skill_version = read_manifest(manifest)
    assert skill_version == "no"


def test_on_treated_as_string(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: 'on'\n")
    _, skill_version = read_manifest(manifest)
    assert skill_version == "on"


def test_off_treated_as_string(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: 'off'\n")
    _, skill_version = read_manifest(manifest)
    assert skill_version == "off"


def test_whitespace_in_values_trimmed(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(
        "skill_id: '  github.com/org/skill  '\nskill_version: '  v1  '\n"
    )
    skill_id, skill_version = read_manifest(manifest)
    assert skill_id == "github.com/org/skill"
    assert skill_version == "v1"


# --- Missing / invalid file ---


def test_missing_manifest(tmp_path: pytest.TempPathFactory) -> None:
    with pytest.raises(SkillSignError, match="not found") as exc_info:
        read_manifest(tmp_path / "skillsign.yaml")
    assert exc_info.value.exit_code == 10


def test_empty_manifest(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("")
    with pytest.raises(SkillSignError, match="Invalid manifest") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_missing_skill_id(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_version: 1.0\n")
    with pytest.raises(SkillSignError, match="Invalid manifest") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_missing_skill_version(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\n")
    with pytest.raises(SkillSignError, match="Invalid manifest") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


# --- YAML restriction violations ---


def test_duplicate_keys_rejected(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(
        "skill_id: github.com/org/a\nskill_id: github.com/org/b\nskill_version: 1.0\n"
    )
    with pytest.raises(SkillSignError, match="Invalid manifest") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_anchors_rejected(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(
        "skill_id: &anchor github.com/org/skill\nskill_version: *anchor\n"
    )
    with pytest.raises(SkillSignError, match="Invalid manifest") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_tags_rejected(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: !!str github.com/org/skill\nskill_version: 1.0\n")
    with pytest.raises(SkillSignError, match="Invalid manifest") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_multi_document_rejected(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(
        "skill_id: github.com/org/skill\n"
        "skill_version: 1.0\n"
        "---\n"
        "skill_id: github.com/org/other\n"
    )
    with pytest.raises(SkillSignError, match="Invalid manifest") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_file_over_64kb_rejected(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    # Valid YAML structure but padded with comments to exceed 64KB
    content = "skill_id: github.com/org/skill\nskill_version: 1.0\n"
    content += "# " + "x" * 65_536 + "\n"
    manifest.write_text(content)
    with pytest.raises(SkillSignError, match="64KB") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_file_exactly_64kb_passes(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    base = "skill_id: github.com/org/skill\nskill_version: 1.0\n"
    # Pad with comments to exactly 64KB
    padding_needed = 65_536 - len(base.encode("utf-8")) - 3  # "# " + "\n"
    content = base + "# " + "x" * padding_needed + "\n"
    assert len(content.encode("utf-8")) == 65_536
    manifest.write_text(content)
    skill_id, _ = read_manifest(manifest)
    assert skill_id == "github.com/org/skill"


# --- skill_id validation (delegated to digest.validate_skill_id) ---


def test_invalid_skill_id_no_dots_in_host(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: localhost/org/skill\nskill_version: 1.0\n")
    with pytest.raises(SkillSignError) as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_invalid_skill_id_wrong_segments(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org\nskill_version: 1.0\n")
    with pytest.raises(SkillSignError) as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


# --- skill_version validation (delegated to digest.validate_skill_version) ---


def test_empty_skill_version(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text("skill_id: github.com/org/skill\nskill_version: ''\n")
    with pytest.raises(SkillSignError, match="empty") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


def test_skill_version_too_long(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    long_version = "v" * 256
    manifest.write_text(
        f"skill_id: github.com/org/skill\nskill_version: {long_version}\n"
    )
    with pytest.raises(SkillSignError, match="255") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10


# --- Extra fields (should be rejected by strict schema) ---


def test_extra_unknown_fields_rejected(tmp_path: pytest.TempPathFactory) -> None:
    manifest = tmp_path / "skillsign.yaml"
    manifest.write_text(
        "skill_id: github.com/org/skill\nskill_version: 1.0\nextra_field: unexpected\n"
    )
    with pytest.raises(SkillSignError, match="Invalid manifest") as exc_info:
        read_manifest(manifest)
    assert exc_info.value.exit_code == 10
