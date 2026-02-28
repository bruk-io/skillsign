"""Exit code constants for the SkillSign CLI (spec Section 9.3).

These codes form the machine-readable interface for CI pipelines and scripts.
All CLI commands must exit with one of these values.
"""

# 0 — Success: all verified files passed cryptographic and policy checks.
EXIT_VERIFIED: int = 0

# 1 — Hard verification failure: TAMPERED, INVALID_CERT, IDENTITY_MISMATCH,
#     SKILL_ID_MISMATCH, or MALFORMED_SIDECAR on any file.
EXIT_FAILURE: int = 1

# 2 — UNSIGNED: no sidecar file found (single-file verify, no active policy).
EXIT_UNSIGNED: int = 2

# 3 — POLICY_FAIL: signature is cryptographically valid but trust policy is
#     not satisfied (reserved for Phase 3).
EXIT_POLICY_FAIL: int = 3

# 10 — CLI/precondition error: bad arguments, file not found, sidecar already
#      exists without --force, incompatible flag combinations, auth failure, etc.
EXIT_CLI_ERROR: int = 10
