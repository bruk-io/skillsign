"""Integration tests for the SkillSign CLI — mocked OIDC and file I/O."""

import os
import tempfile
from pathlib import Path

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


def test_inspect_no_sidecar_exits_2(runner: CliRunner, tmp_skill_file: str) -> None:
    result = runner.invoke(cli, ["inspect", tmp_skill_file])
    assert result.exit_code == 2
    assert "UNSIGNED" in result.output


def test_inspect_valid_sidecar_exits_0(runner: CliRunner) -> None:
    """inspect command displays metadata from a valid sidecar and exits 0."""
    from tests.conftest import write_sidecar_yaml
    from tests.integration.conftest import make_sidecar

    with tempfile.TemporaryDirectory() as tmpdir:
        skill_path = Path(tmpdir) / "SKILL.md"
        skill_content = b"# My Skill\n\nDoes stuff.\n"
        skill_path.write_bytes(skill_content)

        sidecar, _ = make_sidecar(skill_content)
        sidecar_path = Path(str(skill_path) + ".skillsign")
        write_sidecar_yaml(sidecar, sidecar_path)

        result = runner.invoke(cli, ["inspect", str(skill_path)])

    assert result.exit_code == 0, result.output
    assert "SIGNED" in result.output
    assert sidecar["signer"] in result.output
    assert sidecar["skill_id"] in result.output
    assert sidecar["skill_version"] in result.output
    assert sidecar["digest"] in result.output
    assert sidecar["rekor_log_id"] in result.output


def test_inspect_malformed_sidecar_exits_1(runner: CliRunner) -> None:
    """inspect command reports error and exits 1 for malformed sidecar."""
    with tempfile.TemporaryDirectory() as tmpdir:
        skill_path = Path(tmpdir) / "SKILL.md"
        skill_path.write_bytes(b"# My Skill\n")

        sidecar_path = Path(str(skill_path) + ".skillsign")
        sidecar_path.write_text("version: 1\nskill_id: bad\n")

        result = runner.invoke(cli, ["inspect", str(skill_path)])

    assert result.exit_code == 1
    assert "Error:" in result.output


# ---------------------------------------------------------------------------
# unsign command
# ---------------------------------------------------------------------------


def test_unsign_deletes_sidecar_and_exits_zero(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        sidecar = Path(str(skill) + ".skillsign")
        skill.write_text("# SKILL\n")
        sidecar.write_text("sidecar content")

        result = runner.invoke(cli, ["unsign", str(skill)])

        assert result.exit_code == 0
        assert f"Removed: {sidecar}" in result.output
        assert not sidecar.exists()
        assert skill.exists()


def test_unsign_no_sidecar_exits_2(runner: CliRunner, tmp_skill_file: str) -> None:
    result = runner.invoke(cli, ["unsign", tmp_skill_file])
    assert result.exit_code == 2
    assert "no sidecar found" in result.output


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


# ---------------------------------------------------------------------------
# --quiet flag suppresses stdout, exit codes unchanged
# ---------------------------------------------------------------------------


def test_quiet_verify_unsigned_suppresses_output(
    runner: CliRunner, tmp_skill_file: str
) -> None:
    result = runner.invoke(cli, ["--quiet", "verify", tmp_skill_file])
    assert result.exit_code == 2
    assert result.output == ""


def test_quiet_sign_suppresses_output(runner: CliRunner) -> None:
    from unittest.mock import patch

    with tempfile.TemporaryDirectory() as tmpdir:
        skill_path = Path(tmpdir) / "SKILL.md"
        skill_path.write_bytes(b"---\nskill_id: test/skill\nversion: '1.0'\n---\n# T\n")

        mock_sidecar = {
            "signer": "user@example.com",
            "skill_id": "test/skill",
            "skill_version": "1.0",
        }
        with (
            patch("skillsign.signing.sign_skill", return_value=mock_sidecar),
            patch("skillsign.sidecar.write_sidecar"),
        ):
            result = runner.invoke(cli, ["--quiet", "sign", str(skill_path)])

    assert result.exit_code == 0
    assert result.output == ""


def test_quiet_with_json_format_still_suppresses(
    runner: CliRunner, tmp_skill_file: str
) -> None:
    result = runner.invoke(
        cli, ["--quiet", "--format", "json", "verify", tmp_skill_file]
    )
    assert result.exit_code == 2
    assert result.output == ""


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


# ---------------------------------------------------------------------------
# Verify: glob pattern expansion
# ---------------------------------------------------------------------------


def test_verify_glob_pattern_expands_multiple_files(
    runner: CliRunner, tmp_path: Path
) -> None:
    """A glob pattern matching multiple .md files runs verify on all of them."""
    (tmp_path / "a.md").write_text("# A\n")
    (tmp_path / "b.md").write_text("# B\n")
    pattern = str(tmp_path / "*.md")

    result = runner.invoke(cli, ["verify", pattern])

    # Both files are unsigned — worst exit is 2 (UNSIGNED)
    assert result.exit_code == 2
    assert "UNSIGNED" in result.output


def test_verify_glob_pattern_no_match_exits_10(
    runner: CliRunner, tmp_path: Path
) -> None:
    """A glob pattern that matches no files exits 10 with an error message."""
    pattern = str(tmp_path / "*.md")

    result = runner.invoke(cli, ["verify", pattern])

    assert result.exit_code == 10
    assert "no files matched" in result.output


def test_verify_directory_arg_finds_md_files(runner: CliRunner, tmp_path: Path) -> None:
    """Passing a directory verifies all *.md files in it."""
    (tmp_path / "SKILL.md").write_text("# SKILL\n")
    (tmp_path / "other.md").write_text("# other\n")
    (tmp_path / "readme.txt").write_text("not md\n")

    result = runner.invoke(cli, ["verify", str(tmp_path)])

    assert result.exit_code == 2
    assert "UNSIGNED" in result.output


def test_verify_directory_with_no_md_files_exits_10(
    runner: CliRunner, tmp_path: Path
) -> None:
    """A directory with no *.md files exits 10."""
    (tmp_path / "readme.txt").write_text("no md files here\n")

    result = runner.invoke(cli, ["verify", str(tmp_path)])

    assert result.exit_code == 10
    assert "no files matched" in result.output


def test_verify_glob_json_output_is_array(runner: CliRunner, tmp_path: Path) -> None:
    """--format json with a glob pattern always returns a JSON array."""
    (tmp_path / "a.md").write_text("# A\n")
    (tmp_path / "b.md").write_text("# B\n")
    pattern = str(tmp_path / "*.md")

    result = runner.invoke(cli, ["--format", "json", "verify", pattern])

    assert result.exit_code == 2
    import json

    data = json.loads(result.output)
    assert isinstance(data, list)
    assert len(data) == 2
    assert all(item["result"] == "UNSIGNED" for item in data)


def test_verify_recursive_glob(runner: CliRunner, tmp_path: Path) -> None:
    """A ** glob finds nested .md files recursively."""
    sub = tmp_path / "sub"
    sub.mkdir()
    (tmp_path / "root.md").write_text("# root\n")
    (sub / "nested.md").write_text("# nested\n")
    pattern = str(tmp_path / "**" / "*.md")

    result = runner.invoke(cli, ["verify", pattern])

    assert result.exit_code == 2
    assert result.output.count("UNSIGNED") == 2
