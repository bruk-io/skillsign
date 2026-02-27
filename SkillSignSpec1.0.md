# SkillSign Specification — v0.1 (Draft)

> A trust and signing standard for Claude Code SKILL.md files

---

## 1. Motivation

Claude Code skills — distributed as `SKILL.md` files — are increasingly being shared via npm, GitHub repositories, and informal channels. These files are not documentation. When loaded by Claude Code, they are executed as instructions with access to the filesystem, shell, network, and any configured tools. The ecosystem currently treats them as inert config files, which is the wrong mental model and an emerging security gap.

The threat model includes:

- **Tampered skills**: a legitimate skill modified after publication to inject malicious instructions
- **Impersonation**: a skill claiming to be from a trusted author or organisation without any verifiable proof
- **Supply chain compromise**: a transitive dependency in an npm skill package that has been taken over
- **Runtime instruction injection**: a skill that pulls remote content at execution time to update its own instructions

This specification defines a signing and verification standard for SKILL.md files that establishes authorship, integrity, and a chain of custody — without requiring authors to manage long-lived private keys.

---

## 2. Scope

**In scope for v0.1:**
- Signing and verification of `SKILL.md` files
- GitHub-based identity via OIDC (Sigstore-compatible)
- Detached signature storage via sidecar file
- A canonical serialization format for signing

**Out of scope for v0.1 (reserved for future versions):**
- `CLAUDE.md` agent configs
- MCP server manifests
- Non-GitHub identity providers
- A public registry (specified separately)

---

## 3. Definitions

| Term | Definition |
|------|------------|
| **Artifact** | A `SKILL.md` file intended for distribution and consumption by Claude Code |
| **Signer** | A GitHub user or organization that asserts authorship or endorsement of an artifact |
| **Signature** | A cryptographic assertion that a specific signer produced or endorsed a specific artifact at a specific time |
| **Certificate** | A short-lived X.509 certificate issued by Fulcio (Sigstore's CA) binding a signing key to a GitHub identity |
| **Transparency Log** | An append-only, publicly auditable log (Rekor) recording all signatures |
| **Canonical Form** | The normalized byte representation of a SKILL.md file used as signing input |

---

## 4. Identity and Key Management

SkillSign uses **keyless signing via Sigstore**. Signers never manage long-lived private keys.

### 4.1 Flow

1. The signer authenticates with GitHub via OIDC
2. Sigstore's Fulcio CA issues a short-lived certificate (valid ~10 minutes) binding an ephemeral keypair to the signer's verified GitHub identity
3. The signer uses the ephemeral key to sign the artifact's canonical form
4. The signature and certificate are recorded in Rekor (Sigstore's transparency log)
5. The ephemeral private key is discarded

### 4.2 Identity Claims

The certificate Subject Alternative Name (SAN) encodes the signer's GitHub identity:

- **Individual**: `https://github.com/{username}`
- **GitHub Actions**: `https://github.com/{org}/{repo}/.github/workflows/{workflow}.yml@refs/heads/{branch}`

This means skills can be signed by a human developer or automatically signed in CI, both with verifiable identity.

### 4.3 Revocation

Because certificates are short-lived, traditional revocation is not required. The transparency log provides an audit trail. Consumers can check Rekor directly or rely on a registry that indexes and monitors the log.

---

## 5. Canonical Form

Signatures are computed over a deterministic, normalized representation of the skill file — not raw bytes. This prevents signature breakage from trivial formatting differences (trailing newlines, line endings, editor whitespace) while ensuring meaningful changes invalidate the signature.

### 5.1 Normalization Rules

1. Verify the SKILL.md file does not exceed 1MB (1,048,576 bytes). If the file exceeds this limit, signing and verification MUST fail with exit code `10`. This prevents denial-of-service via oversized input.
2. Parse the SKILL.md file as UTF-8. If the file contains invalid UTF-8 byte sequences, signing MUST fail with exit code `10`.
3. If a UTF-8 BOM (`\xEF\xBB\xBF`) is present at the start of the file, it MUST be stripped before further processing.
4. Normalize line endings: replace all `\r\n` (CRLF) sequences with `\n`, then replace any remaining bare `\r` (CR) with `\n`.
5. Strip trailing whitespace from each line. "Whitespace" for this purpose means ASCII space (`\x20`) and horizontal tab (`\x09`) only. Unicode whitespace characters are not stripped.
6. Strip all trailing `\n` characters from the end of the file, then append exactly one `\n`.
7. Encode as UTF-8 bytes.
8. If the resulting canonical form contains any null byte (`\x00`), signing MUST fail with exit code `10`.

An empty SKILL.md file (zero bytes, or containing only whitespace/newlines) normalizes to a single `\n` byte. This is valid and may be signed.

The canonical form is what is hashed and signed. Because signatures are stored in a detached sidecar file, no stripping or exclusion logic is required — the SKILL.md file is signed exactly as-is after normalization.

### 5.2 Signed Input

The digest is computed over the following exact byte sequence:

```
"skillsign:v1" + \x00 + canonical_bytes + \x00 + skill_id_bytes + \x00 + skill_version_bytes
```

Where:
- `"skillsign:v1"` is a fixed ASCII domain separator (12 bytes), prefixed to prevent cross-protocol confusion and aid future version migration
- `canonical_bytes` is the UTF-8 encoded canonical form of the SKILL.md file (Section 5.1)
- `skill_id_bytes` is the UTF-8 encoded value of the `skill_id` field, trimmed of leading and trailing ASCII whitespace (space `\x20` and horizontal tab `\x09` only, matching Section 5.1 step 5)
- `skill_version_bytes` is the UTF-8 encoded value of the `skill_version` field, trimmed of leading and trailing ASCII whitespace (space `\x20` and horizontal tab `\x09` only, matching Section 5.1 step 5)
- `\x00` is a single null byte separator
- There is no trailing separator after `skill_version_bytes`

SHA-256 is applied to this concatenated byte sequence to produce a 32-byte digest. **The cryptographic signature is computed over the 32-byte SHA-256 digest, not the raw concatenated byte sequence.** This follows Sigstore convention.

The `skill_id` and `skill_version` values MUST NOT contain null bytes (`\x00`). If either field contains a null byte after trimming, signing MUST fail with exit code `10`. Similarly, the canonical form MUST NOT contain null bytes after normalization — if null bytes are present, signing MUST fail with exit code `10`.

`skill_id` is case-sensitive — `github.com/Anthropic/foo` and `github.com/anthropic/foo` produce different digests. However, because GitHub usernames and org names are case-insensitive, signers SHOULD use lowercase for the owner segment to avoid identity confusion. `skill_id` MUST contain only ASCII characters in the range U+0001–U+007F (printable ASCII, null excluded). Non-ASCII characters in `skill_id` are rejected at signing time to prevent Unicode homoglyph attacks.

`skill_id` MUST conform to the format `{host}/{owner}/{name}` with exactly three slash-separated segments. Validation rules:
- Each segment MUST match the pattern `[a-zA-Z0-9._-]+` (one or more alphanumeric, dot, underscore, or hyphen characters)
- No segment may be `..` or `.`
- `host` MUST contain at least one `.` (e.g., `github.com`)
- The total length of `skill_id` MUST NOT exceed 255 characters

Skills with `skill_id` values that fail validation MUST be rejected at signing time with exit code `10`.

This ensures a valid signature for `github.com/org/skill-a` cannot be reused for `github.com/org/skill-b` even if the file contents are identical.

### 5.3 Cryptographic Algorithm

SkillSign v0.1 uses the following fixed algorithm suite, matching Sigstore/Fulcio's current issuance:

- **Key type**: ECDSA P-256 (as issued by Fulcio via the ephemeral keypair)
- **Digest algorithm**: SHA-256
- **Signature input**: the 32-byte SHA-256 digest (see Section 5.2). The ECDSA signature is computed directly over these 32 bytes — implementations MUST NOT re-hash the digest before signing (i.e., use a "prehash" or "raw" signing mode, not a "hash-then-sign" mode that would double-hash).
- **Signature format**: DER-encoded ECDSA signature (`SEQUENCE { INTEGER r, INTEGER s }`) as defined by RFC 3279. This is the default output format of most ECDSA libraries and matches Sigstore/Fulcio convention.
- **Signature encoding**: the DER-encoded signature bytes are encoded as standard Base64 as defined in RFC 4648 §4, with no line breaks.

Algorithm agility is not supported in v0.1. A sidecar with a different algorithm suite MUST be rejected with `MALFORMED_SIDECAR`.

### 5.4 What Is Not Normalized

Content, structure, and ordering of the markdown body are preserved exactly. Only whitespace and line endings are normalized. A change to any instruction, section heading, or code block produces a different digest and invalidates all existing signatures.

---

## 6. Signature Storage

Signatures are stored exclusively in detached sidecar files. The SKILL.md file itself is never modified by the signing process, keeping the artifact clean for model consumption and making git history readable.

### 6.1 Sidecar File

The signature is stored in a file with the `.skillsign` extension, co-located with the skill file:

```
SKILL.md
SKILL.md.skillsign
```

The `.skillsign` file is YAML 1.2. Parsers MUST use YAML 1.2 semantics — notably, bare `yes`/`no`/`on`/`off` are plain strings in YAML 1.2, not booleans. The `certificate` and `signature` values below are truncated for illustration — real values will be significantly longer:

**YAML parsing restrictions**: To prevent parsing ambiguities from being used to bypass verification, parsers MUST:
- Reject files with duplicate keys (fail with `MALFORMED_SIDECAR`)
- Reject YAML anchors and aliases (`&anchor`, `*alias`)
- Reject YAML tags (e.g., `!!str`, `!!map`)
- Reject multi-document streams (files containing `---` document separators after the first document)
- Reject files larger than 64KB

```yaml
version: 1
skill_id: github.com/example-org/python-linter
skill_version: 1.2.0
signer: https://github.com/example-user
timestamp: 2025-03-01T14:22:00Z
digest: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
rekor_log_id: 24296fb24b8ad77ae1e714307e30a6f30d97c06a5de3d58e3e68e0e8c2a1e2f9
rekor_timestamp: 2025-03-01T14:22:03Z
rekor_set: <base64-encoded Rekor Signed Entry Timestamp>
certificate: |
  -----BEGIN CERTIFICATE-----
  MIIBxTCCAWqgAwIBAgIRAK...
  -----END CERTIFICATE-----
certificate_chain: |
  -----BEGIN CERTIFICATE-----
  MIIBxTCCAWqgAwIBAgIRAK... (Fulcio intermediate)
  -----END CERTIFICATE-----
signature: |
  MEQCIBn9...
```

Values above are illustrative. See Section 6.2 for field definitions.

### 6.2 Fields

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | SkillSign format version. Must be `1` for this spec. |
| `skill_id` | Yes | Canonical identifier for this skill. ASCII only, format: `{host}/{owner}/{name}`. Case-sensitive. Exactly 3 slash-separated segments. |
| `skill_version` | Yes | Opaque version string. Non-empty, max 255 chars, printable ASCII only (U+0020–U+007E). Case-sensitive exact match. See Section 6.4. |
| `signer` | Yes | Full HTTPS URL of the GitHub identity from the certificate SAN (e.g., `https://github.com/example-user`). Case-sensitive. Must match SAN exactly. MUST use `https` scheme, MUST have host `github.com`, MUST NOT contain query parameters, fragments, userinfo, or port. MUST NOT exceed 2048 characters. At signing time, the `signer` field MUST be set to the exact SAN bytes from the Fulcio certificate. |
| `timestamp` | Yes | ISO 8601 UTC timestamp of signing operation with mandatory `Z` suffix: `YYYY-MM-DDTHH:MM:SS[.fff]Z`. Fractional seconds MAY be present. Sourced from the signer's local system clock. Informational only — not used for policy evaluation (see `rekor_timestamp`). |
| `digest` | Yes | SHA-256 digest of the signed input (as defined in Section 5.2), prefixed with `sha256:`. Hex characters MUST be lowercase. |
| `rekor_log_id` | Yes | Rekor transparency log entry UUID: a lowercase hex string of exactly 64 characters, as returned by the Rekor `/api/v1/log/entries` endpoint. |
| `rekor_timestamp` | Yes | Authoritative tamper-evident timestamp from Rekor, in ISO 8601 UTC format with mandatory `Z` suffix: `YYYY-MM-DDTHH:MM:SS[.fff]Z`. Fractional seconds MAY be present. Used for `max_age_days` policy evaluation (evaluated as: current UTC time minus `rekor_timestamp` <= `max_age_days` * 86400 seconds, no clock skew tolerance). Not self-asserted. |
| `rekor_set` | Yes | Rekor Signed Entry Timestamp (SET), encoded as standard Base64 (RFC 4648 §4) with no line breaks. Used in default and offline modes to verify that the signing occurred within the certificate's validity window without a live Rekor query. The SET is a cryptographically signed timestamp structure issued by Rekor at log entry time, verifiable against Rekor's public key distributed via TUF. |
| `certificate` | Yes | PEM-encoded short-lived leaf certificate issued by Fulcio |
| `certificate_chain` | No | PEM-encoded Fulcio intermediate certificate(s). If absent, the verifier must fetch the chain from the TUF root. Recommended for offline verification. |
| `signature` | Yes | ECDSA P-256 signature over the SHA-256 digest, encoded as standard Base64 (RFC 4648 §4) with no line breaks |

### 6.3 skill_id Format

The `skill_id` is a stable, globally unique identifier for a skill that is independent of where the file lives on disk. It must be included in the signed payload (the digest is computed over canonical form + skill_id + skill_version as a concatenated input — see Section 5.2) to prevent substitution attacks where a valid signature for one skill is served under a different skill's name.

```
skill_id format: {host}/{owner}/{name}
examples:
  github.com/anthropic/python-linter
  github.com/my-org/sql-reviewer
```

### 6.4 skill_version Format

`skill_version` is an opaque string. No specific versioning scheme is enforced by SkillSign — authors may use semver (`1.2.0`), calver (`2025.03.01`), build hashes, or any other convention. The value is treated as an exact string for the purposes of the signed digest; two version strings are equal only if they are byte-for-byte identical. Consumers should not attempt to parse or compare version strings for ordering.

**Validation rules**: `skill_version` MUST be a non-empty UTF-8 string after trimming leading and trailing whitespace. It MUST NOT exceed 255 characters. It MUST contain only printable ASCII characters (U+0020–U+007E). Null bytes (`\x00`), newlines, and control characters are not permitted. An empty or invalid `skill_version` MUST be rejected at signing time with exit code `10`.

---

## 7. Signing Protocol

### 7.1 Prerequisites

- A GitHub account
- The `skillsign` CLI (see Section 9)
- A `skillsign.yaml` manifest in the same directory as the SKILL.md file (see Section 7.3)

### 7.2 Steps

```bash
# Authenticate with GitHub (opens browser for OIDC flow)
skillsign auth login

# Sign a skill file (reads skill_id and skill_version from skillsign.yaml)
skillsign sign ./SKILL.md
```

### 7.2.1 Signing Algorithm

1. Read the `skillsign.yaml` manifest from the same directory as the SKILL.md file. Parse it with the YAML restrictions defined in Section 7.3. Fail with exit code `10` if the manifest is missing or invalid.
2. Extract `skill_id` and `skill_version` from the manifest. Validate `skill_id` per Section 5.2 format rules. Validate `skill_version` per Section 6.4 constraints. Fail with exit code `10` if either field is invalid.
3. If a sidecar already exists for the current `skill_id` and `skill_version` and `--force` was not passed, fail with exit code `10`.
4. Compute the canonical form of the SKILL.md file (Section 5.1). This includes the file size check (step 1 of Section 5.1).
5. Compute the SHA-256 digest over the signed input byte sequence (Section 5.2).
6. Authenticate with GitHub via OIDC. Obtain an OIDC identity token. Fail with exit code `10` if authentication fails.
7. Submit the OIDC token to Fulcio to obtain a short-lived certificate binding an ephemeral keypair to the signer's GitHub identity. Fail with exit code `10` if certificate issuance fails.
8. Sign the 32-byte SHA-256 digest from step 5 using the ephemeral private key (ECDSA P-256). The signature is computed directly over the digest bytes without re-hashing (see Section 5.3).
9. Submit the signature, certificate, and digest to Rekor as a `hashedrekord/v0.0.1` entry. Fail with exit code `10` if Rekor submission fails. The sidecar MUST NOT be written until Rekor confirms the log entry.
10. Assemble the sidecar file with all fields defined in Section 6.2. The `signer` field MUST be set to the exact SAN value from the Fulcio certificate. The `rekor_log_id`, `rekor_timestamp`, and `rekor_set` fields MUST be populated from the Rekor response.
11. Write the sidecar to `<filename>.md.skillsign`. Discard the ephemeral private key.

### 7.3 Skill Manifest

The `skillsign.yaml` manifest declares the stable identity of the skill. It must be present in the same directory as the SKILL.md file and is read by the CLI at signing time to populate `skill_id` and `skill_version` in the sidecar.

```yaml
# skillsign.yaml
skill_id: github.com/example-org/python-linter
skill_version: 1.2.0
```

`skill_version` is an opaque string — any versioning convention is acceptable (see Section 6.4). Authors must update `skill_version` before each re-signing to distinguish releases.

**YAML parsing restrictions**: The `skillsign.yaml` manifest MUST be parsed with the same YAML restrictions as the sidecar file (Section 6.1): no duplicate keys, no anchors/aliases, no tags, no multi-document streams, and a maximum file size of 64KB. Violations MUST cause signing to fail with exit code `10`.

The manifest is not signed itself — only the SKILL.md content and the identity fields extracted from the manifest are included in the signed digest. The sidecar is the authoritative record of what was signed; the manifest is just the input source for `skill_id` and `skill_version` at signing time. Modifying the manifest after signing does not invalidate the existing sidecar, but running `skillsign sign` again with updated manifest values will produce a new sidecar with a different digest. Authors must keep `skill_version` updated before each re-signing.

If a sidecar already exists for the current `skill_id` and `skill_version`, the CLI will exit with code `10` and require an explicit `--force` flag to overwrite. This prevents accidental re-signing of the same version with a different key, which would produce a confusingly different but valid sidecar.

### 7.4 Signing Output

On success, the CLI outputs:

```
✓ Signed by: github.com/example-user
✓ Skill: github.com/example-org/python-linter@1.2.0
✓ Certificate issued: 2025-03-01T14:22:00Z (expires 2025-03-01T14:32:00Z)
✓ Rekor log entry: https://rekor.sigstore.dev/api/v1/log/entries/24296fb2...
✓ Signature written to: SKILL.md.skillsign
```

---

## 8. Verification Protocol

### 8.1 Steps

```bash
# Verify a skill file
skillsign verify ./SKILL.md

# Verify with policy (only accept skills signed by a specific GitHub org)
skillsign verify --signer-org my-org ./SKILL.md

# Verify in strict mode (require Rekor log confirmation, not just the certificate in the sidecar)
skillsign verify --strict ./SKILL.md
```

### 8.2 Verification Algorithm

1. Locate the sidecar file (`<filename>.md.skillsign`) adjacent to the SKILL.md file
2. Parse the sidecar as YAML 1.2 with the restrictions defined in Section 6.1. Fail with `MALFORMED_SIDECAR` if parsing fails, required fields are missing, or `version` is not `1`. A CLI encountering an unknown `version` value MUST fail with `MALFORMED_SIDECAR` and MUST NOT attempt partial verification.
3. Compute the canonical form of the SKILL.md file (Section 5.1)
4. Compute SHA-256 digest over the signed input byte sequence (Section 5.2)
5. Verify digest matches the `digest` field in the sidecar (lowercase hex comparison)
6. Verify the cryptographic signature (ECDSA P-256) against the certificate's public key, over the freshly-computed 32-byte SHA-256 digest from step 4 (not the `digest` field from the sidecar)
7. Verify the certificate was issued by Fulcio by validating its chain against the pinned Sigstore TUF root. The CLI bundles the Sigstore TUF root metadata and uses it to fetch the current trusted Fulcio root certificate, following the [Sigstore TUF repository](https://tuf-repo-cdn.sigstore.dev). This handles root key rotations without requiring CLI updates. In `--offline` mode, the CLI skips the TUF network fetch and falls back to its bundled TUF root metadata and Fulcio root certificate. This means offline verification may not reflect recent Sigstore root key rotations.
8. Verify the certificate's SAN matches the `signer` field in the sidecar. Matching is case-sensitive and exact. Additionally, verify the certificate contains the Extended Key Usage (EKU) extension `id-kp-codeSigning` (OID 1.3.6.1.5.5.7.3.3), which is present in Fulcio-issued certificates. Fail with `INVALID_CERT` if the EKU is absent.
9. **Verify certificate temporal validity**: First, verify the cryptographic signature of the `rekor_set` field (the Rekor Signed Entry Timestamp) against Rekor's public key, obtained via the Sigstore TUF root (or the bundled copy in `--offline` mode). If the SET signature is invalid, fail with `INVALID_CERT`. Then confirm the SET's embedded timestamp falls within the certificate's `notBefore`/`notAfter` window. The SET proves the signing occurred during the certificate's validity period without requiring a live Rekor query, and is valid in both default and `--offline` modes. In `--strict` mode, additionally confirm via live Rekor query that `rekor_log_id` exists and its `rekor_timestamp` falls within the certificate window.
10. In `--strict` mode: confirm the `rekor_log_id` exists in Rekor as a `hashedrekord/v0.0.1` entry and the entry's digest matches the `digest` field in the sidecar
11. Perform owner-path consistency check: compare the `skill_id` owner path against the `signer` owner path using the `SKILL_ID_MISMATCH` algorithm (Section 8.3). By default, a mismatch is a hard failure (exit code `1`). This can be downgraded to a warning via `--allow-id-mismatch` or `require_signer_id_match: false` in a policy file.
12. Apply trust policy if provided (Section 10)

**Verification is not mandatory** by default — the CLI exits `UNSIGNED` (code `2`) when no sidecar is present, rather than failing hard. Consumers who require verification MUST enforce it via policy (`default: deny`) or by treating exit code `2` as a failure in their pipelines.

### 8.3 Verification Results

| Result | Meaning |
|--------|---------|
| `VERIFIED` | Signature is valid, signer identity confirmed, content unmodified |
| `TAMPERED` | Digest mismatch — file has been modified after signing |
| `INVALID_CERT` | Certificate cannot be verified against Fulcio root |
| `IDENTITY_MISMATCH` | Certificate SAN does not match claimed signer |
| `UNSIGNED` | No sidecar file found |
| `POLICY_FAIL` | Signature is valid but does not meet caller's trust policy |
| `SKILL_ID_MISMATCH` | Hard failure (exit code `1`) by default: `skill_id` owner path does not match `signer` owner path. The comparison algorithm is: (1) from `skill_id`, extract the first two segments as `{host}/{owner}`; (2) from `signer`, parse as URL, extract `{host}/{first-path-segment}` (percent-decoding the path first); (3) compare case-insensitively after lowercasing both owner segments. This check is always performed during verification (step 11 in Section 8.2), regardless of whether a policy file is provided. It can be downgraded to an advisory warning by passing `--allow-id-mismatch` or by setting `require_signer_id_match: false` in a policy file. |
| `MALFORMED_SIDECAR` | Sidecar file is present but cannot be parsed (invalid YAML, missing required fields, or unknown version value). This is a hard verification failure, not a best-effort parse. A v1 CLI encountering `version: 2` must fail with this result rather than attempt partial verification |

---

## 9. CLI Specification

### 9.1 Commands

| Command | Description |
|---------|-------------|
| `skillsign auth login` | Authenticate with GitHub via OIDC |
| `skillsign auth status` | Show current authentication state |
| `skillsign sign <file>` | Sign a SKILL.md file, writing a sidecar |
| `skillsign verify <file> [<file>...]` | Verify one or more SKILL.md files (glob patterns accepted) against their sidecars |
| `skillsign inspect <file>` | Show signature metadata without verifying |
| `skillsign unsign <file>` | Delete the sidecar file for a given SKILL.md |

**Per-command flags:**

`skillsign sign`:

| Flag | Description |
|------|-------------|
| `--force` | Overwrite an existing sidecar. Without this flag, signing fails with code `10` if a sidecar already exists for the current `skill_id` and `skill_version`. |

`skillsign verify`:

| Flag | Description |
|------|-------------|
| `--strict` | Require live Rekor confirmation of the log entry. Without this flag, verification relies on the `rekor_set` SET for temporal binding. |
| `--policy <file>` | Path to a `.skillsign-policy.yaml` trust policy file to evaluate after cryptographic verification. |
| `--signer-org <org>` | Shorthand for a single-rule policy: only accept skills signed by GitHub Actions workflows in the specified org. Equivalent to a policy with `signer_org: <org>` and `default: deny`. |
| `--policy-digest <sha256:hex>` | Pin the expected SHA-256 digest of the policy file. Before parsing, the CLI computes the policy file's SHA-256 digest and compares it to the provided value. If they do not match, verification fails with exit code `10`. This mitigates the risk of an attacker modifying the unsigned policy file (see Section 11). The digest format is `sha256:` followed by lowercase hex. |
| `--emit-canonical` | After successful verification, output the verified canonical bytes (Section 5.1) to stdout. This enables callers to pipe verified content directly to a loader without a filesystem re-read, mitigating TOCTOU attacks where the file is swapped between verification and use (see Section 11). When this flag is active, all other output (verification status, warnings) is written to stderr. |
| `--allow-id-mismatch` | Downgrade `SKILL_ID_MISMATCH` from a hard failure (exit code `1`) to an advisory warning. By default, the CLI fails when the `skill_id` owner path does not match the `signer` owner path. This flag is for cases where cross-owner signing is intentional (e.g., a third-party auditor signing another org's skill). |

### 9.2 Global Flags

| Flag | Description |
|------|-------------|
| `--format json` | Output machine-readable JSON |
| `--quiet` | Suppress output, use exit codes only |
| `--offline` | Skip Rekor log checks (no network required). When a policy contains `max_age_days`, the CLI will exit with code `10` and an explanatory message, since `max_age_days` requires network access to confirm `rekor_timestamp`. Pass `--offline-age-skip` alongside `--offline` to explicitly acknowledge this degraded check and proceed |
| `--offline-age-skip` | Used alongside `--offline`. Acknowledges that `max_age_days` policy rules cannot be verified without network access and proceeds without evaluating them. Without this flag, `--offline` with a `max_age_days` policy exits with code `10` |

### 9.3 Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success / VERIFIED (all files verified when multiple files provided) |
| `1` | Verification failed (TAMPERED, INVALID_CERT, IDENTITY_MISMATCH, SKILL_ID_MISMATCH, or MALFORMED_SIDECAR on any file) |
| `2` | UNSIGNED — no sidecar file found (only returned when a single file is verified and no policy is active) |
| `3` | POLICY_FAIL — signature valid but trust policy not satisfied |
| `10` | CLI error or precondition failure (bad arguments, file not found, sidecar already exists without `--force`, incompatible flag combinations, etc.) |

**Multi-file verification**: When verifying multiple files (via glob or multiple arguments), the CLI reports per-file results and exits with the highest severity code across all files. Exit code `1` takes precedence over `3`, which takes precedence over `2`, which takes precedence over `0`. This means a single failed file causes the overall exit code to reflect that failure.

**`--offline` + `--strict` conflict**: These flags are mutually exclusive. Using both together exits with code `10` and an explanatory message. `--strict` requires a live Rekor query, which is incompatible with `--offline`.

---

## 10. Trust Policies

Consumers can define trust policies that go beyond binary verified/unverified decisions.

### 10.1 Policy File Format

```yaml
# .skillsign-policy.yaml
version: 1
default: deny  # REQUIRED. "deny" or "allow". Missing default is a parse error — fail closed.
rules:
  - allow:
      signer_org: my-company
  - allow:
      signer: https://github.com/trusted-individual
  - allow:
      signer_org: anthropic
      max_age_days: 90
  - deny:
      signer: https://github.com/untrusted-actor
require_signer_id_match: true
```

**YAML parsing restrictions**: The `.skillsign-policy.yaml` file MUST be parsed with the same YAML restrictions as the sidecar file (Section 6.1): no duplicate keys, no anchors/aliases, no tags, no multi-document streams, and a maximum file size of 64KB. Violations MUST cause policy evaluation to fail with exit code `10`.

**`default` is required.** A policy file missing the `default` field MUST be rejected with exit code `10`. This prevents silent fail-open behaviour from a missing or truncated policy file.

**`version` is required.** A policy file with an unknown or missing `version` MUST be rejected with exit code `10`. A v0.1 CLI MUST NOT attempt to evaluate a policy with `version: 2` or higher.

**Strict field validation**: Unknown top-level fields in the policy file and unknown fields within rule objects MUST be rejected with exit code `10`. This prevents silent typos (e.g., `signer_og` instead of `signer_org`) from being ignored and inadvertently weakening the policy. The recognized top-level fields for `version: 1` are: `version`, `default`, `rules`, and `require_signer_id_match`. The recognized fields within a rule's `allow` or `deny` object are: `signer`, `signer_org`, and `max_age_days`.

**`signer` field format**: The `signer` field in policy rules uses the same full HTTPS URL format as the `signer` field in the sidecar (e.g., `https://github.com/example-user`). Bare paths without the scheme (`github.com/example-user`) are invalid and MUST be rejected at policy parse time with exit code `10`. Matching is case-sensitive and exact against the sidecar's `signer` value.

**Multiple fields in one rule**: When a rule specifies multiple match fields (e.g., `signer_org` and `max_age_days`), all fields MUST match for the rule to apply (AND semantics). There is no OR semantics within a single rule — use multiple rules for OR behaviour.

**Wildcard/glob matching**: Policy `signer` and `signer_org` fields are exact string matches. No wildcard or glob expansion is performed. Prefix matching is not supported. The only partial-match mechanism is `signer_org`, which matches any signer URL whose first path segment equals the specified org value.

`max_age_days` requires that `rekor_timestamp` be independently confirmed — it MUST NOT be evaluated against the self-asserted `rekor_timestamp` field in the sidecar without Rekor verification. When a policy rule contains `max_age_days`, the CLI automatically enables strict Rekor verification for that check, equivalent to `--strict`, regardless of whether `--strict` was explicitly passed. Using `max_age_days` with `--offline` exits with code `10` unless `--offline-age-skip` is also passed. `max_age_days` MUST be a positive integer. A value of `0` or a negative value MUST be rejected at policy parse time with exit code `10`.

### 10.2 signer_org Matching

The `signer_org` policy field matches against the GitHub organization extracted from the `signer` field in the sidecar using the following algorithm:

1. Parse the `signer` value as a URL
2. Percent-decode the path component (to prevent `anthropic%2Ffoo` from bypassing org extraction)
3. Split the decoded path on `/`, discarding empty segments
4. The first non-empty path segment is the owner segment

Matching rules:
- For **individual signers** (SAN format: `https://github.com/{username}`, one path segment): `signer_org` rules CANNOT match. Individual signers must be matched using the `signer` rule with their full URL. This is intentional — `signer_org` is designed for CI/org-level trust, not individuals.
- For **GitHub Actions signers** (SAN format: `https://github.com/{org}/{repo}/.github/workflows/...`, multiple path segments): `signer_org` matches if the extracted first path segment (after lowercase normalization) equals the rule's `signer_org` value.

```yaml
# Matches github.com/anthropic/* Actions signers only, NOT individual users
- allow:
    signer_org: anthropic
```

**Case normalization**: GitHub usernames and org names are case-insensitive on the platform. To prevent case-sensitivity mismatches, implementations MUST lowercase the owner segment during `signer_org` extraction (step 4 above) before comparing against the policy rule value. Policy authors MUST write `signer_org` values in lowercase. A policy rule with an uppercase `signer_org` value (e.g., `signer_org: Anthropic`) MUST be rejected at policy parse time with exit code `10`. The same lowercase normalization applies to `SKILL_ID_MISMATCH` owner-path comparison (Section 8.3, Section 11).

### 10.3 Policy Rule Evaluation Order

Rules are evaluated in the order they appear in the `rules` list. The first matching rule wins. If no rule matches, the `default` action applies. `deny` rules are evaluated alongside `allow` rules in declaration order — a `deny` rule appearing before an `allow` rule will match first.

### 10.4 Known Policy Limitations

`SKILL_ID_MISMATCH` is a hard failure (exit code `1`) by default, regardless of whether a policy file is provided. This ensures that even bare `skillsign verify` calls detect namespace squatting. The check can be downgraded to an advisory warning in two ways: (1) passing `--allow-id-mismatch` on the CLI, or (2) setting `require_signer_id_match: false` in a policy file. `require_signer_id_match` defaults to `true` when not explicitly set. When active, the check is evaluated after all other verification steps and before the `rules` list. A `SKILL_ID_MISMATCH` failure results in exit code `1`, not `3` (POLICY_FAIL).

No `signer_repo` or `signer_ref` fields are supported in v0.1 for granular CI trust (e.g., "only trust signatures from the `main` branch of `org/repo`"). These are deferred to v0.2.

### 10.5 CI Integration

```yaml
# .github/workflows/verify-skills.yml
- name: Verify skills
  run: |
    skillsign verify --policy .skillsign-policy.yaml ./skills/**/*.md --quiet
```

Note: the CLI performs its own glob expansion and does not rely on shell globbing. The pattern `./skills/**/*.md` is evaluated by the CLI using standard doublestar matching, consistent across shells and operating systems. Shell quoting of glob patterns is recommended to prevent the shell from pre-expanding them.

---

## 11. Security Considerations

**Signature freshness**: Certificates are short-lived but signatures are permanent. A signature made with a now-expired certificate is still valid — the certificate was valid at signing time, and Rekor proves this via the `rekor_timestamp`. Consumers who require recent signatures should use `max_age_days` in their policy, evaluated against `rekor_timestamp`.

**Key compromise**: Because keys are ephemeral, compromise of a signing key after the fact is not meaningful — the key no longer exists. Compromise of a GitHub account is the relevant threat, and that's addressed by GitHub's own security model.

**Substitution attacks**: The `skill_id` and `skill_version` are included in the signed digest (Section 5.2), preventing a valid signature for one skill from being reused for another skill with identical content.

**skill_id ownership**: The `skill_id` field is self-asserted by the signer. The signing layer alone cannot prevent a malicious actor at `github.com/bad-actor` from claiming `skill_id: github.com/anthropic/python-linter`. The cryptographic signature guarantees that the file was signed by the claimed GitHub identity — it does not guarantee that the claimed GitHub identity is the legitimate owner of that `skill_id`. Enforcement of `skill_id` ownership is the responsibility of a registry, which can associate skill namespaces with verified owners and reject claims from non-owners. Consumers relying solely on the CLI without a registry should treat `skill_id` as informational and evaluate trust based on the `signer` identity directly.

As a mitigation, the CLI performs an owner-path consistency check at verify time: if the `skill_id` owner path (the `{host}/{owner}` prefix, e.g., `github.com/anthropic`) does not match the signer owner path (e.g., `github.com/random-user`), the CLI fails with `SKILL_ID_MISMATCH` (exit code `1`). This is a hard failure by default — it can be downgraded to a warning via `--allow-id-mismatch` or `require_signer_id_match: false` in a policy file. The CLI cannot determine GitHub org membership, so this heuristic is intentionally conservative.

**Canonical form attacks**: The normalization rules are intentionally minimal to reduce the attack surface. Future versions should consider whether more aggressive canonicalization (e.g., normalizing Unicode) is warranted.

**Offline verification**: In `--offline` mode, Rekor is not consulted. This is weaker than strict mode but still verifies content integrity and certificate validity against the bundled Fulcio root. Note that `max_age_days` policy enforcement is unavailable in offline mode since `rekor_timestamp` cannot be independently confirmed, and bundled TUF root metadata may not reflect recent Sigstore root key rotations.

**Non-strict verification**: In default (non-strict) mode, the `rekor_log_id` and `rekor_timestamp` fields in the sidecar are not independently verified against the Rekor transparency log. The cryptographic signature and Fulcio certificate are still fully verified, so signer identity and content integrity are assured. However, without `--strict`, there is no guarantee that the signature was recorded in the public transparency log. Consumers who require a public audit trail should use `--strict` or a policy that enforces it.

**TOCTOU (time-of-check to time-of-use)**: Verification happens at check time, but the file is loaded and executed at a later point. An attacker with write access to the filesystem could swap the SKILL.md between verification and load. This is a general filesystem security concern not specific to SkillSign. Mitigations include verifying immediately before loading (not in a separate pipeline step), running the CLI in a trusted execution environment, and using filesystem integrity tools. SkillSign does not attempt to hold an exclusive lock between verify and load. As a concrete mitigation, the `--emit-canonical` flag (Section 9.1) outputs verified canonical bytes to stdout, enabling callers to pipe verified content directly to the loader without a filesystem re-read: `skillsign verify --emit-canonical ./SKILL.md | loader`.

**Skill composition**: A verified SKILL.md may reference or load other skill files. SkillSign makes no claims about the trust status of transitively loaded skills. Consumers should verify all skills in a composition, not just the entry point. A future version may introduce a composition manifest that extends signing to skill dependency trees.

**Policy file is unsigned**: The `.skillsign-policy.yaml` file is consumed by the verifier but is not itself signed. An attacker with write access to the policy file can weaken or remove trust constraints. Policy files should be stored in version control, treated as security-sensitive configuration, and protected with the same access controls as other security policy artifacts. As a concrete mitigation, the `--policy-digest <sha256:hex>` flag (Section 9.1) allows callers to pin the expected policy file hash. The CLI computes the policy file's SHA-256 digest before parsing and rejects it with exit code `10` if the digest does not match. CI pipelines SHOULD use `--policy-digest` to prevent runtime policy tampering.

---

## 12. Known Limitations and Future Work

The following are acknowledged design gaps that are acceptable for v0.1 and flagged for future revision.

**Exit code granularity**: `MALFORMED_SIDECAR` maps to exit code `1`, the same as cryptographic failures. Scripts cannot distinguish parse failures from cryptographic failures. A future version should introduce a dedicated exit code for structural errors.

**Verification results table mixing concerns**: Section 8.3 mixes result codes, warnings, and error conditions. A future revision should split into "Verification Results" and "Diagnostics."

**Version downgrade attacks (M1)**: There is no mechanism to declare a minimum acceptable signer format version. A registry-level "current version" metadata field is the appropriate solution and is deferred to the registry spec.

**Sidecar rollback (M2)**: An attacker who retains an old valid sidecar for a skill can serve it alongside the current SKILL.md. There is no mechanism in v0.1 to supersede or invalidate old sidecars short of revoking the signer's GitHub account. The registry can address this by publishing a canonical "latest sidecar" and rejecting older ones.

**Signer pinning / TOFU (M3)**: There is no trust-on-first-use mechanism. Consumers who want to pin a specific signer for a skill must express this via policy. Automated TOFU is deferred to a future version.

**npm distribution (M4)**: Skills distributed via npm have no verify-before-load requirement enforced by SkillSign. Tool integrations (Claude Code, etc.) are responsible for invoking verification before loading. This spec does not mandate enforcement points.

**GitHub account rename and transfer (M5)**: If a GitHub account is renamed or transferred, historical signatures remain valid (they reference the identity at signing time), but the identity claim may no longer point to the original author. The `rekor_timestamp` bounds the signing event, which partially mitigates this.

**ASCII lookalike homoglyphs (M11)**: The ASCII-only restriction on `skill_id` prevents Unicode homoglyphs but does not prevent ASCII lookalikes (e.g., `l` vs `1`, `O` vs `0`). This is an inherent limitation of any text-based namespace.

**Unicode normalization in content (M12)**: SKILL.md content is signed as-is after whitespace normalization. If the same logical content is represented in different Unicode normalization forms (NFC vs NFD), the digests will differ. Authors and tooling should use consistent Unicode normalization. NFC normalization as a preprocessing step is under consideration for v0.2.


## 13. Versioning

This document is v0.1. The `version: 1` field in signature blocks refers to the SkillSign signature format version, not the spec document version. Breaking changes to the signature format will increment the format version.

**Forward compatibility note**: The sidecar format in v0.1 supports exactly one signature per file. Future format versions (v2+) may extend the `signature` and `certificate` fields to support co-signing (e.g., author + CI pipeline). Implementations should not make assumptions that preclude this extension. A planned v0.2 change will introduce a `signatures` array to support these workflows.

---

## Appendix A: Why Not PGP/GPG?

PGP is the obvious prior art but has well-documented usability failures. Key distribution requires a web of trust or keyserver infrastructure. Key revocation is unreliable. Expired keys cause confusion. The burden on signers to manage long-lived private keys results in poor key hygiene in practice. Sigstore's keyless model solves all of these by tying identity to an existing, well-maintained IdP (GitHub) and eliminating long-lived keys entirely.

## Appendix B: Relationship to Sigstore

SkillSign is not a fork of Sigstore — it uses Sigstore's public infrastructure (Fulcio CA, Rekor log) as its trust backbone. The SkillSign-specific contribution is the canonical form definition, the detached sidecar signature format, and the skill-specific CLI and tooling. This means SkillSign signatures can be independently verified by anyone using raw Sigstore tooling, and the transparency log is not controlled by SkillSign.

---

*SkillSign is an open specification. Feedback and contributions welcome.*