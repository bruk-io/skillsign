---
name: sprint-review
description: >
  Use when reviewing completed work after sprint execution. Dispatches the
  right reviewer agent based on what changed. Covers the review dispatch
  table, quality gates, and plan approval process. Loaded by team lead
  and review agents during the VERIFY phase.
---

# Sprint Review — VERIFY Phase

You are reviewing completed work from the sprint. Your job is to dispatch the right reviewers based on what changed, enforce quality gates, and ensure all work meets acceptance criteria before integration.

## Review Dispatch Table

For each completed task, determine what changed and spawn the appropriate reviewer agents:

| What changed | Required reviewer | Model | Agent type |
|---|---|---|---|
| Any code | `code-reviewer` | Sonnet | `feature-dev:code-reviewer` |
| Crypto / signing logic | `crypto-reviewer` | Opus | `crypto-reviewer` |
| Identity / auth logic | `identity-reviewer` | Opus | `identity-reviewer` |
| Policy engine logic | `policy-reviewer` | Opus | `policy-reviewer` |
| Input parsing / canonical form | `input-surface-reviewer` | Opus | `input-surface-reviewer` |
| Architecture model (.likec4) | `c4-reviewer` | Sonnet | `likec4:c4-reviewer` |
| New/renamed `skillsign/*.py` modules | `c4-reviewer` | Sonnet | `likec4:c4-reviewer` |
| Cross-spec references | `consistency-checker` | Opus | `consistency-checker` |
| New attack surface | `attack-researcher` | Opus | `attack-researcher` |

### Dispatch Rules

1. **Every code change** gets a `code-reviewer` — no exceptions
2. **Security-sensitive changes** get the domain-specific reviewer in addition to code review
3. **Multiple reviewers can run in parallel** — spawn them concurrently using the `Task` tool
4. A change can trigger multiple reviewers (e.g., signing code triggers both `code-reviewer` and `crypto-reviewer`)
5. **New Python modules** trigger a `c4-reviewer` to check for architecture drift — the reviewer should compare new `skillsign/*.py` files against C4 component elements in `architecture/` and flag any modules that lack a corresponding component (or components that lack a corresponding module)

### How to Determine What Changed

- Check the task description for which components/modules were modified
- Use `git diff` on the worktree branch to see actual file changes
- Map changed files to domains:
  - `skillsign/canonical*` → input parsing
  - `skillsign/sign*`, `skillsign/crypto*` → crypto / signing
  - `skillsign/verify*` → crypto + identity
  - `skillsign/policy*` → policy engine
  - `skillsign/oidc*`, `skillsign/identity*` → identity / auth
  - `architecture/` → architecture model
  - `docs/spec.md` → cross-spec consistency
- Check for **new or renamed** `skillsign/*.py` files (not just modifications):
  - New modules may represent new components that need C4 model entries
  - Use `git diff --name-status` to detect added (A) or renamed (R) files
  - Trigger `c4-reviewer` to compare new modules against `architecture/` elements

## Quality Gates

### TaskCompleted Gate

Before a task can be marked complete, verify:

- [ ] All tests pass (unit + integration)
- [ ] Acceptance criteria from the task description are met
- [ ] Code compiles and lints cleanly (`ruff check`)

### Plan Approval Gate

For tasks that required plan approval:

- The implementation agent called `ExitPlanMode`
- Team lead received a `plan_approval_request`
- Team lead approved via `SendMessage` with `type: "plan_approval_response"`
- Only then did implementation proceed

Verify the implementation matches the approved plan.

## Review Process

For each task under review:

1. **Read the task** — understand acceptance criteria and scope
2. **Dispatch reviewers** — spawn appropriate agents based on dispatch table
3. **Collect results** — wait for all reviewer agents to complete
4. **Synthesize** — combine reviewer findings into a single assessment:
   - **PASS** — all reviewers approve, quality gates met
   - **PASS with notes** — minor suggestions, non-blocking
   - **FAIL** — blocking issues found, specific feedback provided
5. **Record result** — update the task or send feedback to team lead

## Handling Review Findings

### Blocking issues in current sprint code

Fix immediately in the same cycle. Do NOT create a GitHub issue — the review-fix loop should stay tight:

1. Fix the code based on reviewer feedback
2. Re-run the relevant reviewers on the fixed code
3. Update the review verdict (FAIL → PASS)
4. Proceed to integration

### Bugs discovered in code from previous sprints

Create a GitHub issue and defer to the next batch:

1. Create an issue via `mcp__i-have-issues__create_issue` describing the bug
2. Tag with the appropriate milestone and labels
3. Do NOT fix it in the current sprint — it needs its own review cycle
4. Note it in the cycle record for the retro

### Non-blocking notes

Record in the cycle record. Address during the EVOLVE phase if they are process/skill changes, or create issues if they are code improvements to defer.

### Review failures (FAIL verdict)

- Create a new task with the specific feedback and required fixes
- Link it to the original task for context
- The fix goes through the same review process
- Do NOT merge work that fails review
