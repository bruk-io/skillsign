# Cycle 003

## Batch
- Issues: #7, #8, #9 (sidecar writer, sidecar reader, verification engine)
- Agents: 2 implementation (parallel sidecar writer + reader, then verification engine), 5 reviewers (code, crypto, identity, input-surface, consistency)

## Results
- Completed: #7 (sidecar writer), #8 (sidecar reader), #9 (verification engine)
- Failed: none (4 review fix tasks created and completed in-cycle)
- Deferred: none

## Metrics
- Files added: 4 (sidecar.py, verify.py, test_sidecar.py, test_verify.py)
- Files modified: 1 (signing.py — added `force` parameter)
- Lines added: ~1800
- Tests added: 113 (219 total, up from 106)
- Review findings: 6 actionable (2 security, 3 important, 1 minor)
- Review fixes: 4 tasks, 10 new tests

## Review Findings Summary
1. **SKILL_ID_MISMATCH missing** (security) — spec step 11 completely absent, allows namespace squatting. Fixed.
2. **Writer YAML injection** (security) — `_append_scalar` bare f-string allows newline injection. Fixed with input validation.
3. **OSError → TAMPERED** (important) — I/O error mapped to wrong result code. Fixed to raise SkillSignError(exit_code=10).
4. **No P-256 curve pinning** (important) — no algorithm check before ECDSA verify. Fixed with isinstance checks.
5. **Impossible timestamps accepted** (important) — regex-only validation. Fixed with datetime.fromisoformat() parsing.
6. **Wrong-key test coverage** (minor) — only garbled bytes tested, not wrong-key scenario. Fixed with additional test.

## Retro

### What Worked
- Parallel agent execution: sidecar writer + reader ran concurrently, merged cleanly
- 5-reviewer parallel dispatch: found 6 actionable issues including a security gap
- Review-fix loop completed in single pass: 4 fix tasks, 10 new tests, all passing first run
- C4 model was pre-built — no architecture updates needed
- Test count grew from 106 to 219 across the sprint

### What Didn't Work
- PEP 758 false positive again (second occurrence — now graduated to a rule)
- Worktree copies of .likec4 files caused validation failures (63 duplicate elements)
- Implementation agent omitted spec step 11 (SKILL_ID_MISMATCH) entirely
- OSError mapped to TAMPERED (semantic error caught by 2 reviewers)

### Previous Retro Check (Cycle 002)
- PEP 758 hypothesis: **Confirmed** — happened again. Graduated to `.claude/rules/python314-syntax.md`
- SDK assumption hypothesis: No new observation. Keeping as hypothesis.
- Tight-loop micro-batch: Still effective for this batch size (3 issues)

## Hypotheses
- **Spec step omission**: Implementation agents may skip verification steps that lack obvious test scaffolding. Step 11 had an enum value and exit code mapping but no test, and the agent skipped it. (First observation)
- **Worktree architecture pollution**: Agent worktrees copy architecture files, causing likec4 validation conflicts when the main workspace is validated. Consider adding `.likec4ignore` or cleaning architecture from worktrees. (First observation)
- **Redundant reviewer findings**: Multiple reviewers independently flag the same issue (OSError→TAMPERED caught by code-reviewer and consistency-checker). This is expected defense-in-depth, not waste. (Confirmed — second observation)

## Structural Learning: Vertical Slices

After 3 cycles of pure library code, the CLI is still entirely stubs. The user cannot run anything. This is a **horizontal layering anti-pattern** — building all internals before any user-facing wiring.

**Root cause:** The roadmap (issues #1-15) was structured layer-by-layer: canonical → digest → manifest → auth → signing engine → sidecar → verification engine → TUF → CLI commands. Each cycle shipped tested internal modules but zero runnable functionality.

**Fix:** Every cycle must deliver a **vertical slice** — a thin path from user input to visible output. Even if it's minimal, the user should be able to run something new after each cycle. The sprint-planning skill needs to enforce this: "Does this batch include a user-facing entry point?"

**Applied:** Updated sprint-planning skill with vertical slice gate. Wired up `sign` and `verify` CLI commands immediately after this retro.

## Changes Applied
- Rules: `.claude/rules/python314-syntax.md` — graduated PEP 758 pattern
- Process: sprint-planning skill updated with vertical slice requirement
- Issues created: none
- Memory: updated with Sprint 3 results + vertical slice lesson
