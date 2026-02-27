---
name: sprint-execution
description: >
  Use when working on tasks during a sprint. Covers the full task lifecycle:
  claim, understand, plan, implement, self-verify, and report. Includes
  worktree discipline, self-verification checklist, failure reporting, and
  model assignment guidance. Loaded by implementation agents and any
  task-executing agent.
---

# Sprint Execution — EXECUTE Phase

You are an implementation agent working on tasks during a sprint. Follow this lifecycle for every task you work on.

## Core Principle: Tight Loops

**Each micro-batch task is a complete unit of work: deps + code + tests + CI green.** You do not move to the next task until CI passes on main for the current one. There is no "implementation done, tests later" — implementation without passing tests is not done.

## Task Lifecycle

### 1. Claim

Find and claim an unblocked task:

```
TaskList → find task with status "pending", no owner, empty blockedBy
TaskUpdate → set owner to your name, status to "in_progress"
```

**Prefer tasks in ID order** — lower IDs often set up context for later ones.

### 2. Understand

Before writing any code:

- Read the full task description and acceptance criteria (`TaskGet`)
- Read linked spec sections (referenced in the task description)
- Explore relevant code with `Glob` / `Grep` / `Read`
- Understand existing patterns before proposing new ones

### 3. Plan

Decide your approach:

- **Simple/clear tasks**: Proceed directly to implementation
- **Risky/complex tasks**: Use `EnterPlanMode` to submit a plan for team lead approval
  - The team lead receives a `plan_approval_request` and approves/rejects
  - Do NOT implement until approved

Criteria for requiring plan approval:
- Touches 3+ files in different modules
- Changes a public interface or data format
- Could break existing functionality
- Involves security-sensitive code (crypto, identity, policy)

### 4. Implement

Work in an isolated worktree:

- Use `isolation: "worktree"` when spawned, or `EnterWorktree` if working directly
- Write code following project conventions (see CLAUDE.md)
- **Write tests alongside implementation** — not after, not in a separate task
- Keep changes focused — one issue, one concern

#### Micro-Batch Steps (in order)

1. **Add dependencies** — if this task introduces new packages, add them to `pyproject.toml` first. Verify Python 3.14 compatibility before proceeding. Run `uv sync` to confirm resolution.
2. **Implement the module** — write the production code
3. **Write tests** — unit tests for the module, integration tests if it wires multiple components
4. **Run CI locally** — the full CI command sequence:
   ```bash
   uv run ruff check . && uv run ruff format --check . && uv run mypy skillsign/ && uv run pytest tests/ -v
   ```
5. **Fix issues** — iterate until all four checks pass
6. **Commit** — only after CI is green

If step 1 fails (dep incompatibility), stop and report immediately. Don't try to work around it.

### 5. Self-Verify

Before marking complete, run through this checklist:

- [ ] **Tests pass** — `uv run pytest tests/ -v` (all unit + integration tests)
- [ ] **Lint clean** — `uv run ruff check .`
- [ ] **Format clean** — `uv run ruff format --check .`
- [ ] **Type check** — `uv run mypy skillsign/` (no new type errors)
- [ ] **Acceptance criteria met** — every criterion in the task description
- [ ] **Spec compliance** — behavior matches the spec sections referenced in the task
- [ ] **No regressions** — existing tests still pass (not just new tests)
- [ ] **Exit gate** — CI green means this micro-batch is shippable

### 6. Report

**On success:**
```
TaskUpdate → status: "completed"
SendMessage → brief summary to team lead: what was done, any notes
```

**On failure:**
```
SendMessage → failure report to team lead (see format below)
```
Then immediately claim the next unblocked task. Do not wait for human input.

## Failure Report Format

When you cannot complete a task, report with this structure:

```
**Task:** [task ID and subject]
**Status:** Blocked / Failed

**What was attempted:**
- [step 1]
- [step 2]

**What failed:**
- [error output or description]

**What's blocking resolution:**
- [specific blocker: dep incompatibility, ambiguous spec, test infrastructure, etc.]

**Suggested next steps:**
- [concrete action that could unblock this]
```

## Model Assignment Guidance

Use the right model for the right work:

| Model | Use for |
|---|---|
| **Opus** | Judgment, architecture, security review, technical design, multi-step reasoning |
| **Sonnet** | Implementation, straightforward review, issue creation — clear requirements, execution over judgment |
| **Haiku** | Explore-only: codebase searches, file discovery, context gathering — never for implementation or decisions |

When spawning sub-agents for research, use Haiku. When spawning for implementation, use Sonnet. Reserve Opus for decisions that require judgment.

## Key Rules

- **Don't split implementation and tests.** They ship together or not at all.
- **Don't skip the exit gate.** CI green is the definition of done, not "code written."
- **Don't stall.** If blocked, report and claim the next unblocked task.
- **Don't wait for humans.** Agents are autonomous within their task scope.
- **Don't skip self-verification.** The checklist exists to catch issues before review.
- **Don't work outside your worktree.** All changes happen in isolation until integration.
- **Do communicate.** Use `SendMessage` for coordination, not just completion.
- **Do fail fast on deps.** If a new dependency doesn't work with Python 3.14, report immediately.
