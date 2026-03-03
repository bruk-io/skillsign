"""Integration tests for the SkillSign CLI — mocked OIDC and file I/O."""

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
# Verify: UNSIGNED exit code 2 (spec Section 9.3)
# ---------------------------------------------------------------------------


def test_verify_unsigned_exits_2(runner: CliRunner, tmp_skill_file: str) -> None:
    result = runner.invoke(cli, ["verify", tmp_skill_file])
    assert result.exit_code == 2
    assert "UNSIGNED" in result.output


# ---------------------------------------------------------------------------
# Unimplemented commands exit 10
# ---------------------------------------------------------------------------


def test_exit_10_for_not_implemented_inspect(
    runner: CliRunner, tmp_skill_file: str
) -> None:
    result = runner.invoke(cli, ["inspect", tmp_skill_file])
    assert result.exit_code == 10


def test_exit_10_for_not_implemented_unsign(
    runner: CliRunner, tmp_skill_file: str
) -> None:
    result = runner.invoke(cli, ["unsign", tmp_skill_file])
    assert result.exit_code == 10


# ---------------------------------------------------------------------------
# Auth commands (mocked OIDC)
# ---------------------------------------------------------------------------


def test_auth_login_success(runner: CliRunner) -> None:
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
    from unittest.mock import patch

    with patch("skillsign.auth._detect_ambient_credential", return_value=None):
        result = runner.invoke(cli, ["auth", "status"])
    assert result.exit_code == 0
    assert "Not authenticated" in result.output


def test_auth_status_with_ambient(runner: CliRunner) -> None:
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
# Verify: --strict flag
# ---------------------------------------------------------------------------


def test_verify_strict_flag_accepted(runner: CliRunner, tmp_skill_file: str) -> None:
    result = runner.invoke(cli, ["verify", "--strict", tmp_skill_file])
    # UNSIGNED because no sidecar — but the flag was accepted without error
    assert result.exit_code == 2
    assert "UNSIGNED" in result.output


def test_verify_strict_help_text(runner: CliRunner) -> None:
    result = runner.invoke(cli, ["verify", "--help"])
    assert result.exit_code == 0
    assert "--strict" in result.output
