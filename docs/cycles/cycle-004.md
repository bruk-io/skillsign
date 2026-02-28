# Cycle 004

## Batch
- Issues: #10 (exit code mappings), #14 (TUF client stub), #17 (cert chain validation), #16 (QA verify workflow)
- Agents: 1 implementation, 4 reviewers (code, crypto, c4, consistency)

## Results
- Completed: #10 (exit code mappings), #14 (TUF client stub), #17 (cert chain validation)
- Failed: none (8 review fix tasks completed in-cycle)
- Deferred: #16 (QA verify workflow — user will test manually)

## Metrics
- Files added: 1 (exit_codes.py)
- Files modified: 9 (verify.py, cli.py, errors.py, signing.py, test_verify.py, test_cli.py, 3 .likec4 files)
- Lines added: ~1025
- Tests added: 27 (246 total, up from 219)
- Review findings: 8 blocking (1 critical, 2 high, 5 medium)
- Review fixes: 8 tasks, all completed

## Review Findings Summary
1. **B1 — Python 2 except syntax** (critical) — `except AttributeError, TypeError:` in signing.py would cause SyntaxError. Fixed with parenthesized tuple.
2. **B2 — TUF fail-open** (high/security) — When TUF root unavailable, cert chain returned None (pass). Fixed to return INVALID_CERT (fail closed).
3. **B3 — SET verification honesty** (high) — Docstrings claimed SET is verified but only temporal window checked. Fixed docstrings to honestly document limitation.
4. **B4 — Canonicalization error swallowed** (medium) — try/except caught SkillSignError from canonicalize(), returned TAMPERED. Fixed to let SkillSignError(exit_code=10) propagate.
5. **B5 — Sidecar permission-denied mapped to UNSIGNED** (medium) — OSError from permission denial returned UNSIGNED. Fixed to re-raise SkillSignError.
6. **B6 — Cert chain verified at wrong time** (medium) — Used `cert.not_valid_before_utc` instead of rekor_timestamp. Fixed to use rekor_timestamp.
7. **B7 — Intermediate certs ignored** (medium) — `certificate_chain` sidecar field not passed to X509StoreContext. Fixed with `_split_pem_certs()` helper.
8. **B8 — Z suffix not validated** (medium) — rekor_timestamp accepted without requiring Z suffix. Fixed with explicit validation.

Additional fixes:
- Removed `X509StoreFlags.X509_STRICT` (false rejections risk)
- Updated `_SKIP_CHAIN` test pattern from patching `_get_trusted_root` to `_verify_cert_chain`

## Retro

### What Worked
- 4-reviewer parallel dispatch (code, crypto, c4, consistency) — high coverage, found 8 blocking issues
- Crypto reviewer caught the most impactful finding (fail-open TUF)
- Review-fix loop completed in single pass — all 8 fixes applied cleanly
- Vertical slice delivery continued: CLI commands now functional with real exit codes
- C4 model updated alongside code changes

### What Didn't Work
- Python 2 except syntax shipped past self-verification (should have been caught by linting)
- TUF fail-open security bug — defensive security patterns not yet internalized
- SET verification docstrings overclaimed — honesty gap between docs and implementation
- Edit tool applied to worktree path instead of main workspace (had to re-apply)

### Pattern Detection
- **Worktree architecture pollution** — confirmed again (C3 + C4). Agent worktrees copy .likec4 files, causing validation conflicts.
- **Fail-open security anti-pattern** — new hypothesis. When external dependency unavailable, code defaults to "skip check" rather than "fail".
- **Agents closing GitHub issues prematurely** — new hypothesis. Agents mark issues closed during execution rather than waiting for INTEGRATE.
- **Edit tool path confusion** — new hypothesis. Edits sometimes apply to stale worktree paths.

### Previous Retro Check (Cycle 003)
- PEP 758 rule: no new false positives — rule is working
- Spec step omission: no new observations this cycle. Keeping as hypothesis.
- Vertical slice gate: working — this cycle included CLI wiring and exit codes
- Worktree architecture pollution: **confirmed** (second observation). Ready for graduation.

## Hypotheses
- **Fail-open security anti-pattern** — first observation. Watch for similar patterns in policy engine.
- **Agents closing issues prematurely** — first observation. Verify in next cycle.
- **Edit tool path confusion** — first observation. May be transient.

## Changes Applied
- Issues created: #18 (SET strict mode), #19 (C4 model inconsistencies), #20 (worktree cleanup)
- Memory: updated with Sprint 4 results and Sigstore SDK patterns
- Process: none (worktree pollution fix deferred to #20)
