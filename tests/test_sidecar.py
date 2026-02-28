"""Unit tests for sidecar writer and reader (Sections 6.1-6.2)."""

import base64
import os
import stat
from pathlib import Path
from unittest.mock import patch

import pytest

from skillsign.errors import SkillSignError
from skillsign.sidecar import (
    _append_literal_block,
    _append_scalar,
    _build_yaml,
    _validate_base64,
    _validate_digest,
    _validate_pem,
    _validate_rekor_log_id,
    _validate_signer,
    _validate_timestamp,
    read_sidecar,
    write_sidecar,
)

# --- Writer fixtures ---

_SAMPLE_CERT_PEM = (
    "-----BEGIN CERTIFICATE-----\n"
    "MIIBxTCCAWqgAwIBAgIRAK1234567890ABCDEFGHIJKLMN\n"
    "-----END CERTIFICATE-----\n"
)

_SAMPLE_SIDECAR: dict = {
    "version": 1,
    "skill_id": "github.com/example-org/python-linter",
    "skill_version": "1.2.0",
    "signer": "https://github.com/example-user",
    "timestamp": "2025-03-01T14:22:00Z",
    "digest": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "rekor_log_id": "24296fb24b8ad77ae1e714307e30a6f30d97c06a5de3d58e3e68e0e8c2a1e2f9",
    "rekor_timestamp": "2025-03-01T14:22:03Z",
    "rekor_set": "dGhpcyBpcyBhIGJhc2U2NCBlbmNvZGVkIFNFVA==",
    "certificate": _SAMPLE_CERT_PEM,
    "signature": "MEQCIBn9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx==",
}

_SAMPLE_SIDECAR_WITH_CHAIN: dict = {
    **_SAMPLE_SIDECAR,
    "certificate_chain": (
        "-----BEGIN CERTIFICATE-----\n"
        "MIIBxTCCAWqgAwIBAgIRAKIntermediate1234567890ABCDE\n"
        "-----END CERTIFICATE-----\n"
    ),
}


# =====================================================================
# Writer Tests
# =====================================================================


class TestAppendScalar:
    def test_plain_string_value(self) -> None:
        lines: list[str] = []
        _append_scalar(lines, "skill_id", "github.com/org/skill")
        assert lines == ["skill_id: github.com/org/skill"]

    def test_integer_value(self) -> None:
        lines: list[str] = []
        _append_scalar(lines, "version", 1)
        assert lines == ["version: 1"]

    def test_timestamp_value(self) -> None:
        lines: list[str] = []
        _append_scalar(lines, "timestamp", "2025-03-01T14:22:00Z")
        assert lines == ["timestamp: 2025-03-01T14:22:00Z"]

    def test_rejects_newline_injection(self) -> None:
        lines: list[str] = []
        with pytest.raises(SkillSignError, match="newlines"):
            _append_scalar(lines, "signer", "https://good.com\nevil_key: injected")

    def test_rejects_control_characters(self) -> None:
        lines: list[str] = []
        with pytest.raises(SkillSignError, match="control characters"):
            _append_scalar(lines, "signer", "value\x00with\x01nulls")


class TestAppendLiteralBlock:
    def test_single_line_pem(self) -> None:
        lines: list[str] = []
        pem = "-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----\n"
        _append_literal_block(lines, "certificate", pem)
        assert lines[0] == "certificate: |"
        assert lines[1] == "  -----BEGIN CERTIFICATE-----"
        assert lines[2] == "  MIIB"
        assert lines[3] == "  -----END CERTIFICATE-----"

    def test_empty_last_line_not_appended(self) -> None:
        """PEM ending with newline: splitlines() drops the trailing empty string."""
        lines: list[str] = []
        pem = "-----BEGIN CERTIFICATE-----\nDATA\n-----END CERTIFICATE-----\n"
        _append_literal_block(lines, "certificate", pem)
        assert not any(line == "  " for line in lines)

    def test_pem_lines_indented_by_two_spaces(self) -> None:
        lines: list[str] = []
        pem = "line1\nline2\n"
        _append_literal_block(lines, "myfield", pem)
        assert lines[1] == "  line1"
        assert lines[2] == "  line2"


class TestBuildYaml:
    def test_field_order_without_chain(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR)
        lines = yaml.splitlines()
        top_level_keys = [
            line.split(":")[0]
            for line in lines
            if (": " in line or line.endswith("|")) and not line.startswith("  ")
        ]
        expected_order = [
            "version",
            "skill_id",
            "skill_version",
            "signer",
            "timestamp",
            "digest",
            "rekor_log_id",
            "rekor_timestamp",
            "rekor_set",
            "certificate",
            "signature",
        ]
        assert top_level_keys == expected_order

    def test_field_order_with_chain(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR_WITH_CHAIN)
        lines = yaml.splitlines()
        top_level_keys = [
            line.split(":")[0]
            for line in lines
            if (": " in line or line.endswith("|")) and not line.startswith("  ")
        ]
        expected_order = [
            "version",
            "skill_id",
            "skill_version",
            "signer",
            "timestamp",
            "digest",
            "rekor_log_id",
            "rekor_timestamp",
            "rekor_set",
            "certificate",
            "certificate_chain",
            "signature",
        ]
        assert top_level_keys == expected_order

    def test_certificate_uses_literal_block(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR)
        assert "certificate: |" in yaml

    def test_certificate_chain_uses_literal_block(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR_WITH_CHAIN)
        assert "certificate_chain: |" in yaml

    def test_certificate_chain_absent_when_not_in_data(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR)
        assert "certificate_chain" not in yaml

    def test_signature_is_single_line(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR)
        sig_line = next(
            line for line in yaml.splitlines() if line.startswith("signature:")
        )
        assert not sig_line.endswith("|")
        assert "MEQCIBn9" in sig_line

    def test_rekor_set_is_single_line(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR)
        set_line = next(
            line for line in yaml.splitlines() if line.startswith("rekor_set:")
        )
        assert not set_line.endswith("|")
        assert "dGhpcyBpcyBhIGJhc2U2NCBlbmNvZGVkIFNFVA==" in set_line

    def test_yaml_ends_with_newline(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR)
        assert yaml.endswith("\n")

    def test_pem_content_indented(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR)
        assert "  -----BEGIN CERTIFICATE-----" in yaml
        assert "  -----END CERTIFICATE-----" in yaml

    def test_certificate_chain_empty_string_not_written(self) -> None:
        """Empty string certificate_chain should be treated as absent."""
        data = {**_SAMPLE_SIDECAR, "certificate_chain": ""}
        yaml = _build_yaml(data)
        assert "certificate_chain" not in yaml

    def test_version_as_integer(self) -> None:
        yaml = _build_yaml(_SAMPLE_SIDECAR)
        assert "version: 1" in yaml


class TestWriteSidecar:
    def test_writes_file_to_given_path(self, tmp_path: Path) -> None:
        output = tmp_path / "SKILL.md.skillsign"
        write_sidecar(_SAMPLE_SIDECAR, output)
        assert output.exists()

    def test_written_content_matches_build_yaml(self, tmp_path: Path) -> None:
        output = tmp_path / "SKILL.md.skillsign"
        write_sidecar(_SAMPLE_SIDECAR, output)
        content = output.read_text(encoding="utf-8")
        assert content == _build_yaml(_SAMPLE_SIDECAR)

    def test_written_with_certificate_chain(self, tmp_path: Path) -> None:
        output = tmp_path / "SKILL.md.skillsign"
        write_sidecar(_SAMPLE_SIDECAR_WITH_CHAIN, output)
        content = output.read_text(encoding="utf-8")
        assert "certificate_chain: |" in content

    def test_atomic_write_uses_temp_file_then_rename(self, tmp_path: Path) -> None:
        """Verify that a temp file is created, then renamed to the final path."""
        output = tmp_path / "SKILL.md.skillsign"
        created_tmp_files: list[str] = []
        original_mkstemp = __import__("tempfile").mkstemp

        def tracking_mkstemp(**kwargs):  # type: ignore[no-untyped-def]
            fd, path = original_mkstemp(**kwargs)
            created_tmp_files.append(path)
            return fd, path

        with patch("skillsign.sidecar.tempfile.mkstemp", side_effect=tracking_mkstemp):
            write_sidecar(_SAMPLE_SIDECAR, output)

        for tmp in created_tmp_files:
            assert not Path(tmp).exists(), f"Temp file {tmp} was not cleaned up"
        assert output.exists()

    def test_raises_skill_sign_error_on_write_failure(self, tmp_path: Path) -> None:
        output = tmp_path / "SKILL.md.skillsign"
        with (
            patch(
                "skillsign.sidecar.tempfile.mkstemp",
                side_effect=OSError("disk full"),
            ),
            pytest.raises(SkillSignError) as exc_info,
        ):
            write_sidecar(_SAMPLE_SIDECAR, output)
        assert exc_info.value.exit_code == 10
        assert "disk full" in str(exc_info.value)

    def test_raises_skill_sign_error_on_rename_failure(self, tmp_path: Path) -> None:
        output = tmp_path / "SKILL.md.skillsign"
        with (
            patch(
                "skillsign.sidecar.Path.rename",
                side_effect=OSError("rename failed"),
            ),
            pytest.raises(SkillSignError) as exc_info,
        ):
            write_sidecar(_SAMPLE_SIDECAR, output)
        assert exc_info.value.exit_code == 10

    def test_temp_file_cleaned_up_on_failure(self, tmp_path: Path) -> None:
        output = tmp_path / "SKILL.md.skillsign"
        with (
            patch(
                "skillsign.sidecar.Path.rename",
                side_effect=OSError("rename failed"),
            ),
            pytest.raises(SkillSignError),
        ):
            write_sidecar(_SAMPLE_SIDECAR, output)
        tmp_files = list(tmp_path.glob("*.skillsign.tmp"))
        assert tmp_files == []

    def test_overwrites_existing_file(self, tmp_path: Path) -> None:
        output = tmp_path / "SKILL.md.skillsign"
        output.write_text("old content", encoding="utf-8")
        write_sidecar(_SAMPLE_SIDECAR, output)
        content = output.read_text(encoding="utf-8")
        assert "old content" not in content
        assert "version: 1" in content

    def test_creates_parent_directory_implicitly(self, tmp_path: Path) -> None:
        output = tmp_path / "SKILL.md.skillsign"
        write_sidecar(_SAMPLE_SIDECAR, output)
        assert output.exists()

    @pytest.mark.skipif(os.getuid() == 0, reason="Root bypasses permission checks")
    def test_raises_on_unwritable_directory(self, tmp_path: Path) -> None:
        readonly_dir = tmp_path / "readonly"
        readonly_dir.mkdir()
        readonly_dir.chmod(stat.S_IRUSR | stat.S_IXUSR)
        output = readonly_dir / "SKILL.md.skillsign"
        try:
            with pytest.raises(SkillSignError) as exc_info:
                write_sidecar(_SAMPLE_SIDECAR, output)
            assert exc_info.value.exit_code == 10
        finally:
            readonly_dir.chmod(stat.S_IRWXU)


# =====================================================================
# Reader Tests
# =====================================================================

# --- Reader fixtures ---

_VALID_CERT = (
    "-----BEGIN CERTIFICATE-----\nMIIBvzCCAWWgAwIBAgIUtest\n-----END CERTIFICATE-----\n"
)
_VALID_SIG = base64.b64encode(b"fakesignature").decode()
_VALID_REKOR_SET = base64.b64encode(b"fakerekorset").decode()
_VALID_HEX64 = "a" * 64
_VALID_DIGEST = f"sha256:{'b' * 64}"
_VALID_TIMESTAMP = "2024-01-15T12:34:56Z"
_VALID_SKILL_ID = "github.com/myorg/myskill"
_VALID_SKILL_VERSION = "1.0.0"
_VALID_SIGNER = "https://github.com/myorg/myskill/.github/workflows/release.yml"


def _make_sidecar(tmp_path: Path, content: str) -> Path:
    """Write sidecar content to a temp file and return the path."""
    p = tmp_path / "skill.skillsign"
    p.write_text(content, encoding="utf-8")
    return p


def _valid_sidecar_content() -> str:
    return f"""\
version: 1
skill_id: {_VALID_SKILL_ID}
skill_version: {_VALID_SKILL_VERSION}
signer: {_VALID_SIGNER}
timestamp: {_VALID_TIMESTAMP}
digest: {_VALID_DIGEST}
rekor_log_id: {_VALID_HEX64}
rekor_timestamp: {_VALID_TIMESTAMP}
rekor_set: {_VALID_REKOR_SET}
certificate: |
  -----BEGIN CERTIFICATE-----
  MIIBvzCCAWWgAwIBAgIUtest
  -----END CERTIFICATE-----
signature: {_VALID_SIG}
"""


# --- read_sidecar: happy path ---


class TestReadSidecarHappyPath:
    def test_valid_minimal(self, tmp_path: Path) -> None:
        p = _make_sidecar(tmp_path, _valid_sidecar_content())
        result = read_sidecar(p)
        assert result["version"] == 1
        assert result["skill_id"] == _VALID_SKILL_ID
        assert result["skill_version"] == _VALID_SKILL_VERSION
        assert result["signer"] == _VALID_SIGNER
        assert result["timestamp"] == _VALID_TIMESTAMP
        assert result["digest"] == _VALID_DIGEST
        assert result["rekor_log_id"] == _VALID_HEX64
        assert result["rekor_timestamp"] == _VALID_TIMESTAMP
        assert "certificate" in result
        assert "signature" in result
        assert "certificate_chain" not in result

    def test_with_certificate_chain(self, tmp_path: Path) -> None:
        content = (
            _valid_sidecar_content()
            + "certificate_chain: |\n"
            + "  -----BEGIN CERTIFICATE-----\n"
            + "  MIIBchaintest\n"
            + "  -----END CERTIFICATE-----\n"
        )
        p = _make_sidecar(tmp_path, content)
        result = read_sidecar(p)
        assert "certificate_chain" in result
        assert "-----BEGIN CERTIFICATE-----" in result["certificate_chain"]

    def test_timestamp_with_fractional_seconds(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            _VALID_TIMESTAMP, "2024-01-15T12:34:56.123456Z"
        )
        p = _make_sidecar(tmp_path, content)
        result = read_sidecar(p)
        assert result["timestamp"] == "2024-01-15T12:34:56.123456Z"

    def test_returns_all_required_keys(self, tmp_path: Path) -> None:
        p = _make_sidecar(tmp_path, _valid_sidecar_content())
        result = read_sidecar(p)
        required_keys = {
            "version",
            "skill_id",
            "skill_version",
            "signer",
            "timestamp",
            "digest",
            "rekor_log_id",
            "rekor_timestamp",
            "rekor_set",
            "certificate",
            "signature",
        }
        assert required_keys.issubset(result.keys())

    def test_skill_id_whitespace_trimmed(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"skill_id: {_VALID_SKILL_ID}",
            f"skill_id: '  {_VALID_SKILL_ID}  '",
        )
        p = _make_sidecar(tmp_path, content)
        result = read_sidecar(p)
        assert result["skill_id"] == _VALID_SKILL_ID


# --- read_sidecar: file I/O errors ---


class TestReadSidecarFileIO:
    def test_file_not_found(self, tmp_path: Path) -> None:
        with pytest.raises(SkillSignError, match="not found") as exc_info:
            read_sidecar(tmp_path / "nonexistent.skillsign")
        assert exc_info.value.exit_code == 10

    def test_exceeds_64kb(self, tmp_path: Path) -> None:
        p = tmp_path / "big.skillsign"
        p.write_bytes(b"x" * 65_537)
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR") as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_exactly_64kb_passes(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content()
        raw = content.encode("utf-8")
        padding_bytes_needed = 65_536 - len(raw)
        if padding_bytes_needed >= 3:
            comment_chars = padding_bytes_needed - 3
            content = f"# {'x' * comment_chars}\n" + content
        p = _make_sidecar(tmp_path, content)
        assert len(p.read_bytes()) == 65_536
        result = read_sidecar(p)
        assert result["version"] == 1

    def test_invalid_utf8(self, tmp_path: Path) -> None:
        p = tmp_path / "bad.skillsign"
        p.write_bytes(b"\xff\xfe invalid utf-8")
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*UTF-8"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1


# --- read_sidecar: YAML structural restrictions ---


class TestReadSidecarYAMLRestrictions:
    def test_rejects_yaml_anchor(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"signer: {_VALID_SIGNER}",
            f"signer: &anchor {_VALID_SIGNER}",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR") as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_missing_required_field(self, tmp_path: Path) -> None:
        lines = _valid_sidecar_content().splitlines()
        content = "\n".join(line for line in lines if not line.startswith("signature:"))
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR") as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_unknown_version(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace("version: 1", "version: 2")
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*version"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1


# --- read_sidecar: field validation ---


class TestReadSidecarFieldValidation:
    def test_rejects_invalid_skill_id(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"skill_id: {_VALID_SKILL_ID}",
            "skill_id: notavalidid",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*skill_id"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_invalid_skill_version(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"skill_version: {_VALID_SKILL_VERSION}",
            "skill_version: ''",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR") as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_bad_signer(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"signer: {_VALID_SIGNER}",
            "signer: http://github.com/org/repo",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*github.com"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_bad_timestamp(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"timestamp: {_VALID_TIMESTAMP}",
            "timestamp: 2024-01-15T12:34:56",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*timestamp"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_bad_digest(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"digest: {_VALID_DIGEST}",
            "digest: md5:deadbeef",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*digest"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_bad_rekor_log_id(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"rekor_log_id: {_VALID_HEX64}",
            "rekor_log_id: AAAA",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*rekor_log_id"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_bad_rekor_set(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"rekor_set: {_VALID_REKOR_SET}",
            "rekor_set: '!!!invalid base64!!!'",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*rekor_set"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_bad_signature(self, tmp_path: Path) -> None:
        content = _valid_sidecar_content().replace(
            f"signature: {_VALID_SIG}",
            "signature: '!!!bad base64!!!'",
        )
        p = _make_sidecar(tmp_path, content)
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*signature"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_rejects_bad_certificate(self, tmp_path: Path) -> None:
        lines = _valid_sidecar_content().splitlines(keepends=True)
        new_lines = []
        skip = False
        for line in lines:
            if line.startswith("certificate:"):
                skip = True
                new_lines.append("certificate: notapem\n")
                continue
            if skip and (line.startswith(" ") or line.startswith("\t")):
                continue
            skip = False
            new_lines.append(line)
        p = _make_sidecar(tmp_path, "".join(new_lines))
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*certificate"
        ) as exc_info:
            read_sidecar(p)
        assert exc_info.value.exit_code == 1

    def test_optional_cert_chain_absent_is_ok(self, tmp_path: Path) -> None:
        p = _make_sidecar(tmp_path, _valid_sidecar_content())
        result = read_sidecar(p)
        assert "certificate_chain" not in result


# --- Validator unit tests ---


class TestValidateSigner:
    def test_valid(self) -> None:
        _validate_signer("https://github.com/org/repo/.github/workflows/ci.yml")

    def test_valid_minimal_path(self) -> None:
        _validate_signer("https://github.com/org/repo")

    def test_rejects_http(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*github.com"):
            _validate_signer("http://github.com/org/repo")

    def test_rejects_non_github(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*github.com"):
            _validate_signer("https://gitlab.com/org/repo")

    def test_rejects_query_params(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*query"):
            _validate_signer("https://github.com/org/repo?ref=main")

    def test_rejects_fragment(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*fragment"):
            _validate_signer("https://github.com/org/repo#section")

    def test_rejects_userinfo(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*userinfo"):
            _validate_signer("https://user@github.com/org/repo")

    def test_rejects_port(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*port"):
            _validate_signer("https://github.com:443/org/repo")

    def test_rejects_too_long(self) -> None:
        long_path = "a" * 2030
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*2048"):
            _validate_signer(f"https://github.com/{long_path}")

    def test_rejects_ftp_scheme(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*github.com"):
            _validate_signer("ftp://github.com/org/repo")


class TestValidateTimestamp:
    def test_valid_basic(self) -> None:
        _validate_timestamp("2024-01-15T12:34:56Z")

    def test_valid_fractional(self) -> None:
        _validate_timestamp("2024-01-15T12:34:56.123Z")
        _validate_timestamp("2024-01-15T12:34:56.123456Z")

    def test_rejects_no_z(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*timestamp"):
            _validate_timestamp("2024-01-15T12:34:56")

    def test_rejects_offset(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*timestamp"):
            _validate_timestamp("2024-01-15T12:34:56+00:00")

    def test_rejects_date_only(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*timestamp"):
            _validate_timestamp("2024-01-15")

    def test_rejects_empty(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*timestamp"):
            _validate_timestamp("")

    def test_rejects_impossible_month(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*timestamp"):
            _validate_timestamp("2024-13-15T12:34:56Z")

    def test_rejects_impossible_day(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*timestamp"):
            _validate_timestamp("2024-02-30T12:34:56Z")

    def test_rejects_impossible_hour(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*timestamp"):
            _validate_timestamp("2024-01-15T25:00:00Z")


class TestValidateDigest:
    def test_valid(self) -> None:
        _validate_digest(f"sha256:{'a' * 64}")

    def test_rejects_missing_prefix(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*digest"):
            _validate_digest("a" * 64)

    def test_rejects_uppercase_hex(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*digest"):
            _validate_digest(f"sha256:{'A' * 64}")

    def test_rejects_short_hex(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*digest"):
            _validate_digest(f"sha256:{'a' * 63}")

    def test_rejects_long_hex(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*digest"):
            _validate_digest(f"sha256:{'a' * 65}")

    def test_rejects_wrong_algo(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*digest"):
            _validate_digest(f"sha512:{'a' * 64}")


class TestValidateRekorLogId:
    def test_valid(self) -> None:
        _validate_rekor_log_id("a" * 64)

    def test_valid_mixed_hex(self) -> None:
        _validate_rekor_log_id("0123456789abcdef" * 4)

    def test_rejects_uppercase(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*rekor_log_id"):
            _validate_rekor_log_id("A" * 64)

    def test_rejects_too_short(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*rekor_log_id"):
            _validate_rekor_log_id("a" * 63)

    def test_rejects_too_long(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*rekor_log_id"):
            _validate_rekor_log_id("a" * 65)

    def test_rejects_non_hex(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*rekor_log_id"):
            _validate_rekor_log_id("g" * 64)


class TestValidateBase64:
    def test_valid(self) -> None:
        _validate_base64(base64.b64encode(b"hello").decode(), "test_field")

    def test_valid_padded(self) -> None:
        _validate_base64(base64.b64encode(b"hi").decode(), "test_field")

    def test_rejects_empty_string(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*test_field"):
            _validate_base64("", "test_field")

    def test_rejects_invalid_chars(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*test_field"):
            _validate_base64("not valid base64!!!", "test_field")

    def test_field_name_in_error(self) -> None:
        with pytest.raises(SkillSignError, match="my_field"):
            _validate_base64("", "my_field")


class TestValidatePem:
    def test_valid(self) -> None:
        pem = "-----BEGIN CERTIFICATE-----\nMIIBtest\n-----END CERTIFICATE-----\n"
        _validate_pem(pem, "certificate")

    def test_rejects_missing_header(self) -> None:
        pem = "MIIBtest\n-----END CERTIFICATE-----\n"
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*certificate.*header"
        ):
            _validate_pem(pem, "certificate")

    def test_rejects_missing_footer(self) -> None:
        pem = "-----BEGIN CERTIFICATE-----\nMIIBtest\n"
        with pytest.raises(
            SkillSignError, match="MALFORMED_SIDECAR.*certificate.*footer"
        ):
            _validate_pem(pem, "certificate")

    def test_rejects_empty(self) -> None:
        with pytest.raises(SkillSignError, match="MALFORMED_SIDECAR.*certificate"):
            _validate_pem("", "certificate")

    def test_field_name_in_error(self) -> None:
        with pytest.raises(SkillSignError, match="certificate_chain"):
            _validate_pem("", "certificate_chain")
