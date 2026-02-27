---
name: skillsign-sigstore-protocol
description: This skill provides domain knowledge about Sigstore keyless signing infrastructure including Fulcio certificate authority, Rekor transparency log, and TUF root distribution. Use when reviewing cryptographic protocols, certificate chain validation, SCT vs SET distinctions, verification modes (default, strict, offline), or common Sigstore integration vulnerabilities. Do NOT use for general cryptography unrelated to Sigstore.
---

# Sigstore Protocol Knowledge

## Core Architecture

Sigstore is a keyless signing infrastructure with three components:

### Fulcio (Certificate Authority)
- Issues short-lived X.509 certificates (~10 min validity)
- Binds ephemeral keypair to OIDC identity (GitHub, Google, etc.)
- Certificate SAN encodes identity:
  - Individual: `https://github.com/{username}`
  - GitHub Actions: `https://github.com/{org}/{repo}/.github/workflows/{workflow}.yml@refs/heads/{branch}`
- Issues ECDSA P-256 keys by default
- Certificate chain: Leaf -> Fulcio Intermediate -> Fulcio Root

### Rekor (Transparency Log)
- Append-only, publicly auditable log
- Records `hashedrekord/v0.0.1` entries
- Issues Signed Entry Timestamps (SET) - signed JWTs proving log inclusion time
- SET proves signing occurred during certificate validity window
- `rekor_timestamp` is the authoritative tamper-evident timestamp

### TUF (The Update Framework)
- Distributes trusted root metadata for Fulcio and Rekor
- Handles root key rotation
- CDN: `tuf-repo-cdn.sigstore.dev`
- Implementations should bundle TUF root and update periodically

## Critical Distinctions

### SCT vs SET
- **SCT (Signed Certificate Timestamp)**: Proves a certificate was logged in Certificate Transparency. Issued by CT log, NOT Rekor.
- **SET (Signed Entry Timestamp)**: Proves a signing event was logged in Rekor. Issued by Rekor at log entry time. This is what proves temporal binding.
- Common mistake: Using SCTs for temporal binding. SCTs prove certificate CT-logging, not signing time.

### Certificate Validity vs Signature Validity
- Certificates expire in ~10 minutes, but signatures are permanent
- A signature made with a now-expired certificate is still valid IF Rekor proves it was made during certificate validity
- The SET timestamp must fall within `notBefore`/`notAfter` window

### Keyless Trust Model
- No long-lived private keys to manage or compromise
- Trust anchored in OIDC identity provider (GitHub)
- Key compromise after signing is meaningless (key destroyed)
- Account compromise is the real threat

## Verification Modes

### Default (non-strict)
- Verify signature + certificate chain against Fulcio root
- Verify SET for temporal binding
- Does NOT query Rekor live
- No guarantee of public audit trail

### Strict
- Everything in default, plus:
- Live Rekor query to confirm log entry exists
- Verify entry digest matches
- Requires network access

### Offline
- Verify signature + certificate against bundled Fulcio root
- Verify SET for temporal binding
- No network access at all
- Bundled TUF root may be stale (won't reflect recent key rotations)
- Cannot evaluate `max_age_days` policies

## Common Vulnerabilities in Sigstore Integrations

1. **Not verifying SET**: Accepting signatures without temporal proof
2. **Self-asserted timestamps**: Trusting sidecar `timestamp` field instead of Rekor SET
3. **Skipping certificate chain validation**: Not validating against Fulcio root
4. **Stale TUF roots**: Not updating bundled root metadata
5. **Algorithm confusion**: Not pinning expected key type / digest algorithm
6. **Incomplete entry verification**: Not checking `hashedrekord` entry type in strict mode
7. **Missing SAN validation**: Not verifying certificate SAN matches claimed identity
