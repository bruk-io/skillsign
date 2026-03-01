"""Rekor transparency log — wraps Sigstore SDK sign_artifact."""

from typing import Any

from sigstore.hashes import HashAlgorithm, Hashed  # type: ignore[attr-defined]


def sign_and_log(signer: Any, digest_bytes: bytes) -> Any:
    """Sign the digest and submit to Rekor.

    Return the Sigstore Bundle containing signature, cert, and log entry.
    """
    hashed = Hashed(algorithm=HashAlgorithm.SHA2_256, digest=digest_bytes)
    return signer.sign_artifact(hashed)
