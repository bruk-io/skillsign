"""Unit tests for the SkillSign CLI — no mocked I/O, Click CliRunner only."""

import tempfile
from pathlib import Path
from unittest.mock import patch

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


# ---------------------------------------------------------------------------
# unsign command
# ---------------------------------------------------------------------------


def test_unsign_removes_sidecar_exits_zero(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        sidecar = Path(str(skill) + ".skillsign")
        skill.write_text("# SKILL\n")
        sidecar.write_text("sidecar content")

        result = runner.invoke(cli, ["unsign", str(skill)])

        assert result.exit_code == 0
        assert "Removed:" in result.output
        assert not sidecar.exists()


def test_unsign_no_sidecar_exits_2(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        skill.write_text("# SKILL\n")

        result = runner.invoke(cli, ["unsign", str(skill)])

        assert result.exit_code == 2
        assert "no sidecar found" in result.output


def test_unsign_oserror_exits_10(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        sidecar = Path(str(skill) + ".skillsign")
        skill.write_text("# SKILL\n")
        sidecar.write_text("sidecar content")

        with patch("pathlib.Path.unlink", side_effect=OSError("permission denied")):
            result = runner.invoke(cli, ["unsign", str(skill)])

        assert result.exit_code == 10
        assert "Error:" in result.output


# ---------------------------------------------------------------------------
# _format_inspect_output and _extract_cert_names
# ---------------------------------------------------------------------------


def _make_test_pem() -> str:
    """Generate a self-signed P-256 PEM cert with CN=SkillSign Test."""
    from datetime import UTC, datetime, timedelta

    from cryptography import x509
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.asymmetric import ec
    from cryptography.hazmat.primitives.serialization import Encoding
    from cryptography.x509.oid import NameOID

    key = ec.generate_private_key(ec.SECP256R1())
    subject = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "SkillSign Test")])
    issuer = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "SkillSign Issuer")])
    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.now(UTC) - timedelta(hours=1))
        .not_valid_after(datetime.now(UTC) + timedelta(hours=1))
        .sign(key, hashes.SHA256())
    )
    return cert.public_bytes(Encoding.PEM).decode()


def test_extract_cert_names_returns_subject_and_issuer() -> None:
    from skillsign.cli import _extract_cert_names

    pem = _make_test_pem()
    subject_cn, issuer_cn = _extract_cert_names(pem)
    assert subject_cn == "SkillSign Test"
    assert issuer_cn == "SkillSign Issuer"


def test_extract_cert_names_no_cn_falls_back_to_unknown() -> None:
    from datetime import UTC, datetime, timedelta

    from cryptography import x509
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.asymmetric import ec
    from cryptography.hazmat.primitives.serialization import Encoding
    from cryptography.x509.oid import NameOID

    from skillsign.cli import _extract_cert_names

    key = ec.generate_private_key(ec.SECP256R1())
    # Use OU instead of CN so CN is absent
    subject = x509.Name([x509.NameAttribute(NameOID.ORGANIZATION_NAME, "TestOrg")])
    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(subject)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.now(UTC) - timedelta(hours=1))
        .not_valid_after(datetime.now(UTC) + timedelta(hours=1))
        .sign(key, hashes.SHA256())
    )
    pem = cert.public_bytes(Encoding.PEM).decode()
    subject_cn, issuer_cn = _extract_cert_names(pem)
    assert subject_cn == "<unknown>"
    assert issuer_cn == "<unknown>"


def test_format_inspect_output_contains_all_fields() -> None:
    from skillsign.cli import _format_inspect_output

    pem = _make_test_pem()
    data = {
        "signer": "https://github.com/test-org/repo",
        "skill_id": "github.com/test-org/my-skill",
        "skill_version": "1.0.0",
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": "sha256:" + "a" * 64,
        "rekor_log_id": "b" * 64,
        "rekor_timestamp": "2026-01-01T00:00:01Z",
        "certificate": pem,
    }
    output = _format_inspect_output("SKILL.md", data)

    assert "SKILL.md: SIGNED" in output
    assert "https://github.com/test-org/repo" in output
    assert "github.com/test-org/my-skill" in output
    assert "1.0.0" in output
    assert "2026-01-01T00:00:00Z" in output
    assert "sha256:" + "a" * 64 in output
    assert "b" * 64 in output
    assert "SkillSign Test" in output
    assert "SkillSign Issuer" in output


def test_format_inspect_output_label_alignment() -> None:
    from skillsign.cli import _format_inspect_output

    pem = _make_test_pem()
    data = {
        "signer": "https://github.com/test-org/repo",
        "skill_id": "github.com/test-org/my-skill",
        "skill_version": "1.0.0",
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": "sha256:" + "a" * 64,
        "rekor_log_id": "b" * 64,
        "rekor_timestamp": "2026-01-01T00:00:01Z",
        "certificate": pem,
    }
    output = _format_inspect_output("SKILL.md", data)
    lines = output.splitlines()

    # First line is the file header
    assert lines[0] == "SKILL.md: SIGNED"
    # All subsequent lines are indented
    for line in lines[1:]:
        assert line.startswith("  ")
