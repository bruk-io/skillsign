---
name: skillsign-security-review
description: This skill should be used when the user asks to "run a security review", "review the spec", "check the specification security", "analyze SkillSign", or mentions reviewing the SkillSign specification. Launches 6 specialized agents in parallel (crypto-reviewer, input-surface-reviewer, identity-reviewer, policy-reviewer, attack-researcher, consistency-checker) to perform a comprehensive security review and synthesize findings into tiered recommendations.
---

# SkillSign Security Review

Run a comprehensive security review of the SkillSign specification using 6 specialized agents in parallel.

## Agents

| Agent | Domain | Skill |
|-------|--------|-------|
| `crypto-reviewer` | Cryptographic protocol correctness, Sigstore integration, temporal binding | sigstore-protocol |
| `input-surface-reviewer` | YAML parsing, UTF-8 handling, canonical form, format restrictions | parser-attack-taxonomy |
| `identity-reviewer` | Identity claims, namespace ownership, SAN matching, trust boundaries | identity-attack-patterns |
| `policy-reviewer` | Policy engine design, rule evaluation, max_age_days, flag interactions | policy-engine-patterns |
| `attack-researcher` | Threat modeling, attack trees, supply chain, downgrade/replay attacks | threat-modeling |
| `consistency-checker` | Internal consistency, cross-references, completeness, implementability | spec-quality-checklist |

## Usage

Launch all 6 agents in parallel against the spec:

```
Use the crypto-reviewer, input-surface-reviewer, identity-reviewer, policy-reviewer, attack-researcher, and consistency-checker agents to review SkillSignSpec1.0.md
```

## Synthesizing Results

After all agents return, consolidate findings into tiers:

- **Tier 1 (Blockers)**: Issues flagged by 2+ agents at CRITICAL/HIGH that could cause verification bypass, identity spoofing, or interop failure
- **Tier 2 (High Priority)**: Single-agent CRITICAL/HIGH findings or multi-agent MEDIUM findings
- **Tier 3 (Medium)**: MEDIUM findings with clear recommendations

Cross-agent convergence is a strong confidence signal — issues found independently by multiple agents are almost certainly real.

## Review Cadence

1. Run full 6-agent review after each major spec revision
2. Run targeted agents for focused changes (e.g., only `crypto-reviewer` after modifying Section 5)
3. Check agent memory files for patterns across reviews
