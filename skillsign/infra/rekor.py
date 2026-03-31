"""Rekor transparency log queries for strict mode verification."""

import json
import logging
import urllib.request
from typing import Any

from skillsign.errors import SkillSignError

_logger = logging.getLogger(__name__)

_REKOR_BASE_URL = "https://rekor.sigstore.dev"


def query_rekor_entry(log_index: int) -> dict[str, Any]:
    """Fetch a Rekor log entry by its log index.

    Uses the Rekor lookup-by-index API to retrieve the entry.
    Returns the parsed entry dict.

    Raise SkillSignError on network or API failure.
    """
    lookup_url = f"{_REKOR_BASE_URL}/api/v1/log/entries?logIndex={log_index}"

    req = urllib.request.Request(
        lookup_url,
        headers={"Accept": "application/json"},
        method="GET",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            entries = json.loads(resp.read())
    except (urllib.error.URLError, OSError, TimeoutError) as e:
        raise SkillSignError(
            f"Rekor query failed for log_index {log_index}: {e}",
            exit_code=1,
        ) from e
    except (json.JSONDecodeError, ValueError) as e:
        raise SkillSignError(
            f"Rekor returned invalid JSON for log_index {log_index}: {e}",
            exit_code=1,
        ) from e

    # Response is a dict keyed by entry UUID
    if not entries or not isinstance(entries, dict):
        raise SkillSignError(
            f"Rekor returned no entries for log_index {log_index}",
            exit_code=1,
        )

    entry_uuid = next(iter(entries))
    result: dict[str, Any] = entries[entry_uuid]
    return result
