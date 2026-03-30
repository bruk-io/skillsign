# SkillSign Roadmap

This roadmap organizes SkillSign development into phases based on what unblocks users at each stage. Each phase maps to a GitHub Milestone with individual issues as deliverables.

Prioritization criteria:
- **Who's blocked without this?** Everyone → P0, some users → P1, edge cases → P2
- **Can we add it later without breaking changes?** If yes, defer
- **What's the blast radius of getting it wrong?** Crypto/identity decisions are hard to change later

---

## Phase 1: MVP — "Can anyone sign and verify a skill?"

**Milestone:** `v0.1-mvp`

The minimum to prove the spec works end-to-end. One signer, one verifier, happy path only.

| # | Deliverable | Notes |
|---|-------------|-------|
| 1 | Project scaffolding (pyproject, CI, test harness) | Python + Click per CLAUDE.md conventions |
| 2 | Canonical form processor (Section 5.1) | BOM strip, line ending normalization, whitespace trim, null byte check, 1MB limit |
| 3 | Signed input digest (Section 5.2) | Domain separator + canonical + skill_id + skill_version → SHA-256 |
| 4 | Manifest reader (Section 7.3) | Strict YAML 1.2 parsing, skill_id/skill_version validation |
| 5 | OIDC auth flow (Section 4.1) | GitHub OIDC → Fulcio certificate → ephemeral keypair |
| 6 | Signing engine (Section 7.2.1) | Full signing algorithm: steps 1-11 |
| 7 | Sidecar writer (Section 6.1-6.2) | Write .skillsign YAML with all required fields |
| 8 | Sidecar reader/parser | Strict YAML parsing, field validation, version check |
| 9 | Verification engine (Section 8.2) | Steps 1-9: sidecar parse, digest, ECDSA, cert chain, SAN, EKU, SET |
| 10 | TUF client | Fetch Sigstore TUF root, Fulcio root certs, Rekor public key |
| 11 | `skillsign sign` command | CLI entry point for signing |
| 12 | `skillsign verify` command | CLI entry point for verification (basic, no policy) |
| 13 | `skillsign auth login` / `auth status` | OIDC authentication commands |
| 14 | Exit codes (Section 9.3) | All 5 exit codes: 0, 1, 2, 3, 10 |
| 15 | Unit + integration test suite | Cover canonical form edge cases, digest computation, sidecar round-trip |

**Exit criteria:** A developer can `skillsign sign ./SKILL.md` and another developer can `skillsign verify ./SKILL.md` — end to end through real Sigstore infrastructure.

---

## Phase 2: Hardening — "Can we trust it?"

**Milestone:** `v0.1-hardening`

Security-critical features and error handling. This is where the spec's defensive requirements land.

| # | Deliverable | Notes |
|---|-------------|-------|
| 16 | SKILL_ID_MISMATCH check (Section 8.3) | Owner-path consistency, percent-decode bypass prevention, `--allow-id-mismatch` |
| 17 | `--strict` mode (Section 8.2 step 10) | Live Rekor confirmation of log entry |
| 18 | Sidecar-exists guard (Section 7.2.1 step 3) | Prevent accidental re-signing, `--force` flag |
| 19 | All error flows with correct exit codes | TAMPERED, INVALID_CERT, IDENTITY_MISMATCH, MALFORMED_SIDECAR, UNSIGNED |
| 20 | `skillsign inspect` command | Show signature metadata without verifying |
| 21 | `skillsign unsign` command | Delete sidecar file |
| 22 | `--format json` output | Machine-readable output for all commands |
| 23 | `--quiet` flag | Suppress output, exit codes only |
| 24 | Multi-file verification | Glob support, per-file results, highest-severity exit code |

**Exit criteria:** All verification result codes from Section 8.3 are exercised by tests. Error paths match the spec exactly.

---

## Phase 3: Adoption — "Can teams use it in CI?"

**Milestone:** `v0.1-adoption`

Policy engine, CI integration, and the features that make SkillSign useful for organizations.

| # | Deliverable | Notes |
|---|-------------|-------|
| 27 | Policy engine (Section 10) | version/default validation, first-match-wins, AND semantics, unknown field rejection |
| 28 | `signer_org` matching (Section 10.2) | Org extraction, lowercase normalization, individual-signer exclusion |
| 29 | `max_age_days` enforcement (Section 10.1) | Auto-enable strict mode, positive integer validation |
| 30 | `--policy` and `--signer-org` flags | CLI entry points for policy evaluation |
| 31 | `--policy-digest` pinning | SHA-256 pre-parse check to prevent policy tampering |
| 32 | `--offline-age-skip` flag | Acknowledge degraded max_age_days check in offline mode |
| 33 | `--emit-canonical` flag (Section 9.1) | TOCTOU mitigation — pipe verified bytes to stdout |
| 34 | `require_signer_id_match` policy field | Configurable SKILL_ID_MISMATCH behavior per policy |
| 35 | GitHub Actions example workflow | `.github/workflows/verify-skills.yml` reference implementation |
| 36 | Distribution: PyPI package | `pip install skillsign` or `uv tool install skillsign` |
| 37 | Distribution: Homebrew tap | `brew install bruk-io/tap/skillsign` |

**Exit criteria:** An org can set up a CI pipeline that verifies all skills on every PR using a policy file.

---

## Phase 4: Ecosystem — "Can the community build on it?"

**Milestone:** `v0.2-planning`

Features from Section 12 (Known Limitations) and Section 13 (Forward Compatibility) that require spec changes.

| # | Deliverable | Spec ref | Notes |
|---|-------------|----------|-------|
| 38 | Co-signing support (signatures array) | Section 13 | Author + CI pipeline dual signatures |
| 39 | Dedicated exit code for structural errors | Section 12 | Separate MALFORMED_SIDECAR from crypto failures |
| 40 | `signer_repo` / `signer_ref` policy fields | Section 10.4 | Granular CI trust (branch/repo pinning) |
| 41 | TOFU / signer pinning (M3) | Section 12 | Trust-on-first-use for recurring skills |
| 42 | NFC Unicode normalization (M12) | Section 12 | Preprocessing step for canonical form |
| 43 | Registry specification | Section 12 M1, M2 | Namespace ownership, sidecar rollback, version downgrade prevention |
| 44 | Claude Code native integration | Section 12 M4 | Verify-before-load enforcement point |
| 45 | Non-GitHub identity providers | Section 2 | Expand beyond GitHub OIDC |

**Exit criteria:** v0.2 spec draft published. Breaking changes (if any) documented with migration path.

---

## Deferred

Descoped from current phases — may be revisited based on user demand:

- **`--offline` mode** — Bundled TUF root fallback, skip Rekor. Limited value while Sigstore is inherently online and no production users exist yet. TUF cache already handles transient network failures. Also defers `--offline` + `--strict` mutual exclusion and `--offline-age-skip`.

## Not Planned

These are explicitly out of scope or deferred indefinitely:

- **PGP/GPG support** — Sigstore keyless model is the deliberate choice (Appendix A)
- **In-band signatures** — Sidecar-only by design (Section 6)
- **Custom CA support** — Fulcio-only for v0.1, keeps the trust model simple
- **Signature revocation** — Short-lived certs make this unnecessary (Section 4.3)

---

## How to Contribute

Each deliverable above maps to a GitHub Issue tagged with its milestone. Pick an unassigned issue, comment that you're working on it, and submit a PR.

Issues are labeled:
- `mvp` / `hardening` / `adoption` / `ecosystem` — phase
- `cli` / `crypto` / `policy` / `infra` — area
- `good-first-issue` — approachable without deep Sigstore knowledge
