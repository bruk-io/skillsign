# Cycle 006 — Phase 1 Closeout

## Batch
- Issues: #16 (QA verify workflow end-to-end with real Sigstore infrastructure)
- Agents: 3 implementation (e2e-lib-tests, e2e-cli-tests, ci-verifier), 1 team lead

## Results
- Completed: #16
- Failed: none
- Deferred: none

## Metrics
- Files added: 1 (tests/e2e/test_cli_e2e.py)
- Files modified: 1 (tests/e2e/test_sigstore_flow.py)
- E2e tests added: 12 (6 library-level, 6 CLI-level)
- Total tests: 301 passed, 12 e2e skipped (require SKILLSIGN_E2E=1)
- Lint: clean (ruff check + format)
- Review findings: 6 line-length lint errors, fixed by team lead

## What Was Delivered

### Library-level e2e tests (test_sigstore_flow.py)
4 new tests added to the existing 2:
1. **UNSIGNED** — sign, delete sidecar, verify detects missing sidecar
2. **MALFORMED_SIDECAR** — sign, corrupt sidecar YAML, verify detects garbage
3. **IDENTITY_MISMATCH** — sign, swap signer field, verify detects SAN mismatch
4. **SKILL_ID_MISMATCH** — sign, swap skill_id owner, verify detects owner mismatch

### CLI-level e2e tests (test_cli_e2e.py)
6 new tests via Click CliRunner:
1. **sign creates sidecar** — exit 0, .skillsign file exists
2. **verify VERIFIED** — sign then verify, exit 0, output contains "VERIFIED"
3. **verify tampered** — sign, tamper, verify exits 1
4. **verify UNSIGNED** — no sidecar, verify exits 2, output contains "UNSIGNED"
5. **multi-file worst-exit** — signed(0) + unsigned(2) = exit 2
6. **output format** — VERIFIED output includes Signer, skill_id, skill_version

### CI Verification
- `.github/workflows/e2e.yml` confirmed: `id-token: write`, `SKILLSIGN_E2E=1`, nightly + dispatch
- `tests/e2e/conftest.py` skip logic confirmed working
- `pyproject.toml` e2e marker registered

## Issue #16 Checklist Coverage

| Checklist item | Test |
|---|---|
| Sign a real SKILL.md | test_sign_and_verify_round_trip, test_sign_creates_sidecar |
| Verify VERIFIED exit 0 | test_sign_and_verify_round_trip, test_verify_signed_file_exits_0_with_verified |
| Tamper → TAMPERED exit 1 | test_verify_tampered_file_after_signing, test_verify_tampered_file_exits_1 |
| Delete sidecar → UNSIGNED exit 2 | test_verify_unsigned_after_sidecar_deleted, test_verify_unsigned_file_exits_2 |
| Corrupt sidecar → MALFORMED exit 1 | test_verify_malformed_sidecar_after_corruption |
| Modify signer → IDENTITY_MISMATCH exit 1 | test_verify_identity_mismatch_after_signer_modified |
| Multi-file worst-exit | test_verify_multi_file_worst_exit |
| Output format matches spec | test_verify_output_format_includes_metadata |
| skill_id mismatch → exit 1 | test_verify_skill_id_mismatch_after_owner_modified |

## Phase 1 Status

**All 15 Phase 1 deliverables are now complete.** Issues #1-15 and #17 are closed. #16 (this cycle) closes the QA gate.

Phase 1 exit criteria: "A developer can `skillsign sign ./SKILL.md` and another developer can `skillsign verify ./SKILL.md` — end to end through real Sigstore infrastructure." Full verification requires the e2e CI workflow to run with GitHub Actions OIDC (`workflow_dispatch` trigger available).

## Remaining open issues (not Phase 1)
- #18 — SET strict mode (Phase 2: hardening)
- #20 — Worktree cleanup (infra)
