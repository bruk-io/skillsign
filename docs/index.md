# SkillSign

Cryptographic signing and verification for Claude Code SKILL.md files using [Sigstore](https://www.sigstore.dev/) keyless signing.

## What is SkillSign?

Claude Code skills — distributed as `SKILL.md` files — are increasingly being shared via npm, GitHub repositories, and informal channels. These files aren't documentation. When loaded by Claude Code, they execute as instructions with access to the filesystem, shell, network, and any configured tools.

SkillSign establishes **authorship**, **integrity**, and a **chain of custody** for these files — without requiring authors to manage long-lived private keys.

## Quick Start

```bash
# Install
uv tool install skillsign

# Sign a skill (authenticates via GitHub OIDC)
skillsign sign ./SKILL.md

# Verify a skill
skillsign verify ./SKILL.md
```

## How It Works

1. **Sign** — The author authenticates via GitHub OIDC, SkillSign obtains a short-lived certificate from Fulcio, signs the skill's canonical form, and logs the signature to Rekor's transparency log.
2. **Verify** — A consumer checks the signature, certificate chain, identity, and transparency log entry to confirm the skill is authentic and untampered.

The signature is stored in a detached `.skillsign` sidecar file alongside the `SKILL.md`.

## Architecture

Explore the interactive [architecture diagrams](architecture/) built with [LikeC4](https://likec4.dev/).

## Links

- [Specification](spec.md) — The full v0.1 draft specification
- [Roadmap](roadmap.md) — Development phases and deliverables
- [GitHub](https://github.com/bruk-io/skillsign) — Source code
