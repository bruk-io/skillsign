"""Canonical form processor per Section 5.1 of the SkillSign spec."""

from skillsign.errors import SkillSignError

MAX_FILE_SIZE = 1_048_576  # 1MB


def canonicalize(raw: bytes) -> bytes:
    """Normalize a SKILL.md file to its canonical form.

    Apply the 8-step normalization algorithm from Section 5.1.
    Takes raw file bytes, returns canonical UTF-8 bytes.
    Raises SkillSignError with exit_code=10 on invalid input.
    """
    # Step 1: Size check
    if len(raw) > MAX_FILE_SIZE:
        raise SkillSignError("File exceeds 1MB size limit", exit_code=10)

    # Step 2: UTF-8 decode
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as e:
        raise SkillSignError("File contains invalid UTF-8", exit_code=10) from e

    # Step 3: Strip BOM
    if text.startswith("\ufeff"):
        text = text[1:]

    # Step 4: Normalize line endings (CRLF first, then bare CR)
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Step 5: Strip trailing ASCII whitespace from each line
    lines = text.split("\n")
    lines = [line.rstrip(" \t") for line in lines]
    text = "\n".join(lines)

    # Step 6: Strip trailing newlines, append exactly one
    text = text.rstrip("\n") + "\n"

    # Step 7: Encode as UTF-8
    result = text.encode("utf-8")

    # Step 8: Reject null bytes
    if b"\x00" in result:
        raise SkillSignError("Canonical form contains null bytes", exit_code=10)

    return result
