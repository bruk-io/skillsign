---
name: sprint-retrospective
description: >
  Use after the INTEGRATE phase to reflect on the sprint cycle. Analyzes
  what worked, what didn't, detects patterns across agent failures, checks
  previous retro effectiveness, and produces concrete outputs (skill/rule
  updates, new issues, process changes, memory updates). Loaded by team
  lead or retro agent (Opus) during the RETRO phase.
---

# Sprint Retrospective — RETRO Phase

You are conducting a sprint retrospective. Your job is to analyze the cycle, detect patterns, and produce concrete changes that improve future cycles.

## Structured Reflection

Work through each section in order:

### 1. What Worked

Identify patterns to reinforce:
- Which agents completed tasks efficiently?
- Which processes ran smoothly?
- What tooling/skills saved time?
- Were there positive surprises?

### 2. What Didn't Work

Identify failures to address:
- Which tasks failed or were deferred? Why?
- Where did agents get stuck or stall?
- What caused review failures?
- Were there communication breakdowns?

### 3. Pattern Detection

Look for recurring issues across agents and tasks:
- Same type of failure appearing in multiple tasks
- Common blockers (missing test infrastructure, ambiguous spec, etc.)
- Agents consistently struggling with certain task types
- Review findings that repeat across PRs

### 4. Check Previous Retro

If this is not the first cycle:
- Read the previous cycle record from `docs/cycles/cycle-NNN.md`
- Did the changes from last cycle help?
- Are there changes that didn't have the expected effect?
- Should any previous changes be reverted?

## Concrete Outputs

Every retro MUST produce at least one of these:

### Skill/Rule Updates
- New skills in `.claude/skills/` for recurring patterns
- New rules in `.claude/rules/` for conventions discovered
- Updates to existing skills/rules that proved incomplete

### New GitHub Issues
- Discovered work that wasn't in the backlog
- Infrastructure improvements needed
- Spec clarifications required
- Use `mcp__i-have-issues__create_issue` to create them

### Process Changes
- Adjustments to batch sizing, review dispatch, or task decomposition
- Changes to quality gates or self-verification checklist

### Memory Updates
- Update `.claude/projects/.../memory/MEMORY.md` with stable patterns
- Only write patterns confirmed by this cycle's evidence

## Approach Categories

Classify each change by scope:

| Scope | Description | Example |
|---|---|---|
| **Tactical** | This cycle only | "Increase batch size from 3 to 5 for scaffolding tasks" |
| **Strategic** | Multi-cycle pattern | "Always pair crypto tasks with identity review" |
| **Structural** | Process/tooling change | "Add a pre-commit hook for spec compliance" |

## Cross-Cycle Pattern Graduation

Patterns follow a promotion path:

1. **Hypothesis** — observed once, noted in cycle record
2. **Confirmed** — observed in 2-3 cycles, tracked in `docs/cycles/patterns.md`
3. **Graduated** — promoted to a skill, rule, or memory entry

Do NOT promote a pattern to a skill/rule after a single observation. Note it as a hypothesis and verify in subsequent cycles.

## Cycle Record

Create a cycle record at `docs/cycles/cycle-NNN.md`:

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

## Output Checklist

Before moving to the EVOLVE phase:

- [ ] All four reflection sections completed
- [ ] At least one concrete output produced
- [ ] Changes classified by scope (tactical/strategic/structural)
- [ ] Cycle record written to `docs/cycles/cycle-NNN.md`
- [ ] Hypotheses noted for future verification
- [ ] Memory updated with confirmed patterns only
