"""Verification engine per Section 8.2 of the SkillSign spec.

Implements the verification algorithm. Steps 1-6, 8, and 11 are fully
implemented for the MVP. Steps 7 (cert chain against TUF root) and 9
(SET temporal verification) are stubbed with TODOs — these are Phase 2
hardening items requiring deep Sigstore TUF/Rekor integration.
"""

import base64
from enum import Enum
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

from cryptography import x509
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ec import (
    ECDSA,
    SECP256R1,
    EllipticCurvePublicKey,
)
from cryptography.hazmat.primitives.asymmetric.utils import Prehashed
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.x509.oid import ExtendedKeyUsageOID

from skillsign.canonical import canonicalize
from skillsign.digest import compute_digest
from skillsign.errors import SkillSignError
from skillsign.sidecar import read_sidecar


class VerificationResult(Enum):
    """Verification result codes per Section 8.3 of the spec."""

    VERIFIED = "VERIFIED"
    TAMPERED = "TAMPERED"
    INVALID_CERT = "INVALID_CERT"
    IDENTITY_MISMATCH = "IDENTITY_MISMATCH"
    UNSIGNED = "UNSIGNED"
    POLICY_FAIL = "POLICY_FAIL"
    SKILL_ID_MISMATCH = "SKILL_ID_MISMATCH"
    MALFORMED_SIDECAR = "MALFORMED_SIDECAR"


_EXIT_CODES: dict[VerificationResult, int] = {
    VerificationResult.VERIFIED: 0,
    VerificationResult.TAMPERED: 1,
    VerificationResult.INVALID_CERT: 1,
    VerificationResult.IDENTITY_MISMATCH: 1,
    VerificationResult.UNSIGNED: 2,
    VerificationResult.POLICY_FAIL: 3,
    VerificationResult.SKILL_ID_MISMATCH: 1,
    VerificationResult.MALFORMED_SIDECAR: 1,
}


def exit_code_for(result: VerificationResult) -> int:
    """Return the CLI exit code for a given VerificationResult."""
    return _EXIT_CODES[result]


def verify_skill(skill_file: Path) -> tuple[VerificationResult, dict[str, Any]]:
    """Verify a SKILL.md file against its sidecar per Section 8.2.

    Returns (result_code, metadata_dict). The metadata dict always contains
    whatever fields could be extracted before the failure, and an 'error' key
    if the result is not VERIFIED.

    Steps implemented:
      1. Locate sidecar: <filename>.md.skillsign
      2. Parse sidecar via read_sidecar()
      3. Compute canonical form of skill file
      4. Compute digest (domain-separated SHA-256)
      5. Compare digest against sidecar["digest"]
      6. Verify ECDSA signature against certificate public key
      7. [TODO] Verify certificate chain against Sigstore TUF root (Phase 2)
      8. Verify SAN matches signer field; verify EKU id-kp-codeSigning
      9. [TODO] Verify Rekor SET against Rekor public key (Phase 2)
    """
    # Step 1: Locate sidecar
    sidecar_path = Path(str(skill_file) + ".skillsign")
    if not sidecar_path.exists():
        return (VerificationResult.UNSIGNED, {})

    # Step 2: Parse sidecar
    try:
        sidecar = read_sidecar(sidecar_path)
    except SkillSignError as e:
        if e.exit_code == 10:
            # File not found or I/O error — treat as unsigned
            return (VerificationResult.UNSIGNED, {})
        # exit_code == 1: MALFORMED_SIDECAR
        return (VerificationResult.MALFORMED_SIDECAR, {"error": str(e)})

    # Build base metadata from sidecar fields
    meta: dict[str, Any] = {
        "signer": sidecar["signer"],
        "skill_id": sidecar["skill_id"],
        "skill_version": sidecar["skill_version"],
    }

    # Step 3: Read skill file and compute canonical form
    try:
        raw = skill_file.read_bytes()
    except OSError as e:
        raise SkillSignError(f"Cannot read skill file: {e}", exit_code=10) from e

    try:
        canonical_bytes = canonicalize(raw)
    except SkillSignError as e:
        return (
            VerificationResult.TAMPERED,
            {**meta, "error": f"Canonicalization failed: {e}"},
        )

    # Step 4: Compute digest
    try:
        digest_bytes = compute_digest(
            canonical_bytes, sidecar["skill_id"], sidecar["skill_version"]
        )
    except SkillSignError as e:
        return (
            VerificationResult.TAMPERED,
            {**meta, "error": f"Digest computation failed: {e}"},
        )

    # Step 5: Compare digest against sidecar
    expected_digest = f"sha256:{digest_bytes.hex()}"
    if expected_digest != sidecar["digest"]:
        return (
            VerificationResult.TAMPERED,
            {
                **meta,
                "error": (
                    f"Digest mismatch: computed {expected_digest!r}, "
                    f"sidecar has {sidecar['digest']!r}"
                ),
            },
        )

    # Step 6: Verify ECDSA signature against the certificate's public key
    # Per spec Section 5.3: signature is over the 32-byte digest bytes.
    # We use ECDSA with Prehashed(SHA256) so the library treats our digest_bytes
    # as already-hashed input (no double-hashing).
    try:
        cert = x509.load_pem_x509_certificate(sidecar["certificate"].encode())
    except Exception as e:
        return (
            VerificationResult.INVALID_CERT,
            {**meta, "error": f"Cannot parse certificate PEM: {e}"},
        )

    public_key = cert.public_key()

    # Verify key is ECDSA P-256 per spec Section 5.3 (no algorithm agility in v0.1)
    if not isinstance(public_key, EllipticCurvePublicKey):
        return (
            VerificationResult.INVALID_CERT,
            {**meta, "error": "Certificate key is not ECDSA"},
        )
    if not isinstance(public_key.curve, SECP256R1):
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": (
                    f"Certificate key uses {public_key.curve.name}, expected P-256"
                ),
            },
        )

    sig_bytes = base64.b64decode(sidecar["signature"])

    try:
        public_key.verify(sig_bytes, digest_bytes, ECDSA(Prehashed(SHA256())))
    except InvalidSignature:
        return (
            VerificationResult.TAMPERED,
            {**meta, "error": "ECDSA signature verification failed"},
        )
    except Exception as e:
        return (
            VerificationResult.INVALID_CERT,
            {**meta, "error": f"Signature verification error: {e}"},
        )

    # Step 7: Verify certificate chain against Sigstore TUF root
    # TODO (Phase 2, Section 8.2 step 7): Build the full cert chain from
    # sidecar["certificate"] + sidecar.get("certificate_chain") and verify
    # against the Sigstore TUF root using the sigstore-python SDK's trust
    # config (ClientTrustConfig.production()). This catches revoked or
    # mis-issued certificates that pass ECDSA verification.

    # Step 8: Verify SAN matches signer field and EKU contains codeSigning
    san_result = _verify_san_and_eku(cert, sidecar["signer"], meta)
    if san_result is not None:
        return san_result

    # Step 9: Verify Rekor SET (Signed Entry Timestamp)
    # TODO (Phase 2, Section 8.2 step 9): Decode sidecar["rekor_set"] from Base64,
    # parse the SET protobuf, verify its ECDSA signature against the Rekor public key
    # from the TUF-managed trusted_root.json, and confirm that the SET timestamp
    # falls within the certificate's validity window
    # (not_valid_before..not_valid_after). This provides temporal binding —
    # proving the certificate was valid at signing time.

    # Step 11: SKILL_ID_MISMATCH owner-path check
    # Compare skill_id owner path against signer owner path (case-insensitive).
    # Percent-decode the signer URL path to prevent %2F bypass.
    id_mismatch = _verify_skill_id_owner(sidecar["skill_id"], sidecar["signer"], meta)
    if id_mismatch is not None:
        return id_mismatch

    return (VerificationResult.VERIFIED, meta)


def _verify_san_and_eku(
    cert: x509.Certificate,
    expected_signer: str,
    meta: dict[str, Any],
) -> tuple[VerificationResult, dict[str, Any]] | None:
    """Verify the certificate SAN and EKU per Section 8.2 step 8.

    Returns None if checks pass. Returns a failure tuple otherwise.
    """
    # Extract SAN URI
    try:
        san_ext = cert.extensions.get_extension_for_class(x509.SubjectAlternativeName)
        uris = san_ext.value.get_values_for_type(x509.UniformResourceIdentifier)
        cert_san = uris[0] if uris else None
    except x509.ExtensionNotFound:
        cert_san = None

    # Case-sensitive exact match per spec Section 8.2 step 8
    if cert_san != expected_signer:
        return (
            VerificationResult.IDENTITY_MISMATCH,
            {
                **meta,
                "error": (
                    f"SAN mismatch: certificate has {cert_san!r}, "
                    f"sidecar signer is {expected_signer!r}"
                ),
            },
        )

    # Verify EKU contains id-kp-codeSigning (OID 1.3.6.1.5.5.7.3.3)
    try:
        eku_ext = cert.extensions.get_extension_for_class(x509.ExtendedKeyUsage)
        if ExtendedKeyUsageOID.CODE_SIGNING not in eku_ext.value:
            return (
                VerificationResult.INVALID_CERT,
                {
                    **meta,
                    "error": (
                        "Certificate EKU does not include id-kp-codeSigning "
                        "(OID 1.3.6.1.5.5.7.3.3)"
                    ),
                },
            )
    except x509.ExtensionNotFound:
        _msg = "Certificate does not have an Extended Key Usage extension"
        return (
            VerificationResult.INVALID_CERT,
            {**meta, "error": _msg},
        )

    return None


def _verify_skill_id_owner(
    skill_id: str,
    signer: str,
    meta: dict[str, Any],
) -> tuple[VerificationResult, dict[str, Any]] | None:
    """Verify skill_id owner matches signer owner per Section 8.2 step 11.

    Extracts {host}/{owner} from skill_id and {host}/{first-path-segment}
    from signer URL. Compares case-insensitively after percent-decoding
    the signer path to prevent %2F bypass.

    Returns None if check passes. Returns SKILL_ID_MISMATCH tuple otherwise.
    """
    # Extract owner from skill_id: "{host}/{owner}/{name}"
    id_parts = skill_id.split("/")
    if len(id_parts) < 2:
        return (
            VerificationResult.SKILL_ID_MISMATCH,
            {**meta, "error": f"skill_id {skill_id!r} has fewer than 2 segments"},
        )
    id_host = id_parts[0].lower()
    id_owner = id_parts[1].lower()

    # Extract owner from signer URL: "https://{host}/{first-path-segment}/..."
    try:
        parsed = urlparse(signer)
    except ValueError:
        return (
            VerificationResult.SKILL_ID_MISMATCH,
            {**meta, "error": f"Cannot parse signer URL: {signer!r}"},
        )

    signer_host = (parsed.hostname or "").lower()
    # Percent-decode path before splitting to prevent %2F bypass
    decoded_path = unquote(parsed.path).strip("/")
    path_segments = decoded_path.split("/") if decoded_path else []
    signer_owner = path_segments[0].lower() if path_segments else ""

    if id_host != signer_host or id_owner != signer_owner:
        return (
            VerificationResult.SKILL_ID_MISMATCH,
            {
                **meta,
                "error": (
                    f"Owner mismatch: skill_id owner is {id_host}/{id_owner}, "
                    f"signer owner is {signer_host}/{signer_owner}"
                ),
            },
        )

    return None
