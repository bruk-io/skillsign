---
name: sprint-integration
description: >
  Use when merging reviewed work after the VERIFY phase. Covers merging
  passing PRs, flagging failures, updating the architecture model, and
  running integration verification. Loaded by the team lead during the
  INTEGRATE phase.
---

# Sprint Integration — INTEGRATE Phase

You are the team lead integrating reviewed work into the main branch. Your job is to merge passing work, flag failures, and verify the integrated codebase is healthy.

## Merge Passing Work

For each task that passed review (PASS or PASS with notes):

1. **Check the PR** — confirm all required reviewers approved
2. **Merge the PR** — use `gh pr merge` with the appropriate strategy
3. **Verify the merge** — ensure no merge conflicts and CI passes
4. **Update task status** — mark as completed if not already

### Merge Order

Merge in dependency order:
- Tasks with no dependencies first
- Then tasks whose dependencies are already merged
- This prevents merge conflicts from out-of-order integration

## Flag Failures

For each task that failed review:

1. **Create a follow-up task** with specific feedback from the reviewer
2. **Include:**
   - What was wrong (reviewer findings)
   - What needs to change (concrete fixes)
   - Link to the original task and review
3. **Add to next cycle's backlog** — these get priority in the next PLAN phase

## Update Architecture Model

If any merged work changed containers or components:

1. Check if `architecture/` needs updates
2. Spawn a `c4-modeler` agent (Opus) to update the model if needed
3. Validate with `npx likec4 validate`
4. Include architecture updates in the same integration cycle

Changes that typically require architecture updates:
- New components added to the CLI
- New external system integrations
- Changed relationships between components
- New containers or deployment targets

## Integration Verification

After all merges are complete, verify the integrated codebase:

1. **Run full test suite** — `uv run pytest` (all unit + integration tests)
2. **Lint check** — `ruff check`
3. **Architecture validation** — `npx likec4 validate`
4. **Spec compliance spot-check** — verify key behaviors match spec

If integration verification fails:

- Identify which merge introduced the failure
- Create a hotfix task with highest priority
- Do NOT proceed to RETRO until the codebase is green

## Output Checklist

Before moving to the RETRO phase:

- [ ] All passing PRs merged
- [ ] All failing tasks have follow-up tasks created
- [ ] Architecture model updated (if needed)
- [ ] Full test suite passes on main branch
- [ ] Lint passes on main branch
- [ ] No unresolved merge conflicts
