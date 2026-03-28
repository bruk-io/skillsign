"""CLI-level e2e tests exercising sign/verify through Click's CliRunner.

These tests are skipped by default. Set SKILLSIGN_E2E=1 to run them.

The ``signed_artifacts`` session fixture signs ONCE. CLI verify tests
copy those artifacts and invoke the CLI, avoiding repeated OIDC prompts.
"""

from pathlib import Path

import pytest
from click.testing import CliRunner

from skillsign.cli import cli

from .conftest import (
    MANIFEST_CONTENT,
    SKILL_CONTENT,
    SignedArtifacts,
    setup_signed_copy,
)

pytestmark = pytest.mark.e2e


@pytest.fixture
def runner() -> CliRunner:
    return CliRunner()


# --- Sign test (requires its own OIDC auth) ---


def test_sign_creates_sidecar(runner: CliRunner, tmp_path: Path) -> None:
    """sign command exits 0 and creates a .skillsign sidecar file."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_text(SKILL_CONTENT)
    (tmp_path / "skillsign.yaml").write_text(MANIFEST_CONTENT)
    sidecar_path = Path(str(skill_path) + ".skillsign")

    result = runner.invoke(cli, ["sign", str(skill_path), "--force"])

    assert result.exit_code == 0, (
        f"Expected exit 0, got {result.exit_code}:\n{result.output}"
    )
    assert sidecar_path.exists(), "Sidecar file was not created"


# --- Verify tests (reuse signed_artifacts, no extra auth) ---


def test_verify_signed_file_exits_0(
    runner: CliRunner,
    signed_artifacts: SignedArtifacts,
    tmp_path: Path,
) -> None:
    """Verify a signed file exits 0 with VERIFIED output."""
    skill_path = setup_signed_copy(signed_artifacts, tmp_path)

    result = runner.invoke(cli, ["verify", str(skill_path)])

    assert result.exit_code == 0, (
        f"Expected exit 0, got {result.exit_code}:\n{result.output}"
    )
    assert "VERIFIED" in result.output


def test_verify_tampered_file_exits_1(
    runner: CliRunner,
    signed_artifacts: SignedArtifacts,
    tmp_path: Path,
) -> None:
    """Tamper with file after signing, verify exits 1."""
    skill_path = setup_signed_copy(signed_artifacts, tmp_path)
    skill_path.write_text("# TAMPERED\n\nModified after signing.\n")

    result = runner.invoke(cli, ["verify", str(skill_path)])

    assert result.exit_code == 1, (
        f"Expected exit 1, got {result.exit_code}:\n{result.output}"
    )


def test_verify_unsigned_file_exits_2(runner: CliRunner, tmp_path: Path) -> None:
    """verify on a file with no sidecar exits 2 with UNSIGNED."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_text(SKILL_CONTENT)

    result = runner.invoke(cli, ["verify", str(skill_path)])

    assert result.exit_code == 2, (
        f"Expected exit 2, got {result.exit_code}:\n{result.output}"
    )
    assert "UNSIGNED" in result.output


def test_verify_multi_file_worst_exit(
    runner: CliRunner,
    signed_artifacts: SignedArtifacts,
    tmp_path: Path,
) -> None:
    """Multi-file verify: signed(0) + unsigned(2) = exit 2."""
    # Signed file
    dir_a = tmp_path / "a"
    dir_a.mkdir()
    skill_a = setup_signed_copy(signed_artifacts, dir_a)

    # Unsigned file
    dir_b = tmp_path / "b"
    dir_b.mkdir()
    skill_b = dir_b / "SKILL.md"
    skill_b.write_text(SKILL_CONTENT)

    result = runner.invoke(cli, ["verify", str(skill_a), str(skill_b)])

    assert result.exit_code == 2, (
        f"Expected exit 2 (worst of VERIFIED+UNSIGNED), "
        f"got {result.exit_code}:\n{result.output}"
    )
    assert "VERIFIED" in result.output
    assert "UNSIGNED" in result.output


def test_verify_output_format(
    runner: CliRunner,
    signed_artifacts: SignedArtifacts,
    tmp_path: Path,
) -> None:
    """VERIFIED output includes signer, skill_id, and skill_version."""
    skill_path = setup_signed_copy(signed_artifacts, tmp_path)

    result = runner.invoke(cli, ["verify", str(skill_path)])

    assert result.exit_code == 0
    assert "Signer:" in result.output
    assert "github.com/bruk-io/skillsign-e2e-test" in result.output
    assert "0.0.1" in result.output
