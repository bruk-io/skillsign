"""Smoke tests for the SkillSign CLI."""

import os
import tempfile

import pytest
from click.testing import CliRunner

from skillsign.cli import cli


@pytest.fixture
def runner() -> CliRunner:
    return CliRunner()


@pytest.fixture
def tmp_skill_file() -> str:
    """Create a temporary file that exists on disk for click.Path(exists=True) tests."""
    with tempfile.NamedTemporaryFile(suffix=".md", delete=False) as f:
        f.write(b"# SKILL\n")
        path = f.name
    yield path
    if os.path.exists(path):
        os.unlink(path)


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
    """Unknown command must exit 10, not Click's default 2."""
    result = runner.invoke(cli, ["bogus-command"])
    assert result.exit_code == 10


def test_exit_10_for_unknown_flag(runner: CliRunner) -> None:
    """Unknown flag must exit 10, not Click's default 2."""
    result = runner.invoke(cli, ["sign", "--unknown-flag"])
    assert result.exit_code == 10


def test_exit_10_for_sign_missing_file(runner: CliRunner) -> None:
    """sign with a nonexistent file must exit 10 (file not found = CLI error)."""
    result = runner.invoke(cli, ["sign", "/nonexistent/does-not-exist.md"])
    assert result.exit_code == 10


def test_exit_10_for_verify_missing_file(runner: CliRunner) -> None:
    """verify with a nonexistent file must exit 10."""
    result = runner.invoke(cli, ["verify", "/nonexistent/does-not-exist.md"])
    assert result.exit_code == 10


def test_exit_10_for_inspect_missing_file(runner: CliRunner) -> None:
    """inspect with a nonexistent file must exit 10."""
    result = runner.invoke(cli, ["inspect", "/nonexistent/does-not-exist.md"])
    assert result.exit_code == 10


def test_exit_10_for_unsign_missing_file(runner: CliRunner) -> None:
    """unsign with a nonexistent file must exit 10."""
    result = runner.invoke(cli, ["unsign", "/nonexistent/does-not-exist.md"])
    assert result.exit_code == 10


def test_exit_10_for_verify_missing_required_arg(runner: CliRunner) -> None:
    """verify with no arguments (missing required arg) must exit 10."""
    result = runner.invoke(cli, ["verify"])
    assert result.exit_code == 10


# ---------------------------------------------------------------------------
# Verify: UNSIGNED exit code 2 (spec Section 9.3)
# ---------------------------------------------------------------------------


def test_verify_unsigned_exits_2(runner: CliRunner, tmp_skill_file: str) -> None:
    """verify on a file with no sidecar returns UNSIGNED (exit 2)."""
    result = runner.invoke(cli, ["verify", tmp_skill_file])
    assert result.exit_code == 2
    assert "UNSIGNED" in result.output


# ---------------------------------------------------------------------------
# Unimplemented commands exit 10
# ---------------------------------------------------------------------------


def test_exit_10_for_not_implemented_inspect(
    runner: CliRunner, tmp_skill_file: str
) -> None:
    """inspect on an existing file exits 10 (not yet implemented)."""
    result = runner.invoke(cli, ["inspect", tmp_skill_file])
    assert result.exit_code == 10


def test_exit_10_for_not_implemented_unsign(
    runner: CliRunner, tmp_skill_file: str
) -> None:
    """unsign on an existing file exits 10 (not yet implemented)."""
    result = runner.invoke(cli, ["unsign", tmp_skill_file])
    assert result.exit_code == 10


def test_auth_login_success(runner: CliRunner) -> None:
    """auth login with mocked OIDC flow exits 0 and shows identity."""
    from unittest.mock import MagicMock, patch

    mock_token = MagicMock()
    mock_token.identity = "https://github.com/testuser"
    mock_token.federated_issuer = "https://accounts.google.com"

    with patch("skillsign.auth.get_identity_token", return_value=mock_token):
        result = runner.invoke(cli, ["auth", "login"])
    assert result.exit_code == 0
    assert "https://github.com/testuser" in result.output
    assert "Authenticated as:" in result.output


def test_auth_login_failure(runner: CliRunner) -> None:
    """auth login exits 10 when OIDC fails."""
    from unittest.mock import patch

    from skillsign.errors import SkillSignError

    with patch(
        "skillsign.auth.get_identity_token",
        side_effect=SkillSignError("OIDC failed", exit_code=10),
    ):
        result = runner.invoke(cli, ["auth", "login"])
    assert result.exit_code == 10
    assert "OIDC failed" in result.output


def test_auth_status_no_ambient(runner: CliRunner) -> None:
    """auth status with no ambient credentials exits 0 and shows not authenticated."""
    from unittest.mock import patch

    with patch("skillsign.auth._detect_ambient_credential", return_value=None):
        result = runner.invoke(cli, ["auth", "status"])
    assert result.exit_code == 0
    assert "Not authenticated" in result.output


def test_auth_status_with_ambient(runner: CliRunner) -> None:
    """auth status with ambient credentials exits 0 and shows identity."""
    from unittest.mock import MagicMock, patch

    mock_token = MagicMock()
    mock_token.identity = (
        "https://github.com/org/repo/.github/workflows/ci.yml@refs/heads/main"
    )
    mock_token.federated_issuer = "https://token.actions.githubusercontent.com"
    mock_token.in_validity_period.return_value = True

    with (
        patch(
            "skillsign.auth._detect_ambient_credential",
            return_value="fake.jwt.token",
        ),
        patch("sigstore.oidc.IdentityToken", return_value=mock_token),
    ):
        result = runner.invoke(cli, ["auth", "status"])
    assert result.exit_code == 0
    assert "Authenticated as:" in result.output


def test_auth_status_expired_token(runner: CliRunner) -> None:
    """auth status with expired ambient token shows expired message."""
    from unittest.mock import MagicMock, patch

    mock_token = MagicMock()
    mock_token.in_validity_period.return_value = False

    with (
        patch(
            "skillsign.auth._detect_ambient_credential",
            return_value="fake.jwt.token",
        ),
        patch("sigstore.oidc.IdentityToken", return_value=mock_token),
    ):
        result = runner.invoke(cli, ["auth", "status"])
    assert result.exit_code == 0
    assert "Token expired" in result.output


# ---------------------------------------------------------------------------
# Exit code constants (spec Section 9.3)
# ---------------------------------------------------------------------------


def test_exit_code_constants_have_correct_values() -> None:
    """Named constants must match spec Section 9.3 exactly."""
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
    """SkillSignError defaults to EXIT_FAILURE (1) for hard verification failures."""
    from skillsign.errors import SkillSignError
    from skillsign.exit_codes import EXIT_FAILURE

    err = SkillSignError("test failure")
    assert err.exit_code == EXIT_FAILURE


def test_skillsign_error_custom_exit_code() -> None:
    """SkillSignError accepts any named exit code constant."""
    from skillsign.errors import SkillSignError
    from skillsign.exit_codes import EXIT_CLI_ERROR, EXIT_POLICY_FAIL, EXIT_UNSIGNED

    err = SkillSignError("unsigned", exit_code=EXIT_UNSIGNED)
    assert err.exit_code == 2

    err = SkillSignError("policy fail", exit_code=EXIT_POLICY_FAIL)
    assert err.exit_code == 3

    err = SkillSignError("cli error", exit_code=EXIT_CLI_ERROR)
    assert err.exit_code == 10
