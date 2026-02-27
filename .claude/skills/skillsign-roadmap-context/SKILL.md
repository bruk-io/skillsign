# SkillSign Roadmap Context

Domain knowledge for managing the SkillSign product roadmap.

## Project Overview

SkillSign is a cryptographic signing and verification system for Claude Code SKILL.md files using Sigstore keyless signing. The spec is at `docs/spec.md` (v0.1 draft).

## Roadmap Structure

The roadmap lives at `docs/roadmap.md` and maps to GitHub Milestones + Issues.

### Phases

1. **v0.1-mvp** (Phase 1): End-to-end sign and verify. 15 deliverables. Exit criteria: one developer signs, another verifies.
2. **v0.1-hardening** (Phase 2): Security, error handling, all verification result codes. 11 deliverables. Exit criteria: all error paths tested.
3. **v0.1-adoption** (Phase 3): Policy engine, CI integration, distribution. 11 deliverables. Exit criteria: org CI pipeline with policy file.
4. **v0.2-planning** (Phase 4): Ecosystem features requiring spec changes. 8 deliverables. Exit criteria: v0.2 spec draft.

### Prioritization Criteria

- **Who's blocked without this?** Everyone = P0, some users = P1, edge cases = P2
- **Can we add it later without breaking changes?** If yes, defer
- **Blast radius of getting it wrong?** Crypto/identity = hard to change, CLI flags = moderate, output format = easy
- **Does the spec already define it?** Section 12 known limitations are pre-triaged

### Issue Labels

- Phase: `mvp`, `hardening`, `adoption`, `ecosystem`
- Area: `cli`, `crypto`, `policy`, `infra`, `docs`
- Effort: `good-first-issue`, `needs-design`, `needs-spec-change`

## Spec Sections → Deliverables Mapping

| Spec Section | Phase | Key Deliverables |
|---|---|---|
| Section 4 (Identity/OIDC) | MVP | Auth flow, Fulcio integration |
| Section 5 (Canonical Form) | MVP | Normalizer, digest computation |
| Section 6 (Sidecar) | MVP | Reader, writer, strict YAML parsing |
| Section 7 (Signing) | MVP | Signing engine, manifest reader |
| Section 8 (Verification) | MVP + Hardening | Verification engine, all result codes, SKILL_ID_MISMATCH |
| Section 9 (CLI) | MVP + Hardening | Commands, flags, exit codes, multi-file |
| Section 10 (Policies) | Adoption | Policy engine, signer_org, max_age_days |
| Section 11 (Security) | Hardening + Adoption | --strict, --offline, --emit-canonical, --policy-digest |
| Section 12 (Limitations) | Ecosystem | Co-signing, TOFU, registry, NFC normalization |

## Known Limitations (from Spec Section 12)

These are pre-triaged by the spec author and deferred to v0.2+:

- M1: Version downgrade attacks → registry-level solution
- M2: Sidecar rollback → registry "latest sidecar" concept
- M3: TOFU / signer pinning → automated trust-on-first-use
- M4: npm distribution → tool integration enforcement points
- M5: GitHub account rename/transfer → timestamp-bounded mitigation
- M11: ASCII lookalike homoglyphs → inherent namespace limitation
- M12: Unicode normalization (NFC/NFD) → v0.2 preprocessing step
