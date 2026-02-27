---
name: skillsign-identity-attack-patterns
description: This skill provides attack patterns for identity spoofing, namespace squatting, and trust boundary violations in signing systems. Use when reviewing signer identity claims, skill_id ownership, SAN manipulation, certificate chain attacks, percent-encoding bypass, case sensitivity mismatches, org membership confusion, or policy evaluation attacks. Do NOT use for general identity/auth patterns unrelated to signing specifications.
---

# Identity and Namespace Attack Patterns

## Identity Spoofing Attacks

### 1. Namespace Squatting
- **Attack**: Register `skill_id: github.com/anthropic/malicious-skill` before the real org does
- **Impact**: Consumers trust the skill based on the `skill_id` namespace
- **Mitigation**: Registry-level namespace ownership verification
- **Spec gap indicator**: Is `skill_id` ownership enforcement specified? Is it deferred to registry?

### 2. Account Takeover / Rename
- **Attack**: GitHub account renamed or transferred; new owner inherits the identity
- **Impact**: Historical signatures remain valid under a different controller
- **Mitigation**: `rekor_timestamp` bounds the signing event; consumers can set `max_age_days`
- **Spec gap indicator**: Is account rename/transfer documented as a known risk?

### 3. Org Membership Confusion
- **Attack**: Claim `signer_org: anthropic` without being a member
- **Impact**: Policy rules based on `signer_org` may be confused
- **Mitigation**: `signer_org` only matches GitHub Actions SANs (multi-segment paths), not individuals
- **Spec gap indicator**: Is org membership validation explicitly scoped? Can individual signers match `signer_org`?

### 4. SAN Manipulation
- **Attack**: Forge or modify the certificate SAN to claim a different identity
- **Impact**: Identity claims become unreliable
- **Mitigation**: Fulcio validates OIDC token before issuing cert; SAN is set by Fulcio, not the signer
- **Spec gap indicator**: Does the spec assume SAN is signer-controlled or CA-controlled?

### 5. Percent-Encoding Bypass
- **Attack**: Use `anthropic%2Ffoo` in signer URL to confuse org extraction
- **Impact**: `signer_org` matching produces wrong result
- **Mitigation**: Percent-decode path before splitting on `/`
- **Spec gap indicator**: Is percent-decoding specified in the org extraction algorithm?

### 6. Case Sensitivity Mismatch
- **Attack**: Sign as `GitHub.com/Anthropic/skill` but policy checks `github.com/anthropic`
- **Impact**: Policy bypass via case variation
- **Mitigation**: Case-sensitive matching throughout; recommend lowercase
- **Spec gap indicator**: Are case sensitivity rules consistent between signing and verification?

## Certificate and Chain Attacks

### 7. Intermediate CA Substitution
- **Attack**: Present a valid but wrong intermediate certificate
- **Impact**: Chain validates but identity claims come from wrong CA
- **Mitigation**: Validate full chain against pinned Fulcio root via TUF
- **Spec gap indicator**: Is chain validation against TUF root specified?

### 8. Expired Certificate Replay
- **Attack**: Use a signature with an expired certificate
- **Impact**: If temporal binding isn't checked, stale signatures accepted
- **Mitigation**: Verify Rekor SET timestamp falls within cert validity window
- **Spec gap indicator**: Is temporal validity check (SET vs cert window) specified as a verification step?

### 9. Self-Signed Certificate
- **Attack**: Present a self-signed cert with arbitrary SAN
- **Impact**: Identity claims are attacker-controlled
- **Mitigation**: Validate chain back to Fulcio root
- **Spec gap indicator**: Is the verification step "validate against Fulcio root" explicit?

## Policy Evaluation Attacks

### 10. Policy File Tampering
- **Attack**: Modify `.skillsign-policy.yaml` to weaken trust constraints
- **Impact**: Untrusted skills become accepted
- **Mitigation**: Policy file is unsigned; protect via VCS and access controls
- **Spec gap indicator**: Is the unsigned nature of the policy file documented as a security consideration?

### 11. First-Match Exploitation
- **Attack**: Insert a broad `allow` rule before specific `deny` rules
- **Impact**: Deny rules never evaluated
- **Mitigation**: Document first-match-wins behavior clearly; warn about rule ordering
- **Spec gap indicator**: Is rule evaluation order specified? Are examples showing deny-before-allow provided?

### 12. Default Action Confusion
- **Attack**: Omit `default` field, hoping for fail-open
- **Impact**: Unmatched skills silently allowed
- **Mitigation**: `default` is required; missing `default` is a parse error
- **Spec gap indicator**: Is `default` required? What happens when it's missing?

### 13. signer_org Matching Edge Cases
- Individual signers with paths like `https://github.com/anthropic` (single segment)
- Should NOT match `signer_org: anthropic` (designed for CI/Actions)
- Edge case: What about `https://github.com/anthropic/` (trailing slash)?
- **Spec gap indicator**: Are individual vs Actions signer paths clearly distinguished?

## Review Checklist

When reviewing identity-related security:
1. Is the trust boundary between signer identity and skill_id ownership clear?
2. Can `signer_org` be confused between individuals and CI pipelines?
3. Is percent-decoding applied before org extraction?
4. Are case sensitivity rules documented and consistent?
5. Is certificate chain validation specified against a specific root?
6. Is temporal binding (SET vs cert window) a required verification step?
7. Is the policy file's unsigned nature documented?
8. Is `default` action required in policies?
9. Are rule evaluation semantics (first-match-wins, AND within rules) explicit?
10. Is account rename/transfer documented as a known limitation?
11. Is `skill_id` ownership enforcement scoped appropriately (spec vs registry)?
12. Are all URL parsing steps (decoding, splitting) specified algorithmically?
