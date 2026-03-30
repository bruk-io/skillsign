"""Unit tests for the SkillSign CLI."""

import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

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
    output = _format_inspect_output(
        "SKILL.md", data, "SkillSign Test", "SkillSign Issuer"
    )

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
    from skillsign.cli import _extract_cert_names

    subject_cn, issuer_cn = _extract_cert_names(pem)
    output = _format_inspect_output("SKILL.md", data, subject_cn, issuer_cn)
    lines = output.splitlines()

    # First line is the file header
    assert lines[0] == "SKILL.md: SIGNED"
    # All subsequent lines are indented
    for line in lines[1:]:
        assert line.startswith("  ")


# ---------------------------------------------------------------------------
# --format json: unsign
# ---------------------------------------------------------------------------


def test_unsign_json_removed(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        sidecar = Path(str(skill) + ".skillsign")
        skill.write_text("# SKILL\n")
        sidecar.write_text("sidecar content")

        result = runner.invoke(cli, ["--format", "json", "unsign", str(skill)])

        assert result.exit_code == 0
        data = json.loads(result.output)
        assert data["file"] == str(skill)
        assert data["removed"] is True


def test_unsign_json_no_sidecar(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        skill.write_text("# SKILL\n")

        result = runner.invoke(cli, ["--format", "json", "unsign", str(skill)])

        assert result.exit_code == 2
        data = json.loads(result.output)
        assert data["file"] == str(skill)
        assert data["removed"] is False


# ---------------------------------------------------------------------------
# --format json: verify
# ---------------------------------------------------------------------------


def test_verify_json_unsigned(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        skill.write_text("# SKILL\n")

        from skillsign.verify import VerificationResult

        mock_meta: dict = {}
        with patch(
            "skillsign.verify.verify_skill",
            return_value=(VerificationResult.UNSIGNED, mock_meta),
        ):
            result = runner.invoke(cli, ["--format", "json", "verify", str(skill)])

        assert result.exit_code == 2
        data = json.loads(result.output)
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["file"] == str(skill)
        assert data[0]["result"] == "UNSIGNED"
        assert data[0]["exit_code"] == 2


def test_verify_json_verified(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        skill.write_text("# SKILL\n")

        from skillsign.verify import VerificationResult

        mock_meta = {
            "signer": "https://github.com/test-org/repo",
            "skill_id": "github.com/test-org/my-skill",
            "skill_version": "1.0.0",
        }
        with patch(
            "skillsign.verify.verify_skill",
            return_value=(VerificationResult.VERIFIED, mock_meta),
        ):
            result = runner.invoke(cli, ["--format", "json", "verify", str(skill)])

        assert result.exit_code == 0
        data = json.loads(result.output)
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["result"] == "VERIFIED"
        assert data[0]["exit_code"] == 0
        assert data[0]["signer"] == "https://github.com/test-org/repo"
        assert data[0]["skill_id"] == "github.com/test-org/my-skill"
        assert data[0]["skill_version"] == "1.0.0"


def test_verify_json_multi_file(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill1 = Path(tmpdir) / "SKILL1.md"
        skill2 = Path(tmpdir) / "SKILL2.md"
        skill1.write_text("# SKILL\n")
        skill2.write_text("# SKILL\n")

        from skillsign.verify import VerificationResult

        mock_meta: dict = {}
        with patch(
            "skillsign.verify.verify_skill",
            return_value=(VerificationResult.UNSIGNED, mock_meta),
        ):
            result = runner.invoke(
                cli, ["--format", "json", "verify", str(skill1), str(skill2)]
            )

        assert result.exit_code == 2
        data = json.loads(result.output)
        assert isinstance(data, list)
        assert len(data) == 2
        assert all(item["result"] == "UNSIGNED" for item in data)


# ---------------------------------------------------------------------------
# --format json: inspect
# ---------------------------------------------------------------------------


def test_inspect_json_unsigned(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        skill.write_text("# SKILL\n")

        result = runner.invoke(cli, ["--format", "json", "inspect", str(skill)])

        assert result.exit_code == 2
        data = json.loads(result.output)
        assert data["file"] == str(skill)
        assert data["signed"] is False


def test_inspect_json_signed(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        sidecar = Path(str(skill) + ".skillsign")
        skill.write_text("# SKILL\n")

        pem = _make_test_pem()
        sidecar_data = {
            "signer": "https://github.com/test-org/repo",
            "skill_id": "github.com/test-org/my-skill",
            "skill_version": "1.0.0",
            "timestamp": "2026-01-01T00:00:00Z",
            "digest": "sha256:" + "a" * 64,
            "rekor_log_id": "b" * 64,
            "rekor_timestamp": "2026-01-01T00:00:01Z",
            "certificate": pem,
            "signature": "c" * 64,
            "rekor_set": "d" * 64,
        }
        with patch("skillsign.sidecar.read_sidecar", return_value=sidecar_data):
            sidecar.write_text("placeholder")
            result = runner.invoke(cli, ["--format", "json", "inspect", str(skill)])

        assert result.exit_code == 0
        data = json.loads(result.output)
        assert data["file"] == str(skill)
        assert data["signed"] is True
        assert data["signer"] == "https://github.com/test-org/repo"
        assert data["skill_id"] == "github.com/test-org/my-skill"
        assert data["skill_version"] == "1.0.0"
        assert data["cert_subject_cn"] == "SkillSign Test"
        assert data["cert_issuer_cn"] == "SkillSign Issuer"


# ---------------------------------------------------------------------------
# --format json: auth status
# ---------------------------------------------------------------------------


def test_auth_status_json_not_authenticated(runner: CliRunner) -> None:
    with patch("skillsign.auth._detect_ambient_credential", return_value=None):
        result = runner.invoke(cli, ["--format", "json", "auth", "status"])

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["authenticated"] is False
    assert data["identity"] is None
    assert data["issuer"] is None
    assert data["expired"] is False


def test_auth_status_json_authenticated(runner: CliRunner) -> None:
    mock_token = MagicMock()
    mock_token.identity = "https://github.com/test-org/test-repo"
    mock_token.federated_issuer = "https://accounts.google.com"
    mock_token.in_validity_period.return_value = True

    with (
        patch("skillsign.auth._detect_ambient_credential", return_value="raw-token"),
        patch("sigstore.oidc.IdentityToken", return_value=mock_token),
    ):
        result = runner.invoke(cli, ["--format", "json", "auth", "status"])

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["authenticated"] is True
    assert data["identity"] == "https://github.com/test-org/test-repo"
    assert data["issuer"] == "https://accounts.google.com"
    assert data["expired"] is False


def test_auth_status_json_expired(runner: CliRunner) -> None:
    mock_token = MagicMock()
    mock_token.identity = "https://github.com/test-org/test-repo"
    mock_token.federated_issuer = "https://accounts.google.com"
    mock_token.in_validity_period.return_value = False

    with (
        patch("skillsign.auth._detect_ambient_credential", return_value="raw-token"),
        patch("sigstore.oidc.IdentityToken", return_value=mock_token),
    ):
        result = runner.invoke(cli, ["--format", "json", "auth", "status"])

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["authenticated"] is False
    assert data["expired"] is True


# ---------------------------------------------------------------------------
# --format json: sign
# ---------------------------------------------------------------------------


def test_sign_json_output(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        skill.write_text("# SKILL\n")

        sidecar_data = {
            "signer": "https://github.com/test-org/repo",
            "skill_id": "github.com/test-org/my-skill",
            "skill_version": "1.0.0",
            "timestamp": "2026-01-01T00:00:00Z",
            "digest": "sha256:" + "a" * 64,
            "rekor_log_id": "b" * 64,
            "rekor_timestamp": "2026-01-01T00:00:01Z",
            "certificate": "pem",
            "signature": "sig",
            "rekor_set": "set",
        }
        with (
            patch("skillsign.signing.sign_skill", return_value=sidecar_data),
            patch("skillsign.sidecar.write_sidecar"),
        ):
            result = runner.invoke(cli, ["--format", "json", "sign", str(skill)])

        assert result.exit_code == 0
        data = json.loads(result.output)
        assert data["file"] == str(skill)
        assert data["sidecar"] == str(skill) + ".skillsign"
        assert data["signer"] == "https://github.com/test-org/repo"


# ---------------------------------------------------------------------------
# --format json: auth login
# ---------------------------------------------------------------------------


def test_auth_login_json_output(runner: CliRunner) -> None:
    mock_token = MagicMock()
    mock_token.identity = "https://github.com/test-org/test-repo"
    mock_token.federated_issuer = "https://oauth2.sigstore.dev/auth"

    with patch("skillsign.auth.get_identity_token", return_value=mock_token):
        result = runner.invoke(cli, ["--format", "json", "auth", "login"])

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["identity"] == "https://github.com/test-org/test-repo"
    assert data["issuer"] == "https://oauth2.sigstore.dev/auth"


# ---------------------------------------------------------------------------
# --format text (default): unchanged behavior
# ---------------------------------------------------------------------------


def test_format_text_is_default(runner: CliRunner) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        skill = Path(tmpdir) / "SKILL.md"
        sidecar = Path(str(skill) + ".skillsign")
        skill.write_text("# SKILL\n")
        sidecar.write_text("sidecar content")

        result = runner.invoke(cli, ["unsign", str(skill)])

        assert result.exit_code == 0
        assert "Removed:" in result.output
        # Must not be JSON
        try:
            json.loads(result.output)
            is_json = True
        except json.JSONDecodeError:
            is_json = False
        assert not is_json


# ---------------------------------------------------------------------------
# _expand_paths: glob expansion helper
# ---------------------------------------------------------------------------


def test_expand_paths_literal_file(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    f = tmp_path / "SKILL.md"
    f.write_text("# SKILL\n")
    result = _expand_paths((str(f),))
    assert result == [str(f)]


def test_expand_paths_nonexistent_literal_passes_through(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    # Non-existent literal paths are passed through — existence validation
    # happens in the verify command, not in _expand_paths
    missing = str(tmp_path / "missing.md")
    result = _expand_paths((missing,))
    assert result == [missing]


def test_expand_paths_glob_pattern(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    (tmp_path / "a.md").write_text("# A\n")
    (tmp_path / "b.md").write_text("# B\n")
    (tmp_path / "other.txt").write_text("not md\n")

    pattern = str(tmp_path / "*.md")
    result = _expand_paths((pattern,))
    assert sorted(result) == sorted([str(tmp_path / "a.md"), str(tmp_path / "b.md")])


def test_expand_paths_glob_no_match_returns_empty(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    pattern = str(tmp_path / "*.md")
    result = _expand_paths((pattern,))
    assert result == []


def test_expand_paths_glob_recursive(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    sub = tmp_path / "sub"
    sub.mkdir()
    (tmp_path / "root.md").write_text("# root\n")
    (sub / "nested.md").write_text("# nested\n")

    pattern = str(tmp_path / "**" / "*.md")
    result = _expand_paths((pattern,))
    assert str(tmp_path / "root.md") in result
    assert str(sub / "nested.md") in result


def test_expand_paths_directory_finds_md_files(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    (tmp_path / "SKILL.md").write_text("# SKILL\n")
    (tmp_path / "other.md").write_text("# other\n")
    (tmp_path / "readme.txt").write_text("not md\n")

    result = _expand_paths((str(tmp_path),))
    assert str(tmp_path / "SKILL.md") in result
    assert str(tmp_path / "other.md") in result
    assert str(tmp_path / "readme.txt") not in result


def test_expand_paths_directory_non_recursive(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    sub = tmp_path / "sub"
    sub.mkdir()
    (tmp_path / "top.md").write_text("# top\n")
    (sub / "nested.md").write_text("# nested\n")

    result = _expand_paths((str(tmp_path),))
    assert str(tmp_path / "top.md") in result
    # Subdirectory files not included in directory mode
    assert str(sub / "nested.md") not in result


def test_expand_paths_empty_directory_returns_empty(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    result = _expand_paths((str(tmp_path),))
    assert result == []


def test_expand_paths_multiple_args_combined(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    f1 = tmp_path / "explicit.md"
    f1.write_text("# explicit\n")

    subdir = tmp_path / "sub"
    subdir.mkdir()
    f2 = subdir / "SKILL.md"
    f2.write_text("# sub skill\n")

    result = _expand_paths((str(f1), str(subdir)))
    assert str(f1) in result
    assert str(f2) in result


def test_expand_paths_sorted_output_for_globs(tmp_path: Path) -> None:
    from skillsign.cli import _expand_paths

    (tmp_path / "z.md").write_text("# z\n")
    (tmp_path / "a.md").write_text("# a\n")
    (tmp_path / "m.md").write_text("# m\n")

    pattern = str(tmp_path / "*.md")
    result = _expand_paths((pattern,))
    assert result == sorted(result)
