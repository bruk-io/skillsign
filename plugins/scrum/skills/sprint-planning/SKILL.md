---
name: sprint-planning
description: >
  Use when starting a new development cycle. Selects 3-5 issues from GitHub,
  decomposes them into micro-batches (one issue = one shippable unit), and
  prepares the task list. Loaded by team lead or PM agent at the start of
  each sprint cycle.
---

# Sprint Planning — PLAN Phase

You are planning a development sprint. Your job is to select issues, decompose them into micro-batches, set dependencies, and prepare the shared task list for implementation agents.

## Core Principle: Tight Loops

**Every task must be independently shippable and CI-verifiable.** No task should require another unmerged task to be testable. Each micro-batch follows this cycle:

```
implement → test → lint/typecheck → CI green → merge → next
```

If a task can't pass CI on its own, it's scoped wrong. Split it further.

## Batch Selection

1. Query GitHub issues for the current milestone using `mcp__i-have-issues__list_issues`
2. Select **3-5 issues** grouped by dependency — issues that share code paths or build on each other belong in the same batch
3. Prioritize by:
   - Blocking dependencies (unblock others first)
   - Roadmap phase order (see `docs/roadmap.md`)
   - Risk (tackle unknowns early)

## Micro-Batch Decomposition

**One issue = one micro-batch = one task.** Each task includes implementation, tests, and any dependency changes needed to make it work.

Create one task per issue using `TaskCreate`. Each task MUST include:

- **subject**: `Micro-batch {N}{letter}: {description} (Issue #{num})`
- **description**: Must contain ALL of the following:
  - Issue number and spec sections
  - Steps: dep changes, implementation, tests, CI verification
  - Acceptance criteria
  - **Exit gate**: "CI green on main before starting next micro-batch"
- **activeForm**: Present continuous form

### What Goes Inside a Single Micro-Batch Task

Each micro-batch task bundles everything needed to ship one issue:

1. **Dependency changes** — add/update packages in pyproject.toml (verify Python 3.14 compat first)
2. **Implementation** — the module code
3. **Tests** — unit and integration tests
4. **CI verification** — run full local CI: `uv run ruff check . && uv run ruff format --check . && uv run mypy skillsign/ && uv run pytest tests/ -v`
5. **Commit and merge** — all green before moving on

### Why Not Separate Implementation and Test Tasks?

Separate tasks create a false dependency chain where implementation "finishes" before tests exist. This encourages:
- Writing code without thinking about testability
- Declaring implementation done before it's verified
- Long feedback loops where bugs are found late

Bundling them forces the agent to think about testing while implementing, and the exit gate (CI green) ensures nothing ships untested.

## Setting Dependencies

Use `TaskUpdate` with `addBlockedBy` / `addBlocks` to encode the dependency graph:

- Micro-batches that depend on another issue's module are blocked by that issue's micro-batch
- Independent issues can run in parallel (but still merge sequentially to keep main green)

### Dependency Verification Before Planning

Before committing to a batch, verify external dependencies work:

- **New packages**: Check Python 3.14 compatibility (check PyPI, try `uv add`)
- **New external integrations**: Verify SDK availability and API stability
- **Type checking**: Check if new deps ship `py.typed` or need mypy overrides

Flag blockers early. Don't let agents discover dep incompatibilities mid-implementation.

## Batch Sizing Targets

- **1 task per issue** — each task is a self-contained micro-batch
- **3-5 issues per sprint** yields 3-5 tasks
- Sequential dependency chain (A → B → C) or parallel where possible
- If an issue is too large for one task, split the issue first (create sub-issues on GitHub)

## Phase 1 MVP Batch Plan

Reference batch plan for Phase 1 (adjust based on current progress):

| Batch | Issues | Focus |
|---|---|---|
| 1 | #1-3 | Project scaffolding, canonical form processor, signed input digest |
| 2 | #4-6 | Manifest reader, OIDC auth flow, signing engine |
| 3 | #7-9 | Sidecar writer, sidecar reader, verification engine |
| 4 | #10-12 | TUF client, `sign` command, `verify` command |
| 5 | #13-15 | Auth commands, exit codes, test suite |

Within each batch, issues are ordered by dependency. Each issue ships as its own micro-batch with a CI-green gate before the next one starts.

## Output Checklist

Before moving to the EXECUTE phase, verify:

- [ ] 3-5 issues selected and documented
- [ ] One micro-batch task per issue (implementation + tests bundled)
- [ ] Dependencies set (`addBlockedBy` / `addBlocks`)
- [ ] No circular dependencies in the task graph
- [ ] External dependency compatibility verified (Python 3.14, type stubs)
- [ ] Each task has an explicit CI-green exit gate
