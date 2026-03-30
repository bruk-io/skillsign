"""Signed input digest computation per Section 5.2 of the SkillSign spec."""

import hashlib
import re

from skillsign.errors import SkillSignError

DOMAIN_SEPARATOR = b"skillsign:v1"
NULL_SEP = b"\x00"
_SEGMENT_PATTERN = re.compile(r"^[a-zA-Z0-9._-]+$")
_MAX_SKILL_ID_LENGTH = 255
_MAX_SKILL_VERSION_LENGTH = 255


def validate_skill_id(skill_id: str) -> str:
    """Validate and trim skill_id per Section 5.2.

    Returns the trimmed skill_id or raises SkillSignError with exit_code=10.
    """
    # Trim leading/trailing ASCII whitespace (space and tab only)
    trimmed = skill_id.strip(" \t")

    # Reject null bytes
    if "\x00" in trimmed:
        raise SkillSignError("skill_id contains null bytes", exit_code=10)

    # ASCII only (U+0001–U+007F)
    for ch in trimmed:
        if ord(ch) > 0x7F or ord(ch) < 0x01:
            raise SkillSignError(
                f"skill_id contains non-ASCII character: {ch!r}", exit_code=10
            )

    # Length check
    if len(trimmed) > _MAX_SKILL_ID_LENGTH:
        raise SkillSignError(
            f"skill_id exceeds {_MAX_SKILL_ID_LENGTH} characters", exit_code=10
        )

    # Format: {host}/{owner}/{name} — exactly 3 segments
    segments = trimmed.split("/")
    if len(segments) != 3:
        raise SkillSignError(
            "skill_id must have format {host}/{owner}/{name}", exit_code=10
        )

    host, owner, name = segments

    # Each segment matches [a-zA-Z0-9._-]+
    for i, segment in enumerate(segments):
        if not _SEGMENT_PATTERN.match(segment):
            raise SkillSignError(
                f"skill_id segment {i + 1} contains invalid characters: {segment!r}",
                exit_code=10,
            )

    # No .. or . segments
    for segment in segments:
        if segment in (".", ".."):
            raise SkillSignError(
                f"skill_id segment must not be {segment!r}", exit_code=10
            )

    # Host must contain at least one dot
    if "." not in host:
        raise SkillSignError(
            "skill_id host must contain at least one '.'", exit_code=10
        )

    return trimmed


def validate_skill_version(skill_version: str) -> str:
    """Validate and trim skill_version per Section 6.4.

    Returns the trimmed skill_version or raises SkillSignError.
    """
    trimmed = skill_version.strip(" \t")

    if not trimmed:
        raise SkillSignError("skill_version must not be empty", exit_code=10)

    # Reject null bytes (mirrors validate_skill_id guard)
    if "\x00" in trimmed:
        raise SkillSignError("skill_version contains null bytes", exit_code=10)

    if len(trimmed) > _MAX_SKILL_VERSION_LENGTH:
        raise SkillSignError(
            f"skill_version exceeds {_MAX_SKILL_VERSION_LENGTH} characters",
            exit_code=10,
        )

    # Printable ASCII only (U+0020–U+007E)
    for ch in trimmed:
        code = ord(ch)
        if code < 0x20 or code > 0x7E:
            raise SkillSignError(
                f"skill_version contains invalid character: {ch!r}",
                exit_code=10,
            )

    return trimmed


def compute_digest(canonical_bytes: bytes, skill_id: str, skill_version: str) -> bytes:
    """Compute SHA-256 digest over domain-separated input per Section 5.2.

    Returns the 32-byte digest.
    Raises SkillSignError with exit_code=10 on invalid input.
    """
    # Defensive: reject null bytes in canonical input
    if b"\x00" in canonical_bytes:
        raise SkillSignError("canonical bytes contain null bytes", exit_code=10)

    # Validate and trim skill_id
    skill_id_trimmed = validate_skill_id(skill_id)

    # Validate and trim skill_version
    skill_version_trimmed = validate_skill_version(skill_version)

    # Encode fields
    skill_id_bytes = skill_id_trimmed.encode("utf-8")
    skill_version_bytes = skill_version_trimmed.encode("utf-8")

    # Assemble: domain + \x00 + canonical + \x00 + id + \x00 + version
    signed_input = (
        DOMAIN_SEPARATOR
        + NULL_SEP
        + canonical_bytes
        + NULL_SEP
        + skill_id_bytes
        + NULL_SEP
        + skill_version_bytes
    )

    return hashlib.sha256(signed_input).digest()
