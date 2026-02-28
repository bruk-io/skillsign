"""SkillSign error types."""

from skillsign.exit_codes import EXIT_FAILURE


class SkillSignError(Exception):
    """Base error with an associated CLI exit code.

    Defaults to EXIT_FAILURE (1) — the code for hard verification failures
    (TAMPERED, INVALID_CERT, IDENTITY_MISMATCH, SKILL_ID_MISMATCH,
    MALFORMED_SIDECAR).  Subclasses or callers that produce different outcomes
    (UNSIGNED, POLICY_FAIL, CLI errors) must pass the appropriate exit code
    from ``skillsign.exit_codes``.
    """

    def __init__(self, message: str, exit_code: int = EXIT_FAILURE) -> None:
        super().__init__(message)
        self.exit_code = exit_code
