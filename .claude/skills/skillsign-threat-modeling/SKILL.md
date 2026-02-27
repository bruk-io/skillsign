---
name: skillsign-threat-modeling
description: This skill provides threat modeling frameworks for signing specifications using STRIDE and attack trees. Use when analyzing supply chain compromise, substitution attacks, sidecar rollback, verification bypass, policy weakening, downgrade attacks, TOCTOU exploitation, temporal attack vectors, or signer impersonation paths. Do NOT use for general application threat modeling unrelated to signing systems.
---

# Threat Modeling for Signing Specifications

## STRIDE Framework Applied to Signing Systems

### Spoofing
- Can an attacker forge the signer's identity?
- Can certificate SANs be manipulated?
- Can `skill_id` ownership be falsely claimed?
- Is the OIDC provider's trust model sound?

### Tampering
- Can signed content be modified after signing?
- Can the sidecar file be modified without detection?
- Can the policy file be weakened?
- Can the canonical form be manipulated to produce collisions?

### Repudiation
- Can a signer deny having signed a skill?
- Is the transparency log tamper-evident?
- Are SET timestamps cryptographically bound?

### Information Disclosure
- Does the signing process leak private information?
- Are OIDC tokens properly scoped and short-lived?
- Does the sidecar expose sensitive metadata?

### Denial of Service
- Can verification be made unreasonably slow?
- Can YAML parsing be used for resource exhaustion (billion laughs)?
- Can the transparency log be overwhelmed?
- Are file size limits enforced?

### Elevation of Privilege
- Can unsigned skills bypass verification?
- Can a weaker verification mode be forced?
- Can policy rules be manipulated to grant unauthorized trust?

## Attack Trees for Signing Systems

### Goal: Execute Malicious Skill as Trusted

#### Path 1: Supply Chain Compromise
1. Compromise signer's GitHub account
2. Use compromised credentials to obtain OIDC token
3. Sign malicious skill with legitimate identity
4. Distribute via normal channels

#### Path 2: Substitution Attack
1. Obtain valid signature for `skill_id: github.com/org/legit-skill`
2. Attempt to apply signature to different skill content
3. Blocked by: digest includes content + skill_id + version

#### Path 3: Sidecar Rollback
1. Retain old valid sidecar for previous version
2. Serve old sidecar with current (modified) SKILL.md
3. Blocked by: digest mismatch (content changed)
4. Variant: serve old sidecar with OLD content (rollback attack)
5. Partially mitigated by: `max_age_days` policy

#### Path 4: Bypass Verification
1. Target environments that don't enforce verification
2. Ship skill without sidecar (exits `UNSIGNED`, code 2)
3. Blocked by: `default: deny` policy
4. Variant: corrupt sidecar to trigger `MALFORMED_SIDECAR` fallback

#### Path 5: Policy Weakening
1. Gain filesystem access to policy file
2. Change `default: deny` to `default: allow`
3. Or remove restrictive rules
4. Blocked by: policy is unsigned (known limitation)

#### Path 6: Downgrade Attack
1. Craft sidecar with `version: 0` or unknown version
2. Hope client has lenient version handling
3. Blocked by: unknown version = `MALFORMED_SIDECAR` hard failure

#### Path 7: TOCTOU Exploitation
1. Pass verification with legitimate SKILL.md
2. Swap file between verify and load
3. Partially mitigated by: verify immediately before load

### Goal: Impersonate a Trusted Signer

#### Path 1: GitHub Account Compromise
- Standard credential theft, phishing, session hijacking
- Mitigated by: GitHub's security model (2FA, etc.)

#### Path 2: OIDC Token Theft
- Intercept token between GitHub and Fulcio
- Short-lived, limited scope
- Mitigated by: TLS, token expiration

#### Path 3: Certificate Forgery
- Create certificate with arbitrary SAN
- Blocked by: must chain to Fulcio root

#### Path 4: Namespace Confusion
- Use case variations: `Anthropic` vs `anthropic`
- Use homoglyphs: `anthrop1c` vs `anthropic`
- Partially mitigated by: case-sensitive matching, ASCII-only skill_id

## Temporal Attack Vectors

### Expired Certificate Replay
- Sign with valid cert, replay after expiration
- Blocked by: SET proves signing was during cert validity

### Backdated Signing
- Claim signing happened at an earlier time
- Blocked by: SET is issued by Rekor, not signer

### Clock Skew Exploitation
- Signer's clock differs from Rekor's clock
- `timestamp` field is signer's local clock (informational only)
- `rekor_timestamp` is authoritative

### Long-Lived Signature Staleness
- Valid signature from years ago still accepted
- Mitigated by: `max_age_days` policy

## Review Methodology

### Phase 1: Identify Assets
- Signed content (SKILL.md)
- Signer identity (certificate SAN)
- Trust policy (policy file)
- Transparency log entries

### Phase 2: Identify Entry Points
- SKILL.md file parsing (canonical form)
- Sidecar YAML parsing
- Policy YAML parsing
- CLI arguments and flags
- Network (Fulcio, Rekor, TUF CDN)

### Phase 3: Identify Threats (per entry point)
- What can an attacker control?
- What validation is missing?
- What assumptions are unstated?

### Phase 4: Rate Severity
- **Critical**: Bypass verification entirely
- **High**: Forge identity or weaken policy
- **Medium**: Information disclosure, DoS, edge case exploits
- **Low**: Cosmetic issues, documentation gaps

### Phase 5: Verify Mitigations
- Is each threat addressed in the spec?
- Is the mitigation in the signing spec or deferred to registry/tooling?
- Are deferred mitigations documented as known limitations?
