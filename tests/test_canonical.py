"""Unit tests for canonical form processor (Section 5.1)."""

import pytest

from skillsign.canonical import canonicalize
from skillsign.errors import SkillSignError

# --- Happy path ---


def test_normal_markdown_passes_through() -> None:
    raw = b"# Title\n\nSome content.\n"
    assert canonicalize(raw) == b"# Title\n\nSome content.\n"


def test_bom_is_stripped() -> None:
    raw = b"\xef\xbb\xbf# Title\n"
    assert canonicalize(raw) == b"# Title\n"


def test_crlf_normalized_to_lf() -> None:
    raw = b"line1\r\nline2\r\n"
    assert canonicalize(raw) == b"line1\nline2\n"


def test_bare_cr_normalized_to_lf() -> None:
    raw = b"line1\rline2\r"
    assert canonicalize(raw) == b"line1\nline2\n"


def test_mixed_line_endings_normalized() -> None:
    raw = b"a\r\nb\rc\n"
    assert canonicalize(raw) == b"a\nb\nc\n"


def test_trailing_spaces_stripped() -> None:
    raw = b"hello   \nworld  \n"
    assert canonicalize(raw) == b"hello\nworld\n"


def test_trailing_tabs_stripped() -> None:
    raw = b"hello\t\t\nworld\t\n"
    assert canonicalize(raw) == b"hello\nworld\n"


def test_trailing_mixed_whitespace_stripped() -> None:
    raw = b"hello \t \t\n"
    assert canonicalize(raw) == b"hello\n"


def test_trailing_newlines_collapsed() -> None:
    raw = b"hello\n\n\n\n"
    assert canonicalize(raw) == b"hello\n"


def test_no_trailing_newline_gets_one() -> None:
    raw = b"hello"
    assert canonicalize(raw) == b"hello\n"


def test_empty_file_becomes_single_newline() -> None:
    assert canonicalize(b"") == b"\n"


def test_whitespace_only_file_becomes_single_newline() -> None:
    assert canonicalize(b"   \t  \n\n  \n") == b"\n"


def test_unicode_whitespace_preserved() -> None:
    # \u00a0 is non-breaking space — should NOT be stripped
    content = "hello\u00a0\n"
    raw = content.encode("utf-8")
    assert canonicalize(raw) == raw


def test_unicode_em_space_preserved() -> None:
    # \u2003 is em space — should NOT be stripped
    content = "hello\u2003\n"
    raw = content.encode("utf-8")
    assert canonicalize(raw) == raw


def test_internal_whitespace_preserved() -> None:
    raw = b"hello   world\n"
    assert canonicalize(raw) == b"hello   world\n"


def test_bom_plus_crlf_plus_trailing_whitespace() -> None:
    raw = b"\xef\xbb\xbfline1 \r\nline2\t\r\n\n"
    assert canonicalize(raw) == b"line1\nline2\n"


# --- Error paths ---


def test_file_exceeding_1mb_rejected() -> None:
    raw = b"x" * (1_048_576 + 1)
    with pytest.raises(SkillSignError, match="1MB") as exc_info:
        canonicalize(raw)
    assert exc_info.value.exit_code == 10


def test_file_exactly_1mb_passes() -> None:
    raw = b"x" * 1_048_576
    result = canonicalize(raw)
    assert result.endswith(b"\n")


def test_invalid_utf8_rejected() -> None:
    raw = b"\xff\xfe"
    with pytest.raises(SkillSignError, match="UTF-8") as exc_info:
        canonicalize(raw)
    assert exc_info.value.exit_code == 10


def test_truncated_utf8_rejected() -> None:
    raw = b"hello \xc3"  # incomplete 2-byte sequence
    with pytest.raises(SkillSignError, match="UTF-8") as exc_info:
        canonicalize(raw)
    assert exc_info.value.exit_code == 10


def test_null_byte_in_content_rejected() -> None:
    raw = b"hello\x00world\n"
    with pytest.raises(SkillSignError, match="null") as exc_info:
        canonicalize(raw)
    assert exc_info.value.exit_code == 10


def test_null_byte_after_normalization_rejected() -> None:
    # Null byte survives all normalization steps
    raw = b"line1\x00\n"
    with pytest.raises(SkillSignError, match="null") as exc_info:
        canonicalize(raw)
    assert exc_info.value.exit_code == 10
