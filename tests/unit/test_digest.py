"""Unit tests for signed input digest (Section 5.2)."""

import pytest

from skillsign.digest import (
    compute_digest,
    validate_skill_id,
    validate_skill_version,
)
from skillsign.errors import SkillSignError

# --- skill_id validation: valid ---


def test_valid_skill_id_basic() -> None:
    assert validate_skill_id("github.com/org/skill-name") == "github.com/org/skill-name"


def test_valid_skill_id_with_dots() -> None:
    assert validate_skill_id("github.com/user/my.skill") == "github.com/user/my.skill"


def test_valid_skill_id_non_github_host() -> None:
    assert validate_skill_id("gitlab.com/org/name") == "gitlab.com/org/name"


def test_valid_skill_id_underscores_hyphens() -> None:
    result = validate_skill_id("github.com/my_org/my-skill")
    assert result == "github.com/my_org/my-skill"


def test_skill_id_whitespace_trimmed() -> None:
    assert validate_skill_id("  github.com/org/skill  ") == "github.com/org/skill"


def test_skill_id_tab_trimmed() -> None:
    assert validate_skill_id("\tgithub.com/org/skill\t") == "github.com/org/skill"


# --- skill_id validation: invalid ---


def test_skill_id_two_segments_rejected() -> None:
    with pytest.raises(SkillSignError, match="host.*owner.*name") as exc_info:
        validate_skill_id("org/skill")
    assert exc_info.value.exit_code == 10


def test_skill_id_four_segments_rejected() -> None:
    with pytest.raises(SkillSignError, match="host.*owner.*name") as exc_info:
        validate_skill_id("github.com/org/skill/extra")
    assert exc_info.value.exit_code == 10


def test_skill_id_dotdot_segment_rejected() -> None:
    with pytest.raises(SkillSignError, match="must not be") as exc_info:
        validate_skill_id("github.com/../skill")
    assert exc_info.value.exit_code == 10


def test_skill_id_dot_segment_rejected() -> None:
    with pytest.raises(SkillSignError, match="must not be") as exc_info:
        validate_skill_id("github.com/./skill")
    assert exc_info.value.exit_code == 10


def test_skill_id_host_no_dot_rejected() -> None:
    with pytest.raises(SkillSignError, match="host.*'.'") as exc_info:
        validate_skill_id("localhost/org/skill")
    assert exc_info.value.exit_code == 10


def test_skill_id_space_in_segment_rejected() -> None:
    with pytest.raises(SkillSignError, match="invalid characters") as exc_info:
        validate_skill_id("github.com/org/skill name")
    assert exc_info.value.exit_code == 10


def test_skill_id_non_ascii_rejected() -> None:
    with pytest.raises(SkillSignError, match="non-ASCII") as exc_info:
        validate_skill_id("github.com/org/sk\u00efll")
    assert exc_info.value.exit_code == 10


def test_skill_id_null_byte_rejected() -> None:
    with pytest.raises(SkillSignError, match="null") as exc_info:
        validate_skill_id("github.com/org/skill\x00")
    assert exc_info.value.exit_code == 10


def test_skill_id_exceeds_255_chars_rejected() -> None:
    long_name = "a" * 241
    skill_id = f"github.com/org/{long_name}"
    assert len(skill_id) > 255
    with pytest.raises(SkillSignError, match="255") as exc_info:
        validate_skill_id(skill_id)
    assert exc_info.value.exit_code == 10


def test_skill_id_exactly_255_chars_passes() -> None:
    # github.com/org/ = 15 chars, need 240 more
    name = "a" * 240
    skill_id = f"github.com/org/{name}"
    assert len(skill_id) == 255
    assert validate_skill_id(skill_id) == skill_id


def test_skill_id_empty_segment_rejected() -> None:
    with pytest.raises(SkillSignError, match="invalid characters") as exc_info:
        validate_skill_id("github.com//skill")
    assert exc_info.value.exit_code == 10


# --- skill_version validation: valid ---


def test_valid_skill_version_basic() -> None:
    assert validate_skill_version("1.0.0") == "1.0.0"


def test_skill_version_trimmed() -> None:
    assert validate_skill_version("  1.0.0  ") == "1.0.0"


def test_skill_version_tab_trimmed() -> None:
    assert validate_skill_version("\t1.0.0\t") == "1.0.0"


def test_skill_version_printable_ascii() -> None:
    assert validate_skill_version("v1.2.3-beta+build.42") == "v1.2.3-beta+build.42"


def test_skill_version_exactly_255_chars() -> None:
    v = "a" * 255
    assert validate_skill_version(v) == v


# --- skill_version validation: invalid ---


def test_skill_version_empty_rejected() -> None:
    with pytest.raises(SkillSignError, match="empty") as exc_info:
        validate_skill_version("")
    assert exc_info.value.exit_code == 10


def test_skill_version_whitespace_only_rejected() -> None:
    with pytest.raises(SkillSignError, match="empty") as exc_info:
        validate_skill_version("   \t  ")
    assert exc_info.value.exit_code == 10


def test_skill_version_exceeds_255_chars_rejected() -> None:
    with pytest.raises(SkillSignError, match="255") as exc_info:
        validate_skill_version("a" * 256)
    assert exc_info.value.exit_code == 10


def test_skill_version_null_byte_in_validation_rejected() -> None:
    with pytest.raises(SkillSignError, match="invalid character"):
        validate_skill_version("1.0\x000")


def test_skill_version_newline_rejected() -> None:
    with pytest.raises(SkillSignError, match="invalid character"):
        validate_skill_version("1.0\n0")


def test_skill_version_control_char_rejected() -> None:
    with pytest.raises(SkillSignError, match="invalid character"):
        validate_skill_version("1.0\x07")


def test_skill_version_non_ascii_rejected() -> None:
    with pytest.raises(SkillSignError, match="invalid character"):
        validate_skill_version("v1.0\u00e9")


def test_skill_version_del_char_rejected() -> None:
    # U+007F (DEL) is outside printable ASCII range
    with pytest.raises(SkillSignError, match="invalid character"):
        validate_skill_version("v1.0\x7f")


# --- Digest computation ---


def test_known_test_vector() -> None:
    canonical = b"# Hello\n"
    skill_id = "github.com/example-org/my-skill"
    skill_version = "1.0.0"
    digest = compute_digest(canonical, skill_id, skill_version)
    expected = bytes.fromhex(
        "b40d88ef422d3ff31afe31b422209f819d2f640ec8533c591ec8e5c30e92126d"
    )
    assert digest == expected


def test_digest_is_32_bytes() -> None:
    digest = compute_digest(b"content\n", "github.com/org/skill", "1.0.0")
    assert len(digest) == 32


def test_different_skill_id_different_digest() -> None:
    canonical = b"same content\n"
    d1 = compute_digest(canonical, "github.com/org/skill-a", "1.0.0")
    d2 = compute_digest(canonical, "github.com/org/skill-b", "1.0.0")
    assert d1 != d2


def test_different_version_different_digest() -> None:
    canonical = b"same content\n"
    d1 = compute_digest(canonical, "github.com/org/skill", "1.0.0")
    d2 = compute_digest(canonical, "github.com/org/skill", "2.0.0")
    assert d1 != d2


def test_case_sensitive_skill_id() -> None:
    canonical = b"content\n"
    d1 = compute_digest(canonical, "github.com/Org/skill", "1.0.0")
    d2 = compute_digest(canonical, "github.com/org/skill", "1.0.0")
    assert d1 != d2


def test_canonical_bytes_null_byte_rejected() -> None:
    with pytest.raises(SkillSignError, match="null") as exc_info:
        compute_digest(b"content\x00\n", "github.com/org/skill", "1.0.0")
    assert exc_info.value.exit_code == 10


def test_skill_version_null_byte_rejected() -> None:
    with pytest.raises(SkillSignError, match="invalid char") as exc_info:
        compute_digest(b"content\n", "github.com/org/skill", "1.0\x000")
    assert exc_info.value.exit_code == 10


def test_skill_version_whitespace_trimmed() -> None:
    d1 = compute_digest(b"c\n", "github.com/org/skill", "1.0.0")
    d2 = compute_digest(b"c\n", "github.com/org/skill", "  1.0.0  ")
    assert d1 == d2
