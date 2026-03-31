"""Integration test configuration.

Applies pytest.mark.integration to all tests in this directory.
Provides shared fixtures for file I/O based verification tests.
"""

import base64
import datetime
from pathlib import Path
from typing import Any

import pytest
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.ec import ECDSA
from cryptography.hazmat.primitives.asymmetric.utils import Prehashed
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.serialization import Encoding

from skillsign.canonical import canonicalize
from skillsign.digest import compute_digest
from tests.conftest import make_test_cert, write_sidecar_yaml

pytestmark = pytest.mark.integration

SKILL_ID = "github.com/test-org/my-skill"
SKILL_VERSION = "1.0.0"
SIGNER_URL = "https://github.com/test-org/repo"
VALID_REKOR_TS = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
SIGNER_EMAIL = "testuser@gmail.com"


def make_sidecar(
    skill_content: bytes,
    *,
    skill_id: str = SKILL_ID,
    skill_version: str = SKILL_VERSION,
    signer_url: str = SIGNER_URL,
    include_code_signing_eku: bool = True,
    corrupt_signature: bool = False,
    override_signer_in_sidecar: str | None = None,
    rekor_timestamp: str = VALID_REKOR_TS,
) -> tuple[dict[str, Any], ec.EllipticCurvePrivateKey]:
    """Build a valid sidecar dict for the given skill content."""
    cert, key = make_test_cert(
        san_uri=signer_url or None,
        include_code_signing_eku=include_code_signing_eku,
    )
    cert_pem = cert.public_bytes(Encoding.PEM).decode()

    canonical_bytes = canonicalize(skill_content)
    digest_bytes = compute_digest(canonical_bytes, skill_id, skill_version)
    digest_hex = f"sha256:{digest_bytes.hex()}"

    if corrupt_signature:
        sig_bytes = b"\x00" * 64
    else:
        sig_bytes = key.sign(digest_bytes, ECDSA(Prehashed(SHA256())))
    sig_b64 = base64.b64encode(sig_bytes).decode()

    if override_signer_in_sidecar is not None:
        sidecar_signer = override_signer_in_sidecar
    else:
        sidecar_signer = signer_url

    sidecar: dict[str, Any] = {
        "version": 1,
        "skill_id": skill_id,
        "skill_version": skill_version,
        "signer": sidecar_signer,
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": digest_hex,
        "rekor_log_id": "a" * 64,
        "rekor_log_index": 12345,
        "rekor_timestamp": rekor_timestamp,
        "rekor_set": base64.b64encode(b"fake-rekor-set-data").decode(),
        "certificate": cert_pem,
        "signature": sig_b64,
    }
    return sidecar, key


def setup_files(
    tmp_path: Path,
    skill_content: bytes = b"# My Skill\n\nDoes stuff.\n",
    **sidecar_kwargs: Any,
) -> tuple[Path, Path]:
    """Write skill file and sidecar to tmp_path. Returns (skill_path, sidecar_path)."""
    skill_path = tmp_path / "SKILL.md"
    skill_path.write_bytes(skill_content)

    sidecar, _ = make_sidecar(skill_content, **sidecar_kwargs)
    sidecar_path = Path(str(skill_path) + ".skillsign")
    write_sidecar_yaml(sidecar, sidecar_path)

    return skill_path, sidecar_path
