"""TUF root distribution — wraps Sigstore SDK TrustedRoot."""

import logging
from typing import Any

from sigstore.errors import Error as SigstoreError

_logger = logging.getLogger(__name__)


def get_trusted_root(offline: bool = False) -> Any:
    """Fetch the Sigstore production TrustedRoot via TUF.

    Return a sigstore TrustedRoot instance, or None if unavailable.
    Use offline TUF cache when offline=True.
    """
    try:
        from sigstore.sign import ClientTrustConfig  # type: ignore[attr-defined]

        config = ClientTrustConfig.production(offline=offline)
        return config.trusted_root
    except (SigstoreError, OSError, TimeoutError, ValueError, RuntimeError) as e:
        _logger.warning("Sigstore TUF unavailable: %s", e)
        return None
