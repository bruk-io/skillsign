---
name: sprint-evolution
description: >
  Use after the RETRO phase to apply retrospective outputs and prepare for
  the next cycle. Covers applying changes, the human checkpoint, agent
  roster management, model assignment strategy, and stuck agent detection.
  Loaded by the team lead during the EVOLVE phase.
---

# Sprint Evolution — EVOLVE Phase

You are the team lead wrapping up a sprint cycle. Your job is to apply retro outputs, present the cycle summary for human review, and prepare for the next cycle.

## Apply Retro Outputs

Work through ALL changes identified in the RETRO phase before presenting the human checkpoint. Do not skip or defer these — they are required outputs of the cycle.

### 1. Skill and Rule File Edits

If the retro identified process changes, you MUST edit the relevant skill/rule files now:

- **Scrum skills** live in `plugins/scrum/skills/` — edit directly
- **Security skills** live in `plugins/security/skills/` — edit directly
- **Project rules** live in `.claude/rules/` — edit directly
- Validate that new/updated skills have proper frontmatter (`name`, `description`)
- Verify rules are scoped correctly (project-level vs global)

Common process changes that require skill edits:
- New dispatch rules in `sprint-review/SKILL.md`
- Adjusted batch sizing in `sprint-planning/SKILL.md`
- New quality gates in `sprint-review/SKILL.md` or `sprint-execution/SKILL.md`
- Updated agent roster in `sprint-evolution/SKILL.md`

### 2. Non-blocking Code Fixes

Fix all non-blocking review notes that were deferred from the VERIFY phase:
- Code style issues (e.g., Click idiom, missing stubs)
- Minor improvements that don't change behavior
- These should be committed before the human checkpoint

### 3. Issue Creation

For work discovered during the sprint that is outside current scope:
- Create issues via `mcp__i-have-issues__create_issue`
- Assign to the correct milestone
- Tag with appropriate labels
- Bugs in previous sprint code get their own issues (not fixed inline)

### 4. Memory Updates
- Update `.claude/projects/.../memory/MEMORY.md` with confirmed patterns
- Remove or correct any memory entries invalidated by this cycle

## Human Checkpoint

Present a cycle summary to the human for review. Include:

1. **What was accomplished** — tasks completed, PRs merged, features delivered
2. **What failed** — tasks that didn't pass, with reasons
3. **What the retro recommends** — concrete changes proposed
4. **Next cycle scope** — proposed batch for the next PLAN phase

The human decides whether to:
- **Proceed** — start the next cycle with the proposed scope
- **Adjust scope** — modify the next batch (add/remove/reprioritize issues)
- **Pause** — stop development cycles (e.g., for manual review, strategic pivot)

Do NOT start the next cycle without human approval.

## Agent Roster

Reference for which agents to spawn and when:

| Agent | Model | Role | When to spawn |
|---|---|---|---|
| **Team lead** | Opus | Orchestrate outer loop, delegate, synthesize, decide | Every cycle (you) |
| **PM agent** | Sonnet | Select batches, create/triage issues, update roadmap | PLAN phase |
| **Implementation agents** | Sonnet | Write code in worktrees, self-verify | EXECUTE phase |
| **Security reviewers** | Opus | crypto, identity, policy, input-surface, attack, consistency | VERIFY phase (security changes) |
| **Code reviewer** | Sonnet | Bugs, logic, quality, conventions | VERIFY phase (all code) |
| **C4 reviewer** | Sonnet | Architecture model compliance | VERIFY phase (architecture changes) |
| **C4 modeler** | Opus | Architecture modeling decisions | When architecture needs updating |
| **Retro agent** | Opus | Synthesize cycle results, propose changes | RETRO phase |
| **Explore agents** | Haiku | Fast context gathering, file searches | As needed for research |

## Model Assignment Strategy

Choose the right model for the right work:

- **Opus** — Judgment, delegation, multi-step reasoning, technical design, architecture, security review, retro synthesis. Use when the task requires weighing trade-offs or making decisions.
- **Sonnet** — Implementation, straightforward review, issue creation. Use when requirements are clear and the task is execution over judgment.
- **Haiku** — Explore-only: codebase searches, file discovery, gathering context. Never for implementation or decisions. Use to save cost and latency on pure research.

## Stuck Agent Detection

Monitor for agents that go idle without completing their task:

- **TeammateIdle notification** — the system sends this automatically when an agent's turn ends
- An agent going idle immediately after sending a message is **normal** — they're waiting for a response
- An agent going idle without completing their task or sending a message is **potentially stuck**

When you detect a stuck agent:
1. Send a message asking for a status update
2. If the agent reports a blocker, help resolve it or reassign the task
3. If the agent is unresponsive, reassign the task to another agent
4. Note the pattern for the retro — stuck agents indicate unclear tasks or missing context

## Deciding Next Steps

After the human checkpoint:

| Decision | Action |
|---|---|
| **Proceed** | Start next cycle: load `sprint-planning` skill, begin PLAN phase |
| **Adjust scope** | Modify the proposed batch per human feedback, then proceed |
| **Pause** | Shut down teammates via `SendMessage` with `type: "shutdown_request"`, clean up with `TeamDelete` |
