"""Unit test configuration — applies pytest.mark.unit to all tests in this directory."""

import base64
import datetime
from typing import Any

import pytest
from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.ec import ECDSA
from cryptography.hazmat.primitives.asymmetric.utils import Prehashed
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.serialization import Encoding

from skillsign.canonical import canonicalize
from skillsign.digest import compute_digest
from tests.conftest import make_test_cert

pytestmark = pytest.mark.unit

SKILL_ID = "github.com/test-org/my-skill"
SKILL_VERSION = "1.0.0"
SIGNER_URL = "https://github.com/test-org/repo"
VALID_REKOR_TS = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def make_sidecar_dict(
    skill_content: bytes,
    *,
    skill_id: str = SKILL_ID,
    skill_version: str = SKILL_VERSION,
    signer: str = SIGNER_URL,
    include_code_signing_eku: bool = True,
    corrupt_signature: bool = False,
    override_signer_in_sidecar: str | None = None,
    rekor_timestamp: str = VALID_REKOR_TS,
) -> tuple[dict[str, Any], ec.EllipticCurvePrivateKey, x509.Certificate]:
    """Build a sidecar dict and cert for _verify_parsed_inputs tests. No I/O."""
    san_uri = signer if signer and "://" in signer else None
    san_email = signer if signer and "@" in signer and "://" not in signer else None
    cert, key = make_test_cert(
        san_uri=san_uri,
        san_email=san_email,
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

    effective_signer = (
        override_signer_in_sidecar if override_signer_in_sidecar is not None else signer
    )

    sidecar: dict[str, Any] = {
        "version": 1,
        "skill_id": skill_id,
        "skill_version": skill_version,
        "signer": effective_signer,
        "timestamp": "2026-01-01T00:00:00Z",
        "digest": digest_hex,
        "rekor_log_id": "a" * 64,
        "rekor_timestamp": rekor_timestamp,
        "rekor_set": base64.b64encode(b"fake-rekor-set-data").decode(),
        "certificate": cert_pem,
        "signature": sig_b64,
    }
    return sidecar, key, cert
