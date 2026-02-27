# SkillSign Development Workflow

This document formalizes how SkillSign is built: an **inner loop** (agent-level, autonomous) and an **outer loop** (team-level, human checkpoint). Both loops use Claude Code agent teams — shared task lists, inter-agent messaging, and quality gates.

---

## Inner Loop — Agent-Level (Autonomous)

Each agent follows this cycle for every task:

1. **Receive** — Claim an unblocked task from the shared task list (`TaskList` → `TaskUpdate` with `owner`)
2. **Understand** — Read the task description, acceptance criteria, and any linked spec sections
3. **Plan** — Design approach. For risky/complex tasks, submit plan for team lead approval
4. **Implement** — Work in a worktree (`isolation: "worktree"`). Write code, tests, docs
5. **Self-verify** — Run tests, check acceptance criteria, validate against spec
6. **Report** — Mark task complete (`TaskUpdate` with `status: "completed"`) or report failure with *why*: blockers, ambiguities, test output, what was tried

Failure reports must include:
- What was attempted
- What failed (with output)
- What's blocking resolution
- Suggested next steps

Agents do not wait for human input. If blocked, they report and move to the next available task.

---

## Outer Loop — Team-Level (Human Checkpoint)

Each development cycle follows 6 phases:

### 1. PLAN

The PM agent selects a batch of 3–5 issues from GitHub, grouped by dependency. For each issue:
- Create tasks in the shared task list with acceptance criteria
- Set task dependencies (`addBlockedBy` / `addBlocks`)
- Target 5–6 tasks per implementation agent

### 2. EXECUTE

The team lead (`TeamCreate`) spawns teammates and assigns tasks:
- Implementation agents work in worktrees, self-claim unblocked tasks as they finish
- Agents communicate via `SendMessage` for coordination
- Team lead monitors progress via `TaskList`

### 3. VERIFY

Review agents check output. Which reviewers are required depends on what changed:

| What changed | Required reviewer |
|---|---|
| Any code | `code-reviewer` (Sonnet) |
| Crypto / signing | `crypto-reviewer` (Opus) |
| Identity / auth | `identity-reviewer` (Opus) |
| Policy engine | `policy-reviewer` (Opus) |
| Input parsing | `input-surface-reviewer` (Opus) |
| Architecture model | `c4-reviewer` (Sonnet) |
| Cross-spec consistency | `consistency-checker` (Opus) |
| New attack surface | `attack-researcher` (Opus) |

All reviews use the feature-dev `code-reviewer` agent type for code, and the specialized SkillSign agents (defined in `.claude/agents/`) for security-sensitive areas.

### 4. INTEGRATE

Team lead merges passing work:
- PRs that pass all required reviews get merged
- Failures are flagged with specific feedback for the next cycle
- Architecture model is updated if containers/components changed

### 5. RETRO

Review the cycle with structured reflection:

- **What worked** — patterns to reinforce
- **What didn't** — failures to address
- **Pattern detection** — recurring agent failures, common blockers
- **Check previous retro** — did last cycle's changes help?
- **Concrete outputs:**
  - Skill/rule updates (`.claude/rules/`, `.claude/skills/`)
  - New GitHub issues for discovered work
  - Process changes to this workflow
  - Memory updates (`.claude/projects/.../memory/`)
  - Approach changes: tactical (this cycle), strategic (multi-cycle), structural (process/tooling)

### 6. EVOLVE

Apply retro outputs, then **human checkpoint** before the next cycle begins. The human reviews:
- What was accomplished
- What the retro recommends changing
- Whether to proceed, adjust scope, or pause

---

## Quality Gates

### TaskCompleted Hook

Before a task can be marked complete:
- All tests pass
- Acceptance criteria are met
- Code compiles / lints cleanly

### TeammateIdle Hook

Detect stuck agents:
- If an agent goes idle without completing its task, the team lead sends feedback
- Agents should report blockers rather than silently stalling

### Plan Approval

Required for risky or complex tasks:
- Team lead reviews implementation plan before agent proceeds
- Use `mode: "plan"` when spawning teammates for high-risk tasks
- Agent calls `ExitPlanMode` → team lead receives `plan_approval_request` → approves/rejects via `SendMessage`

---

## Agent Roster

| Agent | Model | Role | When to use |
|---|---|---|---|
| **Team lead** | Opus | Orchestrates outer loop, delegates, synthesizes, makes decisions | Every cycle |
| **PM agent** | Sonnet | Selects batches, creates/triages issues, updates roadmap | PLAN phase |
| **Implementation agents** | Sonnet | Write code in worktrees, self-verify against acceptance criteria | EXECUTE phase |
| **Security reviewers** | Opus | crypto, identity, policy, input-surface, attack-researcher, consistency | VERIFY phase (security-sensitive changes) |
| **Code reviewer** | Sonnet | Bugs, logic errors, code quality, project conventions | VERIFY phase (all code changes) |
| **C4 reviewer** | Sonnet | Architecture model compliance | VERIFY phase (architecture changes) |
| **C4 modeler** | Opus | Architecture modeling decisions | When architecture needs updating |
| **Retro agent** | Opus | Synthesizes cycle results, proposes process/skill changes | RETRO phase |
| **Explore agents** | Haiku | Fast context gathering, file searches, quick reads | As needed for research |

### Model Assignment Strategy

- **Opus** — Judgment, delegation, multi-step reasoning, technical design, architecture, security review, retro synthesis
- **Sonnet** — Implementation, straightforward review, issue creation. Clear requirements, execution > judgment
- **Haiku** — Explore-only: codebase searches, file discovery, gathering context. Never for implementation or decisions

---

## Batch Sizing

- **3–5 issues per cycle**, grouped by dependency
- **5–6 tasks per implementation agent**
- Each issue typically produces 2–4 tasks (implementation, tests, docs, integration)

### Phase 1 MVP Batch Plan

| Batch | Issues | Focus |
|---|---|---|
| 1 | #1–3 | Project scaffolding, canonical form processor, signed input digest |
| 2 | #4–6 | Manifest reader, OIDC auth flow, signing engine |
| 3 | #7–9 | Sidecar writer, sidecar reader, verification engine |
| 4 | #10–12 | TUF client, `sign` command, `verify` command |
| 5 | #13–15 | Auth commands, exit codes, test suite |

---

## Feedback Mechanisms

### Agent-Level
- Acceptance criteria checklist (pass/fail per criterion)
- Automated test results (unit, integration)
- Typed artifacts: code, tests, docs, architecture updates

### Team-Level
- Integration verification (does merged work still pass?)
- Backlog re-prioritization based on discovered work
- Architecture model sync (C4 model reflects current state)

### Cross-Cycle
- Retro recommendations tracked in `docs/cycles/patterns.md`
- Patterns confirmed across 2–3 cycles graduate to:
  - Skills (`.claude/skills/`)
  - Rules (`.claude/rules/`)
  - Memory updates
- Unconfirmed patterns are hypotheses, not process changes

---

## Cycle History

Each cycle produces a record stored in `docs/cycles/`:

```
docs/cycles/
  cycle-001.md    # Batch, results, retro findings, changes applied
  cycle-002.md
  ...
  patterns.md     # Stable patterns confirmed across multiple cycles
```

### Cycle Record Template

```markdown
# Cycle NNN

## Batch
- Issues: #X, #Y, #Z
- Agents: N implementation, N review

## Results
- Completed: [list]
- Failed: [list with reasons]
- Deferred: [list with reasons]

## Retro
- What worked: ...
- What didn't: ...
- Previous retro check: did changes from cycle N-1 help?

## Changes Applied
- Skills: ...
- Rules: ...
- Process: ...
- Issues created: ...
```
