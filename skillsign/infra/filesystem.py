"""Filesystem operations — read, write, and existence checks."""

import contextlib
import os
import tempfile
from pathlib import Path

from skillsign.errors import SkillSignError


def read_file(path: Path) -> bytes:
    """Read raw bytes from a file.

    Raise SkillSignError with exit_code=10 on any I/O error.
    """
    try:
        return path.read_bytes()
    except FileNotFoundError as e:
        raise SkillSignError(f"File not found: {path}", exit_code=10) from e
    except OSError as e:
        raise SkillSignError(f"Cannot read file: {e}", exit_code=10) from e


def file_exists(path: Path) -> bool:
    """Return True if the file exists."""
    return path.exists()


def write_file_atomic(path: Path, content: str) -> None:
    """Write content to a file atomically via tempfile + rename.

    Raise SkillSignError with exit_code=10 on any write failure.
    """
    tmp_path: Path | None = None
    try:
        dir_path = path.parent
        fd, tmp_str = tempfile.mkstemp(dir=dir_path, suffix=".tmp")
        tmp_path = Path(tmp_str)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                f.write(content)
        except BaseException:
            with contextlib.suppress(OSError):
                os.close(fd)
            raise
        tmp_path.rename(path)
        tmp_path = None
    except SkillSignError:
        raise
    except OSError as e:
        raise SkillSignError(f"Failed to write file: {e}", exit_code=10) from e
    finally:
        if tmp_path is not None:
            with contextlib.suppress(OSError):
                tmp_path.unlink()
