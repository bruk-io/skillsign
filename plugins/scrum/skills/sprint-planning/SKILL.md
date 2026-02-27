---
name: sprint-planning
description: >
  Use when starting a new development cycle. Selects 3-5 issues from GitHub,
  creates tasks with acceptance criteria and dependencies, and sizes the batch
  for implementation agents. Loaded by team lead or PM agent at the start of
  each sprint cycle.
---

# Sprint Planning — PLAN Phase

You are planning a development sprint. Your job is to select a batch of issues, decompose them into tasks, set dependencies, and prepare the shared task list for implementation agents.

## Batch Selection

1. Query GitHub issues for the current milestone using `mcp__i-have-issues__list_issues`
2. Select **3-5 issues** grouped by dependency — issues that share code paths or build on each other belong in the same batch
3. Prioritize by:
   - Blocking dependencies (unblock others first)
   - Roadmap phase order (see `docs/roadmap.md`)
   - Risk (tackle unknowns early)

## Task Decomposition

For each selected issue, create **2-4 tasks** using `TaskCreate`:

- **Implementation task** — the core code change
- **Test task** — unit and integration tests for the change
- **Documentation task** — if the change affects public API, spec, or architecture
- **Integration task** — if the change requires wiring components together

Each task MUST include:
- **subject**: Imperative form ("Implement canonical form processor")
- **description**: What to build, acceptance criteria, linked spec sections, and any constraints
- **activeForm**: Present continuous ("Implementing canonical form processor")

## Setting Dependencies

Use `TaskUpdate` with `addBlockedBy` / `addBlocks` to encode the dependency graph:

- Test tasks are blocked by their implementation task
- Integration tasks are blocked by all component tasks they wire together
- Documentation tasks can run in parallel with tests

## Batch Sizing Targets

- **5-6 tasks per implementation agent** — enough to stay busy, not so many that context is lost
- Each issue typically produces 2-4 tasks
- A batch of 3-5 issues yields 6-20 tasks total
- If the batch exceeds 20 tasks, split into two cycles

## Phase 1 MVP Batch Plan

Reference batch plan for Phase 1 (adjust based on current progress):

| Batch | Issues | Focus |
|---|---|---|
| 1 | #1-3 | Project scaffolding, canonical form processor, signed input digest |
| 2 | #4-6 | Manifest reader, OIDC auth flow, signing engine |
| 3 | #7-9 | Sidecar writer, sidecar reader, verification engine |
| 4 | #10-12 | TUF client, `sign` command, `verify` command |
| 5 | #13-15 | Auth commands, exit codes, test suite |

## Output Checklist

Before moving to the EXECUTE phase, verify:

- [ ] 3-5 issues selected and documented
- [ ] All tasks created with acceptance criteria
- [ ] Dependencies set (`addBlockedBy` / `addBlocks`)
- [ ] No circular dependencies in the task graph
- [ ] Each implementation agent has 5-6 tasks assigned or available to claim
