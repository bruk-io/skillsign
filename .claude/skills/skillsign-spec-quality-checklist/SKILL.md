---
name: skillsign-spec-quality-checklist
description: This skill provides a quality checklist for reviewing signing specification documents. Use when checking cross-reference accuracy, terminology consistency, algorithm consistency between signing and verification, error handling coverage, exit code mappings, format specifications, RFC 2119 compliance, implementability, versioning, or common spec anti-patterns. Do NOT use for general document review unrelated to technical specifications.
---

# Specification Quality Checklist

## Internal Consistency

### Cross-Reference Accuracy
- Do section references point to the correct sections?
- When Section A describes behavior, does Section B agree?
- Are field names consistent across all mentions?
- Are format descriptions consistent (e.g., "Base64" vs "base64" vs "standard Base64 (RFC 4648 S4)")?

### Terminology Consistency
- Is each term used the same way throughout?
- Are terms defined in the Definitions section actually used?
- Are there undefined terms used in the spec?
- Do synonyms create confusion (e.g., "sidecar" vs "signature file")?

### Algorithm Consistency
- Does the signing protocol produce what the verification protocol expects?
- Are the same normalization rules applied at sign and verify time?
- Is the digest construction identical in all descriptions?
- Are the same fields marked required in field tables and in prose?

## Completeness

### Error Handling Coverage
- Does every operation specify what happens on failure?
- Are exit codes assigned for all failure modes?
- Can scripts distinguish between different failure types?
- Are error messages specified or left to implementation?

### Edge Cases
- Empty files: what happens?
- Maximum sizes: are limits specified?
- Missing optional fields: what's the behavior?
- Malformed inputs: reject or best-effort?

### Format Specifications
- Is every field's format fully specified (regex, grammar, examples)?
- Are encoding rules explicit (UTF-8, Base64 variant, hex case)?
- Are separator characters documented?
- Are length limits specified?

## Clarity and Precision

### Ambiguous Language
Watch for:
- "should" vs "MUST" vs "may" (RFC 2119 compliance)
- "the digest" without specifying which digest
- "the signature" without specifying what's signed
- "verified" without specifying verification level
- Passive voice hiding the actor ("is validated" - by whom?)

### Implementability
- Can two independent implementers produce interoperable results?
- Are all algorithms specified step-by-step?
- Are all constants and magic values defined?
- Are all byte-level formats explicit?

### Examples
- Do examples match the described format?
- Are examples clearly marked as illustrative vs normative?
- Do examples cover edge cases, not just happy paths?

## Security Specification Quality

### Threat Model Completeness
- Is the threat model explicit about what's in/out of scope?
- Are attacker capabilities specified?
- Are trust boundaries documented?
- Are all deferred security measures noted?

### Verification Completeness
- Are all verification steps numbered and ordered?
- Is the order significant (must step N succeed before step N+1)?
- Are all failure modes mapped to specific results?
- Is there a "catch-all" for unexpected failures?

### Trust Boundary Documentation
- What does the spec itself guarantee?
- What's deferred to registry/tooling/infrastructure?
- Are these boundaries explicitly stated?
- Are assumptions about external systems documented?

## Versioning and Evolution

### Forward Compatibility
- Can old implementations safely reject new formats?
- Is unknown version handling specified (hard fail, not ignore)?
- Are extension points documented?
- Are reserved fields or values noted?

### Migration Path
- How do consumers upgrade from v1 to v2?
- Can v1 and v2 sidecars coexist?
- Is the domain separator versioned?

## Common Spec Anti-Patterns

### 1. Mixing Concerns
- Verification results table mixing errors, warnings, and status codes
- A single section covering both signing and verification
- CLI specification mixed with protocol specification

### 2. Undefined Behavior
- "Parsers may..." without specifying what SkillSign parsers MUST do
- Referencing external specs without specifying which version
- Optional behavior without specifying defaults

### 3. Implicit Knowledge
- Assuming readers know Sigstore internals
- Not explaining why a design choice was made
- Referencing concepts introduced later in the spec

### 4. Over/Under-Specification
- Over: specifying implementation details that should be left to implementers
- Under: leaving security-critical behavior unspecified
- Check: is every MUST/SHOULD/MAY justified?

### 5. Orphaned Definitions
- Terms defined but never used
- Fields described but not appearing in examples
- Exit codes defined but no command produces them

## Review Process

### Pass 1: Read for Understanding
- Can you implement this without asking questions?
- Note every point of confusion

### Pass 2: Cross-Reference Check
- Follow every section reference
- Verify field names match between tables and prose
- Check all forward/backward references

### Pass 3: Edge Case Sweep
- For each operation: what if input is empty? Huge? Malformed?
- For each field: what if missing? Duplicated? Wrong type?
- For each comparison: case-sensitive? Encoding-aware? Null-safe?

### Pass 4: Security Analysis
- For each input: how can an attacker control it?
- For each validation: how can it be bypassed?
- For each trust assertion: what's the root of trust?
