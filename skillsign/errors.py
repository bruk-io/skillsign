"""SkillSign error types."""


class SkillSignError(Exception):
    """Base error with an associated CLI exit code."""

    def __init__(self, message: str, exit_code: int = 1) -> None:
        super().__init__(message)
        self.exit_code = exit_code
