"""Rekor transparency log — signing submissions and live queries."""

import json
import logging
import urllib.request
from typing import Any

from sigstore.hashes import HashAlgorithm, Hashed  # type: ignore[attr-defined]

from skillsign.errors import SkillSignError

_logger = logging.getLogger(__name__)

_REKOR_BASE_URL = "https://rekor.sigstore.dev"


def sign_and_log(signer: Any, digest_bytes: bytes) -> Any:
    """Sign the digest and submit to Rekor.

    Return the Sigstore Bundle containing signature, cert, and log entry.
    """
    hashed = Hashed(algorithm=HashAlgorithm.SHA2_256, digest=digest_bytes)
    return signer.sign_artifact(hashed)


def query_rekor_entry(log_id: str) -> dict[str, Any]:
    """Fetch a Rekor log entry by its log ID (hex-encoded).

    The Rekor search API returns entries matching the given logID.
    Returns the parsed entry dict for the first match.

    Raise SkillSignError on network or API failure.
    """
    search_url = f"{_REKOR_BASE_URL}/api/v1/log/entries/retrieve"
    payload = json.dumps({"logIndexes": [], "entryUUIDs": [log_id]}).encode()

    req = urllib.request.Request(
        search_url,
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            entries = json.loads(resp.read())
    except (urllib.error.URLError, OSError, TimeoutError) as e:
        raise SkillSignError(
            f"Rekor query failed for log_id {log_id!r}: {e}", exit_code=1
        ) from e
    except (json.JSONDecodeError, ValueError) as e:
        raise SkillSignError(
            f"Rekor returned invalid JSON for log_id {log_id!r}: {e}", exit_code=1
        ) from e

    if not entries or not isinstance(entries, list):
        raise SkillSignError(
            f"Rekor returned no entries for log_id {log_id!r}", exit_code=1
        )

    # entries is a list of dicts; each dict has one key (the entry UUID) -> entry data
    first = entries[0]
    if not isinstance(first, dict) or not first:
        raise SkillSignError(
            f"Rekor entry has unexpected structure for log_id {log_id!r}", exit_code=1
        )

    # Return the inner entry data (value of the single key)
    entry_uuid = next(iter(first))
    result: dict[str, Any] = first[entry_uuid]
    return result
