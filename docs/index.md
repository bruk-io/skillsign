# SkillSign Documentation

Cryptographic signing and verification for Claude Code SKILL.md files using Sigstore keyless signing.

## Overview

SkillSign provides a trust and signing standard for Claude Code skills. It establishes authorship, integrity, and a chain of custody for SKILL.md files — without requiring authors to manage long-lived private keys.

**Key features:**

- **Keyless signing** via Sigstore — no private keys to manage
- **GitHub identity** binding via OIDC
- **Transparency logging** via Rekor
- **Detached signatures** — SKILL.md files stay clean
- **Policy engine** for organizational trust decisions
- **CI-friendly** exit codes for pipeline integration

## Quick Links

- [Installation](getting-started/installation.md) — Install the CLI
- [Quick Start](getting-started/quickstart.md) — Sign and verify your first skill
- [Specification](spec.md) — The full v0.1 spec
- [Roadmap](roadmap.md) — What's planned
- [API Reference](api/index.md) — Python API docs
