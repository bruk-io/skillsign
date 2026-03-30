"""Sidecar reader and writer per Sections 6.1-6.2 of the SkillSign spec.

Writer: Assembles sidecar dict into YAML and writes atomically.
Reader: Parses .skillsign files with strict YAML restrictions and field validation.
"""

import base64
import contextlib
import datetime
import os
import re
import tempfile
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from strictyaml import Int, Map, Str, YAMLError, load
from strictyaml import Optional as StrictOptional

from skillsign.digest import validate_skill_id, validate_skill_version
from skillsign.errors import SkillSignError

# --- Constants ---

_MAX_SIDECAR_SIZE = 65_536  # 64KB
_MAX_SIGNER_URL_LENGTH = 2048
_HEX64_PATTERN = re.compile(r"^[0-9a-f]{64}$")
_DIGEST_PATTERN = re.compile(r"^sha256:[0-9a-f]{64}$")
_TIMESTAMP_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$")

_SIDECAR_SCHEMA = Map(
    {
        "version": Int(),
        "skill_id": Str(),
        "skill_version": Str(),
        "signer": Str(),
        "timestamp": Str(),
        "digest": Str(),
        "rekor_log_id": Str(),
        "rekor_timestamp": Str(),
        "rekor_set": Str(),
        "certificate": Str(),
        StrictOptional("certificate_chain"): Str(),
        "signature": Str(),
    }
)


# --- Writer ---


def write_sidecar(sidecar_data: dict[str, Any], output_path: Path) -> None:
    """Write sidecar data to a .skillsign YAML file atomically.

    Writes fields in the canonical order defined by Section 6.1:
    version, skill_id, skill_version, signer, timestamp, digest,
    rekor_log_id, rekor_timestamp, rekor_set, certificate,
    certificate_chain (if present), signature.

    PEM fields (certificate, certificate_chain) use YAML literal block
    scalar style. All other fields are plain scalars on a single line.

    Raises SkillSignError with exit_code=10 on any write failure.
    """
    yaml_content = _build_yaml(sidecar_data)

    tmp_path: Path | None = None
    try:
        dir_path = output_path.parent
        fd, tmp_str = tempfile.mkstemp(dir=dir_path, suffix=".skillsign.tmp")
        tmp_path = Path(tmp_str)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                f.write(yaml_content)
        except BaseException:
            # fdopen takes ownership of fd; if it fails, fd may still be open
            with contextlib.suppress(OSError):
                os.close(fd)
            raise
        tmp_path.rename(output_path)
        tmp_path = None
    except SkillSignError:
        raise
    except OSError as e:
        raise SkillSignError(f"Failed to write sidecar: {e}", exit_code=10) from e
    finally:
        if tmp_path is not None:
            with contextlib.suppress(OSError):
                tmp_path.unlink()


def _build_yaml(data: dict[str, Any]) -> str:
    """Construct the YAML string for the sidecar in canonical field order."""
    lines: list[str] = []

    # Fields in canonical order per Section 6.1
    _append_scalar(lines, "version", data["version"])
    _append_scalar(lines, "skill_id", data["skill_id"])
    _append_scalar(lines, "skill_version", data["skill_version"])
    _append_scalar(lines, "signer", data["signer"])
    _append_scalar(lines, "timestamp", data["timestamp"])
    _append_scalar(lines, "digest", data["digest"])
    _append_scalar(lines, "rekor_log_id", data["rekor_log_id"])
    _append_scalar(lines, "rekor_timestamp", data["rekor_timestamp"])
    _append_scalar(lines, "rekor_set", data["rekor_set"])
    _append_literal_block(lines, "certificate", data["certificate"])

    if "certificate_chain" in data and data["certificate_chain"]:
        _append_literal_block(lines, "certificate_chain", data["certificate_chain"])

    _append_scalar(lines, "signature", data["signature"])

    return "\n".join(lines) + "\n"


def _append_scalar(lines: list[str], key: str, value: Any) -> None:
    """Append a plain scalar YAML field (single-line value).

    Rejects values containing newlines or control characters to prevent
    YAML injection via crafted sidecar data.
    """
    str_value = str(value)
    if "\n" in str_value or "\r" in str_value:
        raise SkillSignError(
            f"Sidecar field {key!r} contains newlines — cannot write as scalar",
            exit_code=10,
        )
    if any(ord(c) < 0x20 and c != "\t" for c in str_value):
        raise SkillSignError(
            f"Sidecar field {key!r} contains control characters",
            exit_code=10,
        )
    lines.append(f"{key}: {str_value}")


def _append_literal_block(lines: list[str], key: str, pem: str) -> None:
    """Append a YAML literal block scalar field for PEM content.

    Uses the '|' block style so embedded newlines are preserved
    without escaping. Each PEM line is indented by two spaces.
    """
    lines.append(f"{key}: |")
    for pem_line in pem.splitlines():
        lines.append(f"  {pem_line}")


# --- Reader ---


def _malformed(message: str) -> SkillSignError:
    """Create a SkillSignError indicating MALFORMED_SIDECAR with exit_code=1."""
    return SkillSignError(f"MALFORMED_SIDECAR: {message}", exit_code=1)


def _validate_signer(signer: str) -> None:
    """Validate the signer field per Section 6.2.

    The signer is the exact SAN value from the Fulcio certificate:
    - For URI SANs (GitHub Actions OIDC): must be a https://github.com/... URL
      with no query params, fragments, userinfo, or port.
    - For email SANs (personal OAuth via Dex): must be a valid email address.

    Must not exceed 2048 characters.
    """
    if len(signer) > _MAX_SIGNER_URL_LENGTH:
        raise _malformed(f"signer exceeds {_MAX_SIGNER_URL_LENGTH} characters")

    # Email SAN: contains @ and no URL scheme
    if "@" in signer and "://" not in signer:
        _validate_signer_email(signer)
        return

    # URI SAN: URL validation
    _validate_signer_url(signer)


def _validate_signer_email(email: str) -> None:
    """Validate an email SAN signer value."""
    if not email or email.count("@") != 1:
        raise _malformed(f"signer email is invalid: {email!r}")
    local, domain = email.split("@")
    if not local or not domain or "." not in domain:
        raise _malformed(f"signer email is invalid: {email!r}")


def _validate_signer_url(signer: str) -> None:
    """Validate a URI SAN signer value (https://github.com/... URL)."""
    try:
        parsed = urlparse(signer)
    except ValueError as e:
        raise _malformed(f"signer URL is invalid: {e}") from e

    if parsed.scheme != "https":
        raise _malformed("signer must be a https://github.com/... URL")

    if parsed.username or parsed.password:
        raise _malformed("signer URL must not contain userinfo")

    if parsed.port is not None:
        raise _malformed("signer URL must not contain a port")

    if parsed.hostname != "github.com":
        raise _malformed("signer must be a https://github.com/... URL")

    if parsed.query:
        raise _malformed("signer URL must not contain query parameters")

    if parsed.fragment:
        raise _malformed("signer URL must not contain a fragment")


def _validate_timestamp(ts: str) -> None:
    """Validate ISO 8601 UTC timestamp with mandatory Z suffix.

    Accepts YYYY-MM-DDTHH:MM:SSZ or YYYY-MM-DDTHH:MM:SS.fractionalZ.
    Rejects syntactically valid patterns with impossible date/time values.
    """
    if not _TIMESTAMP_PATTERN.match(ts):
        raise _malformed(f"timestamp must be ISO 8601 UTC with Z suffix (got {ts!r})")
    try:
        datetime.datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except ValueError as e:
        raise _malformed(f"timestamp has invalid date/time values (got {ts!r})") from e


def _validate_digest(digest: str) -> None:
    """Validate sha256: followed by exactly 64 lowercase hex characters."""
    if not _DIGEST_PATTERN.match(digest):
        raise _malformed(
            "digest must be 'sha256:' followed by 64 lowercase hex characters"
        )


def _validate_rekor_log_id(log_id: str) -> None:
    """Validate rekor_log_id: exactly 64 lowercase hex characters."""
    if not _HEX64_PATTERN.match(log_id):
        raise _malformed("rekor_log_id must be exactly 64 lowercase hex characters")


def _validate_base64(value: str, field_name: str) -> None:
    """Validate that value is a non-empty RFC 4648 §4 Base64 string."""
    if not value:
        raise _malformed(f"{field_name} must not be empty")

    if "\n" in value or "\r" in value:
        raise _malformed(f"{field_name} must not contain line breaks")

    try:
        decoded = base64.b64decode(value, validate=True)
    except Exception as e:
        raise _malformed(f"{field_name} is not valid Base64: {e}") from e

    if len(decoded) == 0:
        raise _malformed(f"{field_name} Base64 decodes to empty bytes")


def _validate_pem(value: str, field_name: str) -> None:
    """Validate that value contains PEM header/footer markers."""
    if not value:
        raise _malformed(f"{field_name} must not be empty")

    if "-----BEGIN CERTIFICATE-----" not in value:
        raise _malformed(f"{field_name} must contain PEM CERTIFICATE header")

    if "-----END CERTIFICATE-----" not in value:
        raise _malformed(f"{field_name} must contain PEM CERTIFICATE footer")


def read_sidecar(sidecar_path: Path) -> dict[str, Any]:
    """Read and validate a .skillsign sidecar file per Section 6.2.

    Parse with YAML 1.2 semantics and Section 6.1 restrictions:
    no duplicate keys, no anchors/aliases, no tags, no multi-document streams,
    max 64KB file size. Validate all required fields.

    Returns a dict with all parsed and validated sidecar fields.
    Raises SkillSignError with exit_code=1 on any MALFORMED_SIDECAR condition.
    Raises SkillSignError with exit_code=10 on file I/O errors.
    """
    # Read raw bytes for size check
    try:
        raw = sidecar_path.read_bytes()
    except FileNotFoundError as e:
        raise SkillSignError(f"Sidecar not found: {sidecar_path}", exit_code=10) from e
    except OSError as e:
        raise SkillSignError(f"Cannot read sidecar: {e}", exit_code=10) from e

    # Size check (Section 6.1)
    if len(raw) > _MAX_SIDECAR_SIZE:
        raise _malformed(f"sidecar exceeds 64KB size limit ({len(raw)} bytes)")

    # Decode as UTF-8
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as e:
        raise _malformed(f"sidecar contains invalid UTF-8: {e}") from e

    # Parse with strictyaml (enforces YAML 1.2, rejects duplicates,
    # anchors, aliases, tags, and multi-document streams)
    try:
        parsed = load(text, _SIDECAR_SCHEMA)
    except YAMLError as e:
        raise _malformed(f"invalid sidecar YAML: {e}") from e

    data = parsed.data

    # version: must be integer 1
    version = data["version"]
    if version != 1:
        raise _malformed(f"unknown sidecar version: {version}")

    # skill_id: reuse validate_skill_id from digest.py
    # validate_skill_id raises SkillSignError(exit_code=10); re-raise as
    # MALFORMED_SIDECAR since this is a sidecar field validation failure
    try:
        skill_id = validate_skill_id(data["skill_id"])
    except SkillSignError as e:
        raise _malformed(f"invalid skill_id: {e}") from e

    # skill_version: reuse validate_skill_version from digest.py
    try:
        skill_version = validate_skill_version(data["skill_version"])
    except SkillSignError as e:
        raise _malformed(f"invalid skill_version: {e}") from e

    # signer
    _validate_signer(data["signer"])

    # timestamp
    _validate_timestamp(data["timestamp"])

    # digest: sha256: + 64 lowercase hex chars
    _validate_digest(data["digest"])

    # rekor_log_id: 64 lowercase hex chars
    _validate_rekor_log_id(data["rekor_log_id"])

    # rekor_timestamp: same ISO 8601 format as timestamp
    _validate_timestamp(data["rekor_timestamp"])

    # rekor_set: non-empty Base64
    _validate_base64(data["rekor_set"], "rekor_set")

    # certificate: must contain PEM header/footer
    _validate_pem(data["certificate"], "certificate")

    # certificate_chain: optional; if present, must contain PEM content
    cert_chain: str | None = data.get("certificate_chain")
    if cert_chain is not None:
        _validate_pem(cert_chain, "certificate_chain")

    # signature: non-empty Base64
    _validate_base64(data["signature"], "signature")

    result: dict[str, Any] = {
        "version": version,
        "skill_id": skill_id,
        "skill_version": skill_version,
        "signer": data["signer"],
        "timestamp": data["timestamp"],
        "digest": data["digest"],
        "rekor_log_id": data["rekor_log_id"],
        "rekor_timestamp": data["rekor_timestamp"],
        "rekor_set": data["rekor_set"],
        "certificate": data["certificate"],
        "signature": data["signature"],
    }
    if cert_chain is not None:
        result["certificate_chain"] = cert_chain

    return result
