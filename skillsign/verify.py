"""Verification engine per Section 8.2 of the SkillSign spec.

Implements the verification algorithm. Steps 1-6, 7, 8, and 11 are fully
implemented. Step 9 (SET cryptographic verification) is partially implemented:
the temporal window is checked but the SET signature is not cryptographically
verified in default mode.

Step 7 uses the sigstore-python SDK's TrustedRoot (via TUF) and pyOpenSSL
for cert chain validation. Fails closed when TUF is unreachable.

Step 9 limitation: The sidecar stores the SET (rekor_set) but not the
log_index or canonicalized_body needed to reconstruct the RFC-8785 canonical
JSON that Rekor signed. Without these, full SET cryptographic verification
requires a live Rekor query. In default mode, step 9 only verifies that
rekor_timestamp falls within the cert's validity window. The rekor_timestamp
is self-asserted and not cryptographically bound.

In --strict mode (steps 9+10), a live Rekor query confirms:
  - The log entry exists and is hashedrekord/v0.0.1
  - The entry digest matches the sidecar digest
  - The integratedTime falls within the cert's validity window
"""

import base64
import datetime
import json
import logging
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
from OpenSSL.crypto import (
    X509,
    X509Store,
    X509StoreContext,
    X509StoreContextError,
)

from skillsign.canonical import canonicalize
from skillsign.digest import compute_digest
from skillsign.errors import SkillSignError
from skillsign.infra.rekor import query_rekor_entry
from skillsign.infra.tuf import get_trusted_root as _get_trusted_root
from skillsign.sidecar import read_sidecar

_logger = logging.getLogger(__name__)

_PEM_CERT_BEGIN = "-----BEGIN CERTIFICATE-----"
_PEM_CERT_END = "-----END CERTIFICATE-----"


def _split_pem_certs(pem_chain: str) -> list[str]:
    """Split a PEM chain string into individual PEM certificate blocks."""
    certs: list[str] = []
    current: list[str] = []
    in_cert = False
    for line in pem_chain.splitlines():
        if line.strip() == _PEM_CERT_BEGIN:
            in_cert = True
            current = [line]
        elif line.strip() == _PEM_CERT_END and in_cert:
            current.append(line)
            certs.append("\n".join(current) + "\n")
            in_cert = False
            current = []
        elif in_cert:
            current.append(line)
    return certs


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


def _verify_cert_chain(
    cert: x509.Certificate,
    meta: dict[str, Any],
    sidecar: dict[str, Any],
    offline: bool = False,
    trusted_root: Any = None,
) -> tuple[VerificationResult, dict[str, Any]] | None:
    """Verify the leaf certificate chains to the Sigstore Fulcio root (step 7).

    Uses the sigstore-python SDK's TrustedRoot (fetched via TUF) to obtain
    the current Fulcio CA certificates and validates the leaf certificate
    against them using pyOpenSSL's X509StoreContext.

    Returns None if the chain is valid. Returns an INVALID_CERT failure tuple
    on any chain validation error.

    When the Sigstore TUF root is unreachable and offline=False, falls back to
    offline TUF cache. If neither succeeds, returns INVALID_CERT (fail-closed).

    If trusted_root is provided it is used directly, bypassing TUF I/O.
    """
    if trusted_root is None:
        trusted_root = _get_trusted_root(offline=offline)
        if trusted_root is None and not offline:
            # Retry with offline TUF cache
            trusted_root = _get_trusted_root(offline=True)

    if trusted_root is None:
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": (
                    "Cannot verify certificate chain: Sigstore TUF root "
                    "unavailable (both online and offline cache failed)"
                ),
            },
        )

    try:
        fulcio_certs = trusted_root.get_fulcio_certs()
    except Exception as e:
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": f"Cannot retrieve Fulcio certs from TUF root: {e}",
            },
        )

    # Build OpenSSL store with Fulcio CA certs
    store = X509Store()
    for fulcio_cert in fulcio_certs:
        store.add_cert(X509.from_cryptography(fulcio_cert))

    # Set the verification time to the Rekor timestamp — the authoritative
    # time the signature was recorded. This is the correct time for chain
    # validation per spec Section 8.2 step 7. Falls back to not_valid_before
    # if the rekor_timestamp cannot be parsed.
    rekor_ts_iso = sidecar.get("rekor_timestamp", "")
    try:
        ts_str = rekor_ts_iso.rstrip("Z")
        verify_time = datetime.datetime.fromisoformat(ts_str).replace(
            tzinfo=datetime.UTC
        )
    except ValueError, AttributeError:
        verify_time = cert.not_valid_before_utc
    store.set_time(verify_time)

    # Build intermediate cert list from sidecar certificate_chain (B7 fix)
    extra_certs: list[X509] = []
    if chain_pem := sidecar.get("certificate_chain"):
        try:
            for pem_block in _split_pem_certs(chain_pem):
                intermediate = x509.load_pem_x509_certificate(pem_block.encode())
                extra_certs.append(X509.from_cryptography(intermediate))
        except Exception as e:
            _logger.warning("Cannot parse certificate_chain from sidecar: %s", e)

    cert_ossl = X509.from_cryptography(cert)
    store_ctx = X509StoreContext(store, cert_ossl, extra_certs or None)

    try:
        store_ctx.get_verified_chain()
    except X509StoreContextError as e:
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": (
                    f"Certificate chain validation failed against Sigstore "
                    f"Fulcio root: {e}"
                ),
            },
        )

    return None


def _is_timestamp_in_window(
    ts: datetime.datetime,
    not_before: datetime.datetime,
    not_after: datetime.datetime,
) -> bool:
    """Return True if timestamp falls within [not_before, not_after]."""
    return not_before <= ts <= not_after


def _verify_set_temporal_window(
    cert: x509.Certificate,
    rekor_timestamp_iso: str,
    meta: dict[str, Any],
) -> tuple[VerificationResult, dict[str, Any]] | None:
    """Verify Rekor timestamp is within the certificate's validity window (step 9).

    Per spec Section 8.2 step 9: the SET proves the signing occurred during
    the certificate's validity period. In non-strict mode, we verify this
    temporal constraint using the rekor_timestamp from the sidecar.

    Full cryptographic SET signature verification (ECDSA against Rekor public
    key) requires the log_index and canonicalized_body, which are not stored
    in the sidecar. That check is deferred to strict mode (live Rekor query).

    Returns None if the timestamp is within the window. Returns an INVALID_CERT
    failure tuple if the timestamp is outside the certificate's validity window.
    """
    try:
        # Parse ISO 8601 UTC timestamp from sidecar.
        # Spec Section 6.2 requires Z suffix — reject non-UTC offsets.
        if not rekor_timestamp_iso.endswith("Z"):
            return (
                VerificationResult.INVALID_CERT,
                {
                    **meta,
                    "error": (
                        f"rekor_timestamp must use Z suffix, "
                        f"got {rekor_timestamp_iso!r}"
                    ),
                },
            )
        # Python 3.11+ fromisoformat handles Z natively
        rekor_ts = datetime.datetime.fromisoformat(rekor_timestamp_iso)
    except (ValueError, AttributeError) as e:
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": (f"Cannot parse rekor_timestamp {rekor_timestamp_iso!r}: {e}"),
            },
        )

    not_before = cert.not_valid_before_utc
    not_after = cert.not_valid_after_utc

    if not _is_timestamp_in_window(rekor_ts, not_before, not_after):
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": (
                    f"Rekor timestamp {rekor_ts.isoformat()} is outside "
                    f"certificate validity window "
                    f"[{not_before.isoformat()}, {not_after.isoformat()}]"
                ),
            },
        )

    return None


def _verify_strict_rekor(
    cert: x509.Certificate,
    sidecar: dict[str, Any],
    meta: dict[str, Any],
) -> tuple[VerificationResult, dict[str, Any]] | None:
    """Live Rekor verification for --strict mode (spec steps 9+10).

    Queries the Rekor transparency log to confirm:
      - The entry for rekor_log_id exists
      - The entry kind is hashedrekord/v0.0.1
      - The entry body digest matches the sidecar digest
      - The integratedTime falls within the certificate's validity window

    Returns None on success. Returns a failure tuple on any mismatch.
    """
    log_id = sidecar["rekor_log_id"]

    try:
        entry = query_rekor_entry(log_id)
    except Exception as e:
        return (
            VerificationResult.INVALID_CERT,
            {**meta, "error": f"Rekor strict verification failed: {e}"},
        )

    # Decode the body from base64
    body_b64 = entry.get("body", "")
    try:
        body = json.loads(base64.b64decode(body_b64))
    except Exception as e:
        return (
            VerificationResult.INVALID_CERT,
            {**meta, "error": f"Cannot decode Rekor entry body: {e}"},
        )

    # Verify entry kind is hashedrekord/v0.0.1
    kind = body.get("kind", "")
    api_version = body.get("apiVersion", "")
    if kind != "hashedrekord" or api_version != "0.0.1":
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": (
                    f"Rekor entry is {kind}/{api_version}, expected hashedrekord/0.0.1"
                ),
            },
        )

    # Verify digest matches sidecar
    entry_hash = body.get("spec", {}).get("data", {}).get("hash", {})
    entry_algo = entry_hash.get("algorithm", "")
    entry_value = entry_hash.get("value", "")
    expected_digest = sidecar["digest"]  # "sha256:<hex>"
    entry_digest = f"{entry_algo}:{entry_value}"
    if entry_digest != expected_digest:
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": (
                    f"Rekor entry digest {entry_digest!r} does not match "
                    f"sidecar digest {expected_digest!r}"
                ),
            },
        )

    # Verify integratedTime within cert validity window
    integrated_time = entry.get("integratedTime")
    if integrated_time is None:
        return (
            VerificationResult.INVALID_CERT,
            {**meta, "error": "Rekor entry missing integratedTime"},
        )

    try:
        ts_int = int(integrated_time)
        rekor_ts = datetime.datetime.fromtimestamp(ts_int, tz=datetime.UTC)
    except (ValueError, OSError) as e:
        return (
            VerificationResult.INVALID_CERT,
            {**meta, "error": f"Cannot parse Rekor integratedTime: {e}"},
        )

    not_before = cert.not_valid_before_utc
    not_after = cert.not_valid_after_utc

    if not _is_timestamp_in_window(rekor_ts, not_before, not_after):
        return (
            VerificationResult.INVALID_CERT,
            {
                **meta,
                "error": (
                    f"Rekor integratedTime {rekor_ts.isoformat()} is outside "
                    f"certificate validity window "
                    f"[{not_before.isoformat()}, {not_after.isoformat()}]"
                ),
            },
        )

    return None


def _verify_parsed_inputs(
    canonical_bytes: bytes,
    sidecar: dict[str, Any],
    cert: x509.Certificate | None,
    trusted_root: Any,
    offline: bool,
    strict: bool = False,
) -> tuple[VerificationResult, dict[str, Any]]:
    """Pure verification given all pre-read inputs.

    Implements steps 3-11 of Section 8.2. In default mode, all inputs are
    pre-computed and no I/O occurs. In strict mode, step 9 performs a live
    Rekor query (the only network call in this function).

    canonical_bytes: canonicalized skill file content (step 3 output)
    sidecar: validated sidecar dict from read_sidecar()
    cert: parsed leaf certificate, or None to parse from sidecar["certificate"]
    trusted_root: Sigstore TrustedRoot for chain validation, or None
    offline: passed through to _verify_cert_chain fallback logic
    strict: when True, perform live Rekor verification (steps 9+10)
    """
    meta: dict[str, Any] = {
        "signer": sidecar["signer"],
        "skill_id": sidecar["skill_id"],
        "skill_version": sidecar["skill_version"],
    }

    # Step 4: Compute digest
    digest_bytes = compute_digest(
        canonical_bytes, sidecar["skill_id"], sidecar["skill_version"]
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

    # Step 6: Verify ECDSA signature against the certificate's public key.
    if cert is None:
        try:
            cert = x509.load_pem_x509_certificate(sidecar["certificate"].encode())
        except Exception as e:
            return (
                VerificationResult.INVALID_CERT,
                {**meta, "error": f"Cannot parse certificate PEM: {e}"},
            )

    public_key = cert.public_key()

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

    # Step 7: Verify certificate chain.
    chain_result = _verify_cert_chain(
        cert, meta, sidecar, offline=offline, trusted_root=trusted_root
    )
    if chain_result is not None:
        return chain_result

    # Step 8: Verify SAN matches signer field and EKU contains codeSigning
    san_result = _verify_san_and_eku(cert, sidecar["signer"], meta)
    if san_result is not None:
        return san_result

    # Step 9 (+10 in strict mode): Verify Rekor temporal binding.
    if strict:
        strict_result = _verify_strict_rekor(cert, sidecar, meta)
        if strict_result is not None:
            return strict_result
    else:
        set_result = _verify_set_temporal_window(cert, sidecar["rekor_timestamp"], meta)
        if set_result is not None:
            return set_result

    # Step 11: SKILL_ID_MISMATCH owner-path check.
    id_mismatch = _verify_skill_id_owner(sidecar["skill_id"], sidecar["signer"], meta)
    if id_mismatch is not None:
        return id_mismatch

    return (VerificationResult.VERIFIED, meta)


def verify_skill(
    skill_file: Path,
    *,
    offline: bool = False,
    strict: bool = False,
) -> tuple[VerificationResult, dict[str, Any]]:
    """Verify a SKILL.md file against its sidecar per Section 8.2.

    Returns (result_code, metadata_dict). The metadata dict always contains
    whatever fields could be extracted before the failure, and an 'error' key
    if the result is not VERIFIED.

    Steps implemented:
      1. Locate sidecar: <filename>.md.skillsign
      2. Parse sidecar via read_sidecar()
      3. Read skill file and compute canonical form
      4-11. Delegate to _verify_parsed_inputs()

    The offline parameter controls TUF refresh behaviour for step 7.
    The strict parameter enables live Rekor verification (steps 9+10).
    Raises SkillSignError if both offline and strict are True.
    """
    if offline and strict:
        raise SkillSignError(
            "--offline and --strict are mutually exclusive", exit_code=10
        )

    # Step 1: Locate sidecar
    sidecar_path = Path(str(skill_file) + ".skillsign")
    if not sidecar_path.exists():
        return (VerificationResult.UNSIGNED, {})

    # Step 2: Parse sidecar
    try:
        sidecar = read_sidecar(sidecar_path)
    except SkillSignError as e:
        if e.exit_code == 10:
            raise
        return (VerificationResult.MALFORMED_SIDECAR, {"error": str(e)})

    # Step 3: Read skill file and compute canonical form
    try:
        raw = skill_file.read_bytes()
    except OSError as e:
        raise SkillSignError(f"Cannot read skill file: {e}", exit_code=10) from e

    canonical_bytes = canonicalize(raw)

    # Steps 4-11: Verification (strict mode does one Rekor query in step 9).
    trusted_root = _get_trusted_root(offline=offline)
    if trusted_root is None and not offline:
        trusted_root = _get_trusted_root(offline=True)

    return _verify_parsed_inputs(
        canonical_bytes, sidecar, None, trusted_root, offline, strict=strict
    )


def _verify_san_and_eku(
    cert: x509.Certificate,
    expected_signer: str,
    meta: dict[str, Any],
) -> tuple[VerificationResult, dict[str, Any]] | None:
    """Verify the certificate SAN and EKU per Section 8.2 step 8.

    Extracts the SAN from the certificate — tries URI first, then email.
    Compares against the expected signer (case-sensitive exact match).

    Returns None if checks pass. Returns a failure tuple otherwise.
    """
    # Extract SAN: try URI first, then email (RFC822Name)
    cert_san: str | None = None
    try:
        san_ext = cert.extensions.get_extension_for_class(x509.SubjectAlternativeName)
        uris = san_ext.value.get_values_for_type(x509.UniformResourceIdentifier)
        if uris:
            cert_san = uris[0]
        else:
            emails = san_ext.value.get_values_for_type(x509.RFC822Name)
            if emails:
                cert_san = emails[0]
    except x509.ExtensionNotFound:
        pass

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


def _is_email_signer(signer: str) -> bool:
    """Return True if the signer is an email address (not a URL)."""
    return "@" in signer and "://" not in signer


def _verify_skill_id_owner(
    skill_id: str,
    signer: str,
    meta: dict[str, Any],
) -> tuple[VerificationResult, dict[str, Any]] | None:
    """Verify skill_id owner matches signer owner per Section 8.2 step 11.

    Extracts {host}/{owner} from skill_id and {host}/{first-path-segment}
    from signer URL. Compares case-insensitively after percent-decoding
    the signer path to prevent %2F bypass.

    Email signers skip this check — there is no URL to extract an owner
    path from. The policy engine's ``signer`` rule handles email matching.

    Returns None if check passes. Returns SKILL_ID_MISMATCH tuple otherwise.
    """
    # Email signers cannot be owner-path checked (Section 8.3)
    if _is_email_signer(signer):
        return None

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
