# Cross-Cycle Pattern Tracker

Patterns follow a promotion path: Hypothesis (1 observation) → Confirmed (2-3 cycles) → Graduated (skill/rule/memory).

## Graduated

| Pattern | First Seen | Graduated | Output |
|---|---|---|---|
| PEP 758 false positive | C2 | C3 | `.claude/rules/python314-syntax.md` |
| Vertical slice requirement | C3 | C3 | Sprint-planning skill updated |
| Redundant reviewer findings (defense-in-depth) | C2 | C3 | Accepted as expected behavior |

## Confirmed (ready for graduation)

| Pattern | First Seen | Confirmed | Observations |
|---|---|---|---|
| Worktree architecture pollution | C3 | C4 | Agent worktrees copy .likec4 files, causing duplicate elements in validation. Issue #20 created. |

## Hypotheses (watching)

| Pattern | First Seen | Observations | Notes |
|---|---|---|---|
| SDK assumption errors | C2 | 1 | Agents guess SDK APIs instead of reading docs. No repeat in C3-C4. |
| Spec step omission | C3 | 1 | Agents skip spec steps that lack test scaffolding. No repeat in C4. |
| Fail-open security | C4 | 1 | When external deps unavailable, code defaults to skip instead of fail. |
| Agents closing issues prematurely | C4 | 1 | Agents mark issues closed during EXECUTE rather than INTEGRATE. |
| Edit tool path confusion | C4 | 1 | Edits apply to stale worktree paths. May be transient. |
