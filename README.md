# SkillSign

Cryptographic signing and verification for Claude Code SKILL.md files using [Sigstore](https://sigstore.dev) keyless signing.

Sign skills with your GitHub identity — no long-lived keys. Verify authorship and integrity before execution. Every signature is recorded in a public transparency log.

## Quick Start

```bash
# Requires Python 3.14+ and uv
git clone https://github.com/bruk-io/skillsign.git
cd skillsign
uv sync

# Authenticate with GitHub
uv run skillsign auth login

# Sign a skill file (opens browser for GitHub OIDC)
uv run skillsign sign ./SKILL.md

# Verify it
uv run skillsign verify ./SKILL.md
```

## What It Does

- **`sign`** — Authenticates via GitHub OIDC, gets a short-lived Fulcio certificate, signs your SKILL.md, records the signature in Rekor, and writes a detached `.skillsign` sidecar
- **`verify`** — Recomputes the file digest, checks the signature, validates the certificate chain, and confirms the signer's identity
- **`auth login`** — Interactive GitHub authentication via Sigstore's OIDC flow
- **`auth status`** — Shows current authentication state

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | VERIFIED |
| 1 | Hard failure (TAMPERED, INVALID_CERT, IDENTITY_MISMATCH, SKILL_ID_MISMATCH, MALFORMED_SIDECAR) |
| 2 | UNSIGNED (no sidecar found) |
| 3 | POLICY_FAIL |
| 10 | CLI/usage error |

## Signing Modes

SkillSign supports two signing paths, each with different identity and trust properties:

### CI Signing (GitHub Actions)

In a GitHub Actions workflow, SkillSign uses **ambient OIDC credentials** — no browser login needed. The Fulcio certificate SAN encodes the full workflow path:

```
https://github.com/{org}/{repo}/.github/workflows/{workflow}.yml@refs/heads/{branch}
```

This ties the signature to a specific repository and workflow, not a person. Anyone with write access to the repo can trigger the workflow and produce a valid signature. The trust boundary is the repository's access controls.

### Interactive Signing (Developer)

When a developer runs `skillsign sign` locally, they authenticate via browser-based OIDC. The certificate SAN encodes their personal identity:

- **GitHub OAuth**: `https://github.com/{username}`
- **Email OAuth (via Dex)**: `user@example.com`

This ties the signature to an individual. Only someone who can authenticate as that GitHub user or email owner can produce the signature. The trust boundary is the person's GitHub account (or email account) security.

### Why This Matters for a Registry

CI signatures prove "this repo produced this artifact" — but repos change hands, maintainers rotate, and workflow files can be modified by anyone with push access. A compromised repo produces legitimate-looking CI signatures.

Developer signatures prove "this person endorsed this artifact." Combined with a future registry that maps `skill_id` to authorized signers, this enables a stronger trust model:

1. A registry entry says "skill `github.com/acme/deploy` may only be signed by `https://github.com/alice`"
2. Even if the repo is compromised, an attacker can't produce a signature that matches the registry's authorized signer
3. Consumers verify both the signature *and* the signer-to-skill binding from the registry

CI signing is convenient for automation. Developer signing is stronger for trust — especially once a registry exists to enforce who is allowed to sign what.

## What SkillSign Protects Against

- **Tampered skills** — Any modification after signing is detected (digest mismatch)
- **Impersonation** — Signer identity is bound to a Fulcio certificate via GitHub OIDC; forgery fails verification
- **Supply chain risk** — The SKILL.md file itself is signed; tampering with the skill content is detected (does not cover transitive dependencies)

## Roadmap

| Phase | Milestone | Status | Summary |
|-------|-----------|--------|---------|
| **1. MVP** | `v0.1-mvp` | **15/15 done** | End-to-end sign and verify through real Sigstore. Canonical form, digest, OIDC auth, signing engine, sidecar read/write, verification engine, TUF client, CLI commands, exit codes, test suite. |
| **2. Hardening** | `v0.1-hardening` | Not started | `--strict` mode, `--offline` mode, `inspect`/`unsign` commands, `--format json`, all error flows with correct exit codes. |
| **3. Adoption** | `v0.1-adoption` | Not started | Policy engine, `signer_org` matching, `max_age_days`, GitHub Actions example workflow, PyPI + Homebrew distribution. |
| **4. Ecosystem** | `v0.2-planning` | Not started | Co-signing, registry specification, Claude Code native integration, non-GitHub identity providers. |

Open work items: [#16](https://github.com/bruk-io/skillsign/issues/16) (QA e2e), [#18](https://github.com/bruk-io/skillsign/issues/18) (SET strict mode), [#20](https://github.com/bruk-io/skillsign/issues/20) (worktree cleanup).

See [`docs/roadmap.md`](docs/roadmap.md) for the full breakdown.

## Requirements

- Python 3.14+
- [uv](https://docs.astral.sh/uv/) for package management
- Internet access (Sigstore infrastructure: Fulcio CA, Rekor transparency log, TUF root)

## Known Limitations

- `inspect` and `unsign` commands are not yet implemented
- No pip install yet — clone + `uv sync` is the current install path
- Signing requires interactive browser-based GitHub authentication (or ambient CI credentials in GitHub Actions)

## Project Structure

```
skillsign/
├── skillsign/          # Python package (flat layout)
│   ├── cli.py          # Click CLI entry point
│   ├── canonical.py    # Canonical form processing
│   ├── digest.py       # SHA-256 digest computation
│   ├── signing.py      # Sigstore signing engine
│   ├── verify.py       # Verification engine
│   ├── sidecar.py      # Sidecar read/write
│   ├── auth.py         # OIDC authentication
│   ├── policy.py       # Trust policy engine
│   └── errors.py       # Error types and exit codes
├── tests/              # Unit, integration, and e2e tests
├── architecture/       # C4 model (LikeC4 DSL)
├── site/               # Product website (Astro + bh-01)
├── docs/               # Developer docs (MkDocs)
└── pyproject.toml
```

## Documentation

- [Specification](docs/spec.md) — v0.1 draft, the source of truth for all behavior
- [Product site](https://bruk-io.github.io/skillsign/) — Overview, how it works, getting started
- [Dev docs](https://bruk-io.github.io/skillsign/docs/) — API reference and developer guides

## License

MIT
