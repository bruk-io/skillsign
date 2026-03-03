# Quick Start

## 1. Create a manifest

Create `skillsign.yaml` in the same directory as your SKILL.md:

```yaml
skill_id: github.com/your-org/your-skill
skill_version: 1.0.0
```

## 2. Authenticate

```bash
skillsign auth login
```

This opens your browser for GitHub OIDC authentication.

## 3. Sign

```bash
skillsign sign ./SKILL.md
```

This creates a `SKILL.md.skillsign` sidecar file containing the signature, certificate, and Rekor log entry.

## 4. Verify

```bash
skillsign verify ./SKILL.md
```

Expected output:

```
✓ Sidecar parsed (version: 1)
✓ Digest verified (sha256:e3b0c4...)
✓ Signature valid (ECDSA P-256)
✓ Certificate chain verified
✓ Identity: https://github.com/your-username
✓ Rekor entry confirmed

VERIFIED — signed by github.com/your-username
```

## Strict mode

For higher assurance, require live Rekor confirmation:

```bash
skillsign verify --strict ./SKILL.md
```

## Trust policies

Enforce organizational trust rules:

```bash
skillsign verify --policy .skillsign-policy.yaml ./SKILL.md
```

## Exit codes

| Code | Meaning | CI Action |
|------|---------|-----------|
| `0`  | VERIFIED | Proceed |
| `1`  | Hard failure (TAMPERED, INVALID_CERT, etc.) | Block |
| `2`  | UNSIGNED (no sidecar) | Decide based on policy |
| `3`  | POLICY_FAIL | Block |
| `10` | CLI error | Investigate |
