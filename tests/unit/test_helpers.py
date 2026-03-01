"""Unit tests for extracted pure helper functions."""

import datetime

from skillsign.cli import _format_sign_output, _format_verification_output
from skillsign.verify import _is_timestamp_in_window

# ---------------------------------------------------------------------------
# _is_timestamp_in_window
# ---------------------------------------------------------------------------

_NOW = datetime.datetime(2026, 3, 1, 12, 0, 0, tzinfo=datetime.UTC)
_BEFORE = _NOW - datetime.timedelta(hours=1)
_AFTER = _NOW + datetime.timedelta(hours=1)


def test_timestamp_in_window_within() -> None:
    assert _is_timestamp_in_window(_NOW, _BEFORE, _AFTER) is True


def test_timestamp_in_window_at_not_before() -> None:
    assert _is_timestamp_in_window(_BEFORE, _BEFORE, _AFTER) is True


def test_timestamp_in_window_at_not_after() -> None:
    assert _is_timestamp_in_window(_AFTER, _BEFORE, _AFTER) is True


def test_timestamp_in_window_before_range() -> None:
    too_early = _BEFORE - datetime.timedelta(seconds=1)
    assert _is_timestamp_in_window(too_early, _BEFORE, _AFTER) is False


def test_timestamp_in_window_after_range() -> None:
    too_late = _AFTER + datetime.timedelta(seconds=1)
    assert _is_timestamp_in_window(too_late, _BEFORE, _AFTER) is False


# ---------------------------------------------------------------------------
# _format_verification_output
# ---------------------------------------------------------------------------


def test_format_verification_output_verified() -> None:
    meta = {
        "signer": "https://github.com/org/repo",
        "skill_id": "github.com/org/skill",
        "skill_version": "1.0.0",
    }
    output = _format_verification_output("SKILL.md", "VERIFIED", meta)
    assert "VERIFIED" in output
    assert "Signer:" in output
    assert "Skill:" in output


def test_format_verification_output_unsigned() -> None:
    output = _format_verification_output("SKILL.md", "UNSIGNED", {})
    assert "UNSIGNED" in output
    assert "no sidecar found" in output


def test_format_verification_output_error_with_detail() -> None:
    meta = {"error": "Digest mismatch"}
    output = _format_verification_output("SKILL.md", "TAMPERED", meta)
    assert "TAMPERED" in output
    assert "Digest mismatch" in output


def test_format_verification_output_error_without_detail() -> None:
    output = _format_verification_output("SKILL.md", "TAMPERED", {})
    assert "TAMPERED" in output
    assert output.count("\n") == 0


# ---------------------------------------------------------------------------
# _format_sign_output
# ---------------------------------------------------------------------------


def test_format_sign_output() -> None:
    output = _format_sign_output(
        "SKILL.md", "SKILL.md.skillsign", "https://github.com/org/repo"
    )
    assert "Signed: SKILL.md" in output
    assert "Sidecar: SKILL.md.skillsign" in output
    assert "Signer: https://github.com/org/repo" in output
