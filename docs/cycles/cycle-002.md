# Cycle 002

## Batch
- Issues: #4, #5, #6
- Agents: 1 implementation (lead), 2 reviewers (code-reviewer, crypto-reviewer)

## Results
- Completed: #4 (manifest reader), #5 (OIDC auth), #6 (signing engine)
- Failed: none
- Deferred: none

## Metrics
- Files added: 6 (3 modules, 3 test files)
- Files modified: 5 (pyproject.toml, uv.lock, components.likec4, 2 scrum skills)
- Lines added: ~1559
- Tests added: 37 (106 total)
- Review fixes: 3 (OIDC issuer URL, test digest computation, unnecessary patches)

## Retro

### What Worked
- Micro-batch pattern: each issue independently shippable with CI gate
- Parallel reviewer dispatch caught a real bug (wrong OIDC issuer for interactive flow)
- SDK exploration upfront prevented bad abstraction in auth module
- C4 architecture updates kept in sync with implementation learnings

### What Didn't Work
- Both reviewers flagged PEP 758 `except A, B:` syntax as a critical SyntaxError — it's valid Python 3.14. Wasted investigation time on a false positive.
- Both reviewers flagged `rekor_log_id` extraction as wrong (claimed it should be entry UUID, not key_id). Investigation confirmed the implementation matches the SDK's own canonical form. Another false positive.
- Initial test code had `x509.datetime.datetime` (non-existent API) and wrong timestamp constant — sloppy errors in test generation.

### Previous Retro Check (Cycle 001)
- Cycle 001 introduced `validate_skill_version` and defensive null-byte guard — both still in place and working
- Tight-loop micro-batch pattern was introduced mid-cycle-001 and refined here — confirmed effective

## Hypotheses
- **PEP 758 reviewer blind spot**: Reviewers don't know about Python 3.14's bare-comma except syntax. Consider adding a rule file. (First observation)
- **SDK assumption pattern**: Crypto reviewers assume Sigstore API semantics without checking SDK source code. Consider adding reviewer guidance to verify against SDK internals. (First observation)

## Changes Applied
- Skills: sprint-planning and sprint-execution updated with tight-loop pattern (carried from cycle 001)
- Rules: none (hypotheses need second observation before graduating)
- Process: none
- Issues created: none
- Memory: updated with Sprint 2 results
