"""Unit tests for the SkillSign CLI — no mocked I/O, Click CliRunner only."""

import pytest
from click.testing import CliRunner

from skillsign.cli import cli


@pytest.fixture
def runner() -> CliRunner:
    return CliRunner()


# ---------------------------------------------------------------------------
# Basic navigation / help / version (exit 0)
# ---------------------------------------------------------------------------


def test_cli_help_exits_zero(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["--help"])
    assert result.exit_code == 0
    assert "SKILL.md" in result.output


def test_cli_version(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["--version"])
    assert result.exit_code == 0
    assert "0.1.0" in result.output


def test_auth_help(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["auth", "--help"])
    assert result.exit_code == 0
    assert "login" in result.output
    assert "status" in result.output


def test_sign_help(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["sign", "--help"])
    assert result.exit_code == 0


def test_verify_help(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["verify", "--help"])
    assert result.exit_code == 0


def test_inspect_help(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["inspect", "--help"])
    assert result.exit_code == 0


def test_unsign_help(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["unsign", "--help"])
    assert result.exit_code == 0


def test_cli_lists_all_commands(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["--help"])
    assert result.exit_code == 0
    for cmd in ("auth", "sign", "verify", "inspect", "unsign"):
        assert cmd in result.output


# ---------------------------------------------------------------------------
# Exit code 10: CLI/usage errors (spec Section 9.3)
# ---------------------------------------------------------------------------


def test_exit_10_for_unknown_command(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["bogus-command"])
    assert result.exit_code == 10


def test_exit_10_for_unknown_flag(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["sign", "--unknown-flag"])
    assert result.exit_code == 10


def test_exit_10_for_sign_missing_file(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["sign", "/nonexistent/does-not-exist.md"])
    assert result.exit_code == 10


def test_exit_10_for_verify_missing_file(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["verify", "/nonexistent/does-not-exist.md"])
    assert result.exit_code == 10


def test_exit_10_for_inspect_missing_file(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["inspect", "/nonexistent/does-not-exist.md"])
    assert result.exit_code == 10


def test_exit_10_for_unsign_missing_file(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["unsign", "/nonexistent/does-not-exist.md"])
    assert result.exit_code == 10


def test_exit_10_for_verify_missing_required_arg(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["verify"])
    assert result.exit_code == 10


# ---------------------------------------------------------------------------
# Exit code constants (spec Section 9.3)
# ---------------------------------------------------------------------------


def test_exit_code_constants_have_correct_values() -> None:
    from skillsign.exit_codes import (
        EXIT_CLI_ERROR,
        EXIT_FAILURE,
        EXIT_POLICY_FAIL,
        EXIT_UNSIGNED,
        EXIT_VERIFIED,
    )

    assert EXIT_VERIFIED == 0
    assert EXIT_FAILURE == 1
    assert EXIT_UNSIGNED == 2
    assert EXIT_POLICY_FAIL == 3
    assert EXIT_CLI_ERROR == 10


# ---------------------------------------------------------------------------
# SkillSignError default exit code
# ---------------------------------------------------------------------------


def test_skillsign_error_default_exit_code() -> None:
    from skillsign.errors import SkillSignError
    from skillsign.exit_codes import EXIT_FAILURE

    err = SkillSignError("test failure")
    assert err.exit_code == EXIT_FAILURE


def test_skillsign_error_custom_exit_code() -> None:
    from skillsign.errors import SkillSignError
    from skillsign.exit_codes import EXIT_CLI_ERROR, EXIT_POLICY_FAIL, EXIT_UNSIGNED

    err = SkillSignError("unsigned", exit_code=EXIT_UNSIGNED)
    assert err.exit_code == 2

    err = SkillSignError("policy fail", exit_code=EXIT_POLICY_FAIL)
    assert err.exit_code == 3

    err = SkillSignError("cli error", exit_code=EXIT_CLI_ERROR)
    assert err.exit_code == 10


# ---------------------------------------------------------------------------
# Exit code severity: spec order is 1 > 3 > 2 > 0 (not numeric max)
# ---------------------------------------------------------------------------


def test_exit_severity_tampered_beats_policy_fail() -> None:
    """TAMPERED(1) + POLICY_FAIL(3) must yield exit 1, not 3."""
    from skillsign.cli import _EXIT_SEVERITY

    # Severity of 1 (TAMPERED/hard failure) must be higher than 3 (POLICY_FAIL)
    assert _EXIT_SEVERITY[1] > _EXIT_SEVERITY[3]


def test_exit_severity_policy_fail_beats_unsigned() -> None:
    """POLICY_FAIL(3) must rank above UNSIGNED(2)."""
    from skillsign.cli import _EXIT_SEVERITY

    assert _EXIT_SEVERITY[3] > _EXIT_SEVERITY[2]


def test_exit_severity_unsigned_beats_verified() -> None:
    """UNSIGNED(2) must rank above VERIFIED(0)."""
    from skillsign.cli import _EXIT_SEVERITY

    assert _EXIT_SEVERITY[2] > _EXIT_SEVERITY[0]
