---
name: skillsign-policy-engine-patterns
description: This skill provides security patterns for policy engine design in signing specifications. Use when reviewing trust policy format, rule evaluation order (first-match-wins), default action handling, max_age_days semantics, signer vs signer_org matching, require_signer_id_match behavior, CLI flag interactions with offline mode, or unsigned policy file risks. Do NOT use for general authorization policy design unrelated to signing verification.
---

# Policy Engine Security Patterns

## Policy Language Design

### Required Properties
Every policy language should specify:

1. **Default action**: What happens when no rule matches? Must be explicit (fail-closed).
2. **Evaluation order**: First-match-wins, all-rules, priority-based?
3. **Rule semantics**: AND (all fields must match) vs OR (any field matches)
4. **Version field**: Required, with explicit rejection of unknown versions
5. **Field validation**: Which values are valid for each field? Parse-time vs runtime validation?

### Common Policy Engine Vulnerabilities

#### Fail-Open Defaults
- Missing `default` field silently allows everything
- Defense: `default` MUST be required; missing = parse error

#### Version Confusion
- Unknown policy version silently evaluated with v1 semantics
- Defense: Unknown version = hard parse error (exit code 10)

#### Rule Ordering Exploitation
- In first-match-wins: broad allow before specific deny bypasses restrictions
- In last-match-wins: deny rules can be overridden by later allows
- Defense: Document evaluation order explicitly with examples

#### AND vs OR Confusion
- When a rule has multiple fields (`signer_org` + `max_age_days`):
  - AND: both must match for the rule to apply
  - OR: either triggers the rule
- Defense: Explicitly document AND semantics within rules, OR across rules

#### Field Injection
- Extra/unknown fields in policy rules silently ignored
- Attacker adds fields that look restrictive but are actually no-ops
- Defense: Reject unknown fields at parse time

#### Type Coercion
- YAML auto-converts: `max_age_days: yes` -> `max_age_days: true`
- Defense: Mandate YAML 1.2 where `yes`/`no` are strings, validate field types

### max_age_days Security

#### Self-Asserted Timestamp Bypass
- `rekor_timestamp` in sidecar is self-asserted
- If evaluated without Rekor verification, attacker can backdate
- Defense: `max_age_days` MUST trigger strict Rekor verification automatically

#### Offline Mode Conflict
- `max_age_days` requires network access to verify `rekor_timestamp`
- Defense: `--offline` + `max_age_days` = exit code 10 (unless `--offline-age-skip`)

#### Zero/Negative Values
- `max_age_days: 0` or `max_age_days: -1` could cause logic errors
- Defense: Must be positive integer; 0 and negative rejected at parse time

### signer vs signer_org Semantics

#### Scope Distinction
- `signer`: exact URL match (e.g., `https://github.com/user`)
- `signer_org`: matches first path segment of Actions SANs only
- Individuals (single path segment) CANNOT match `signer_org`

#### Why This Matters
- Prevents individual users from matching org-level trust rules
- CI/Actions SANs have org as first path segment: `/{org}/{repo}/...`
- Individual SANs have username as only path segment: `/{username}`

### require_signer_id_match

#### Evaluation Order
- Applied AFTER all verification steps
- Applied BEFORE policy rules
- Produces exit code 1 (not 3/POLICY_FAIL)

#### Edge Cases
- What if `skill_id` host differs from signer URL host?
- What if owner segment extraction fails?
- How are GitHub Actions workflow paths parsed for owner?

## Policy File Security

### Unsigned Policy Problem
- Policy file is not signed or integrity-protected
- Attacker with filesystem access can modify policy
- Defense: Document this clearly; recommend VCS protection

### Policy File Location Trust
- Policy file path is user-specified (`--policy <file>`)
- Or auto-discovered in project directory
- TOCTOU: policy file could change between discovery and evaluation
- Defense: Read and parse once at startup

### Policy Composition
- Multiple policy files? Merge semantics?
- In v0.1: single policy file only
- Defense: Reject multiple policy sources or document merge behavior

## Review Checklist

1. Is `default` action required? What happens when omitted?
2. Is `version` required? What happens with unknown version?
3. Is rule evaluation order (first-match-wins) documented?
4. Are multi-field rule semantics (AND) documented?
5. Are unknown/extra fields rejected at parse time?
6. Does `max_age_days` auto-enable strict Rekor verification?
7. Is `max_age_days` with `--offline` handled (exit 10)?
8. Are `max_age_days` bounds validated (positive integer)?
9. Is `signer_org` matching limited to Actions SANs?
10. Is `require_signer_id_match` evaluation order specified?
11. Is the unsigned policy file documented as a security risk?
12. Is the `signer` field format validated (full HTTPS URL required)?
