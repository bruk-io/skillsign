"""Signing engine per Section 7.2.1 of the SkillSign spec.

Orchestrates the 11-step signing algorithm using the Sigstore SDK
for key generation, Fulcio certificate issuance, and Rekor submission.
"""

import base64
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from cryptography import x509
from cryptography.hazmat.primitives.serialization import Encoding
from sigstore.hashes import HashAlgorithm, Hashed  # type: ignore[attr-defined]
from sigstore.sign import (  # type: ignore[attr-defined]
    ClientTrustConfig,
    SigningContext,
)

from skillsign.auth import get_identity_token
from skillsign.canonical import canonicalize
from skillsign.digest import compute_digest
from skillsign.errors import SkillSignError
from skillsign.manifest import read_manifest

_SIDECAR_VERSION = 1


def sign_skill(skill_file: Path, *, force: bool = False) -> dict[str, Any]:
    """Execute the full signing algorithm per Section 7.2.1.

    Returns a dict containing all sidecar fields (Section 6.2).
    Does NOT write the sidecar file — that is the sidecar writer's job.

    When force=False (the default), raises SkillSignError if a sidecar
    already exists (Section 7.2.1 step 3). When force=True, the existing
    sidecar check is skipped and the caller is responsible for overwriting.

    Raises SkillSignError with exit_code=10 on any failure.
    """
    # Step 1: Read and validate manifest
    manifest_path = skill_file.parent / "skillsign.yaml"
    skill_id, skill_version = read_manifest(manifest_path)

    # Step 2: (validation done by read_manifest)

    # Step 3: Check for existing sidecar (skipped when --force is set)
    sidecar_path = Path(str(skill_file) + ".skillsign")
    if not force and sidecar_path.exists():
        raise SkillSignError(
            f"Sidecar already exists: {sidecar_path} (use --force to overwrite)",
            exit_code=10,
        )

    # Step 4: Compute canonical form
    try:
        raw = skill_file.read_bytes()
    except FileNotFoundError as e:
        raise SkillSignError(f"Skill file not found: {skill_file}", exit_code=10) from e
    except OSError as e:
        raise SkillSignError(f"Cannot read skill file: {e}", exit_code=10) from e

    canonical_bytes = canonicalize(raw)

    # Step 5: Compute digest
    digest_bytes = compute_digest(canonical_bytes, skill_id, skill_version)

    # Step 6-7: Authenticate and obtain Fulcio certificate
    identity_token = get_identity_token()

    # Step 8-9: Sign digest and submit to Rekor via Sigstore SDK
    hashed = Hashed(algorithm=HashAlgorithm.SHA2_256, digest=digest_bytes)

    try:
        trust_config = ClientTrustConfig.production()
        ctx = SigningContext.from_trust_config(trust_config)
        with ctx.signer(identity_token) as signer:
            bundle = signer.sign_artifact(hashed)
    except Exception as e:
        raise SkillSignError(f"Signing failed: {e}", exit_code=10) from e

    # Step 10: Assemble sidecar data
    return _assemble_sidecar(
        bundle=bundle,
        skill_id=skill_id,
        skill_version=skill_version,
        digest_bytes=digest_bytes,
    )


def _assemble_sidecar(
    *,
    bundle: Any,
    skill_id: str,
    skill_version: str,
    digest_bytes: bytes,
) -> dict[str, Any]:
    """Extract sidecar fields from a Sigstore Bundle per Section 6.2."""
    cert = bundle.signing_certificate
    log_entry = bundle.log_entry

    # Signature: DER-encoded ECDSA, Base64 with no line breaks
    signature_b64 = base64.b64encode(bundle.signature).decode("ascii")

    # Certificate: PEM-encoded leaf cert
    cert_pem = cert.public_bytes(Encoding.PEM).decode("ascii")

    # Certificate chain: extract from verification material if available
    cert_chain_pem = _extract_cert_chain(bundle)

    # Signer: exact SAN from Fulcio certificate
    signer = _extract_san(cert)

    # Digest: sha256: prefixed lowercase hex
    digest_hex = f"sha256:{digest_bytes.hex()}"

    # Rekor fields from log entry inner object
    inner = log_entry._inner  # noqa: SLF001

    # rekor_log_id: lowercase hex of key_id
    log_id_bytes = base64.b64decode(inner.log_id.key_id)
    rekor_log_id = log_id_bytes.hex()

    # rekor_timestamp: from integrated_time (unix timestamp) to ISO 8601 UTC
    integrated_time = int(inner.integrated_time)
    rekor_timestamp = datetime.fromtimestamp(integrated_time, tz=UTC).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )

    # rekor_set: Signed Entry Timestamp (already base64)
    rekor_set = inner.inclusion_promise.signed_entry_timestamp

    # Signing timestamp: local system clock, informational only
    timestamp = datetime.now(tz=UTC).strftime("%Y-%m-%dT%H:%M:%SZ")

    sidecar: dict[str, Any] = {
        "version": _SIDECAR_VERSION,
        "skill_id": skill_id,
        "skill_version": skill_version,
        "signer": signer,
        "timestamp": timestamp,
        "digest": digest_hex,
        "rekor_log_id": rekor_log_id,
        "rekor_timestamp": rekor_timestamp,
        "rekor_set": rekor_set,
        "certificate": cert_pem,
        "signature": signature_b64,
    }

    if cert_chain_pem:
        sidecar["certificate_chain"] = cert_chain_pem

    return sidecar


def _extract_san(cert: x509.Certificate) -> str:
    """Extract the Subject Alternative Name URI from a Fulcio certificate."""
    try:
        san_ext = cert.extensions.get_extension_for_class(x509.SubjectAlternativeName)
        uris = san_ext.value.get_values_for_type(x509.UniformResourceIdentifier)
        if uris:
            return uris[0]
    except x509.ExtensionNotFound:
        pass

    raise SkillSignError("Certificate does not contain a SAN URI", exit_code=10)


def _extract_cert_chain(bundle: Any) -> str | None:
    """Extract the certificate chain PEM from the bundle, if available."""
    try:
        vm = bundle._inner.verification_material  # noqa: SLF001
        if vm.certificate and vm.certificate.raw_bytes:
            # Single cert, no chain
            return None
        if vm.x509_certificate_chain and vm.x509_certificate_chain.certificates:
            certs = vm.x509_certificate_chain.certificates
            # Skip the first cert (leaf), concatenate intermediates
            if len(certs) > 1:
                chain_pem = ""
                for cert_entry in certs[1:]:
                    cert = x509.load_der_x509_certificate(cert_entry.raw_bytes)
                    chain_pem += cert.public_bytes(Encoding.PEM).decode("ascii")
                return chain_pem
    except AttributeError, TypeError:
        pass
    return None
