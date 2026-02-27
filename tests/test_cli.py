"""Smoke tests for the SkillSign CLI."""

from click.testing import CliRunner

from skillsign.cli import cli


def test_cli_help_exits_zero() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["--help"])
    assert result.exit_code == 0
    assert "SKILL.md" in result.output


def test_cli_version() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["--version"])
    assert result.exit_code == 0
    assert "0.1.0" in result.output


def test_auth_help() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["auth", "--help"])
    assert result.exit_code == 0
    assert "login" in result.output
    assert "status" in result.output


def test_sign_help() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["sign", "--help"])
    assert result.exit_code == 0


def test_verify_help() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["verify", "--help"])
    assert result.exit_code == 0


def test_inspect_help() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["inspect", "--help"])
    assert result.exit_code == 0


def test_unsign_help() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["unsign", "--help"])
    assert result.exit_code == 0


def test_cli_lists_all_commands() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["--help"])
    assert result.exit_code == 0
    for cmd in ("auth", "sign", "verify", "inspect", "unsign"):
        assert cmd in result.output
