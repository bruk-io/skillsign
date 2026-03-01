"""Fulcio certificate issuance — wraps Sigstore SDK signing context."""

from typing import Any

from sigstore.sign import (  # type: ignore[attr-defined]
    ClientTrustConfig,
    SigningContext,
)


def create_signing_context(*, offline: bool = False) -> tuple[Any, Any]:
    """Create a Sigstore signing context and trust config.

    Return (trust_config, signing_context) for use with signer().
    """
    trust_config = ClientTrustConfig.production(offline=offline)
    ctx = SigningContext.from_trust_config(trust_config)
    return trust_config, ctx
