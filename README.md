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

## What SkillSign Protects Against

- **Tampered skills** — Any modification after signing is detected (digest mismatch)
- **Impersonation** — Signer identity is bound to a Fulcio certificate via GitHub OIDC; forgery fails verification
- **Supply chain risk** — The SKILL.md file itself is signed; tampering with the skill content is detected (does not cover transitive dependencies)

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
