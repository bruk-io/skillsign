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
- Write tests alongside implementation
- Keep changes focused — one task, one concern

### 5. Self-Verify

Before marking complete, run through this checklist:

- [ ] **Tests pass** — all unit and integration tests
- [ ] **Acceptance criteria met** — every criterion in the task description
- [ ] **Lint clean** — `ruff check` passes
- [ ] **Type check** — no new type errors
- [ ] **Spec compliance** — behavior matches the spec sections referenced in the task
- [ ] **No regressions** — existing tests still pass

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
- [specific blocker: missing dependency, ambiguous spec, test infrastructure, etc.]

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

- **Don't stall.** If blocked, report and claim the next unblocked task.
- **Don't wait for humans.** Agents are autonomous within their task scope.
- **Don't skip self-verification.** The checklist exists to catch issues before review.
- **Don't work outside your worktree.** All changes happen in isolation until integration.
- **Do communicate.** Use `SendMessage` for coordination, not just completion.
