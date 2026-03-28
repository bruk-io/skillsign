# Architecture

SkillSign's architecture is modeled using the [C4 methodology](https://c4model.com/) and built with [LikeC4](https://likec4.dev/).

The interactive architecture site is available at [architecture/](architecture/).

## Overview

The model covers four levels:

- **System Context** — Actors (skill author, skill consumer, CI pipeline), the SkillSign system, and external systems (Sigstore, GitHub OIDC, TUF)
- **Containers** — CLI tool, skill files, TUF cache
- **Components** — 9 components inside the CLI (canonical form processor, signing engine, verification engine, policy engine, sidecar manager, manifest reader, TUF client, Rekor client, auth handler)
- **Dynamic Views** — 14 flows covering signing, verification, policy evaluation, and all error paths

## Verification Results

All 8 verification result codes have dedicated dynamic views:

| Result | Exit Code | Meaning |
|--------|-----------|---------|
| `VERIFIED` | 0 | Signature valid, identity confirmed |
| `TAMPERED` | 1 | Content modified after signing |
| `INVALID_CERT` | 1 | Certificate chain or timing failure |
| `IDENTITY_MISMATCH` | 1 | SAN doesn't match expected signer |
| `SKILL_ID_MISMATCH` | 1 | Embedded skill_id doesn't match file path |
| `MALFORMED_SIDECAR` | 1 | Sidecar file is unparseable or missing fields |
| `UNSIGNED` | 2 | No sidecar file found |
| `POLICY_FAIL` | 3 | Signature valid but policy rejects it |
