"""Unit tests for the verification engine — pure functions, no file I/O."""

import base64
import datetime
from typing import Any
from unittest.mock import MagicMock, patch

from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID

from skillsign.canonical import canonicalize
from skillsign.verify import (
    VerificationResult,
    _is_email_signer,
    _reconstruct_hashedrekord_body,
    _verify_cert_chain,
    _verify_parsed_inputs,
    _verify_set_temporal_window,
    exit_code_for,
)
from tests.conftest import make_test_cert
from tests.unit.conftest import (
    SIGNER_URL,
    SKILL_ID,
    SKILL_VERSION,
    VALID_REKOR_TS,
    make_sidecar_dict,
)

_SKIP_CHAIN = patch(
    "skillsign.verify._verify_cert_chain",
    return_value=None,
)


# ---------------------------------------------------------------------------
# Exit code mapping
# ---------------------------------------------------------------------------


def test_exit_code_verified() -> None:
    assert exit_code_for(VerificationResult.VERIFIED) == 0


def test_exit_code_tampered() -> None:
    assert exit_code_for(VerificationResult.TAMPERED) == 1


def test_exit_code_invalid_cert() -> None:
    assert exit_code_for(VerificationResult.INVALID_CERT) == 1


def test_exit_code_identity_mismatch() -> None:
    assert exit_code_for(VerificationResult.IDENTITY_MISMATCH) == 1


def test_exit_code_unsigned() -> None:
    assert exit_code_for(VerificationResult.UNSIGNED) == 2


def test_exit_code_policy_fail() -> None:
    assert exit_code_for(VerificationResult.POLICY_FAIL) == 3


def test_exit_code_skill_id_mismatch() -> None:
    assert exit_code_for(VerificationResult.SKILL_ID_MISMATCH) == 1


def test_exit_code_malformed_sidecar() -> None:
    assert exit_code_for(VerificationResult.MALFORMED_SIDECAR) == 1


# ---------------------------------------------------------------------------
# _reconstruct_hashedrekord_body
# ---------------------------------------------------------------------------


def test_reconstruct_hashedrekord_body_structure() -> None:
    import json

    cert_pem = "-----BEGIN CERTIFICATE-----\nfakedata\n-----END CERTIFICATE-----\n"
    sig_b64 = base64.b64encode(b"\xde\xad\xbe\xef").decode()
    digest_hex = "sha256:" + "ab" * 32

    body_bytes = _reconstruct_hashedrekord_body(cert_pem, sig_b64, digest_hex)
    body = json.loads(body_bytes)

    assert body["kind"] == "hashedrekord"
    assert body["apiVersion"] == "0.0.1"
    assert body["spec"]["data"]["hash"]["algorithm"] == "sha256"
    assert body["spec"]["data"]["hash"]["value"] == "ab" * 32
    assert body["spec"]["signature"]["content"] == sig_b64
    expected_cert_b64 = base64.b64encode(cert_pem.encode("ascii")).decode("ascii")
    assert body["spec"]["signature"]["publicKey"]["content"] == expected_cert_b64


def test_reconstruct_hashedrekord_body_strips_sha256_prefix() -> None:
    import json

    body_bytes = _reconstruct_hashedrekord_body(
        "-----BEGIN CERTIFICATE-----\nAA==\n-----END CERTIFICATE-----\n",
        base64.b64encode(b"sig").decode(),
        "sha256:" + "cc" * 32,
    )
    body = json.loads(body_bytes)
    assert body["spec"]["data"]["hash"]["value"] == "cc" * 32
    assert not body["spec"]["data"]["hash"]["value"].startswith("sha256:")


# ---------------------------------------------------------------------------
# _is_email_signer
# ---------------------------------------------------------------------------


def test_is_email_signer_true_for_email() -> None:
    assert _is_email_signer("user@example.com") is True


def test_is_email_signer_false_for_url() -> None:
    assert _is_email_signer("https://github.com/user") is False


def test_is_email_signer_false_for_url_with_at() -> None:
    assert _is_email_signer("https://user@github.com/repo") is False


# ---------------------------------------------------------------------------
# _verify_set_temporal_window (pure — constructed cert, no file I/O)
# ---------------------------------------------------------------------------


def test_set_temporal_window_timestamp_within_cert_validity() -> None:
    cert, _ = make_test_cert(san_uri=SIGNER_URL)
    meta: dict[str, Any] = {"signer": SIGNER_URL}

    ts = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    result = _verify_set_temporal_window(cert, ts, meta)
    assert result is None


def test_set_temporal_window_timestamp_before_cert_validity() -> None:
    cert, _ = make_test_cert(san_uri=SIGNER_URL)
    meta: dict[str, Any] = {"signer": SIGNER_URL}

    ts_early = (
        datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=2)
    ).strftime("%Y-%m-%dT%H:%M:%SZ")
    result = _verify_set_temporal_window(cert, ts_early, meta)
    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    assert "outside" in result_meta["error"].lower()


def test_set_temporal_window_timestamp_after_cert_expiry() -> None:
    cert, _ = make_test_cert(san_uri=SIGNER_URL)
    meta: dict[str, Any] = {"signer": SIGNER_URL}

    ts_future = (
        datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=2)
    ).strftime("%Y-%m-%dT%H:%M:%SZ")
    result = _verify_set_temporal_window(cert, ts_future, meta)
    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    assert "outside" in result_meta["error"].lower()


def test_set_temporal_window_rejects_non_z_suffix() -> None:
    cert, _ = make_test_cert(san_uri=SIGNER_URL)
    meta: dict[str, Any] = {"signer": SIGNER_URL}

    result = _verify_set_temporal_window(cert, "2025-03-01T14:22:03+05:00", meta)
    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    assert "Z suffix" in result_meta["error"]


def test_set_temporal_window_invalid_timestamp_format() -> None:
    cert, _ = make_test_cert(san_uri=SIGNER_URL)
    meta: dict[str, Any] = {"signer": SIGNER_URL}

    result = _verify_set_temporal_window(cert, "not-a-timestamp", meta)
    assert result is not None
    result_code, _ = result
    assert result_code == VerificationResult.INVALID_CERT


# ---------------------------------------------------------------------------
# _verify_cert_chain (pure — constructed certs, mocked TUF)
# ---------------------------------------------------------------------------


def test_cert_chain_fails_closed_when_tuf_unavailable() -> None:
    cert, _ = make_test_cert(san_uri=SIGNER_URL)
    meta: dict[str, Any] = {"signer": SIGNER_URL}
    sidecar: dict[str, Any] = {"rekor_timestamp": VALID_REKOR_TS}

    with patch("skillsign.verify._get_trusted_root", return_value=None):
        result = _verify_cert_chain(cert, meta, sidecar)
    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    assert "unavailable" in result_meta["error"].lower()


def test_cert_chain_fails_for_self_signed_with_real_tuf() -> None:
    cert, _ = make_test_cert(san_uri=SIGNER_URL)
    fulcio_key = ec.generate_private_key(ec.SECP256R1())

    fulcio_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Fake Fulcio CA")])
    fulcio_cert = (
        x509.CertificateBuilder()
        .subject_name(fulcio_name)
        .issuer_name(fulcio_name)
        .public_key(fulcio_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(
            datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
        )
        .not_valid_after(
            datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        )
        .add_extension(
            x509.BasicConstraints(ca=True, path_length=None),
            critical=True,
        )
        .sign(fulcio_key, SHA256())
    )

    mock_trusted_root = MagicMock()
    mock_trusted_root.get_fulcio_certs.return_value = [fulcio_cert]
    meta: dict[str, Any] = {"signer": SIGNER_URL}

    sidecar: dict[str, Any] = {"rekor_timestamp": VALID_REKOR_TS}
    with patch("skillsign.verify._get_trusted_root", return_value=mock_trusted_root):
        result = _verify_cert_chain(cert, meta, sidecar)

    assert result is not None
    result_code, result_meta = result
    assert result_code == VerificationResult.INVALID_CERT
    err = result_meta["error"].lower()
    assert "chain" in err or "certificate" in err


def test_cert_chain_passes_when_signed_by_fulcio_ca() -> None:
    ca_key = ec.generate_private_key(ec.SECP256R1())
    ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Fake Fulcio CA")])
    ca_cert = (
        x509.CertificateBuilder()
        .subject_name(ca_name)
        .issuer_name(ca_name)
        .public_key(ca_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(
            datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=2)
        )
        .not_valid_after(
            datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=24)
        )
        .add_extension(
            x509.BasicConstraints(ca=True, path_length=None),
            critical=True,
        )
        .add_extension(
            x509.KeyUsage(
                digital_signature=True,
                key_cert_sign=True,
                crl_sign=True,
                content_commitment=False,
                key_encipherment=False,
                data_encipherment=False,
                key_agreement=False,
                encipher_only=False,
                decipher_only=False,
            ),
            critical=True,
        )
        .add_extension(
            x509.SubjectKeyIdentifier.from_public_key(ca_key.public_key()),
            critical=False,
        )
        .sign(ca_key, SHA256())
    )

    leaf_key = ec.generate_private_key(ec.SECP256R1())
    leaf_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Leaf Cert")])
    leaf_cert = (
        x509.CertificateBuilder()
        .subject_name(leaf_name)
        .issuer_name(ca_name)
        .public_key(leaf_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(
            datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
        )
        .not_valid_after(
            datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        )
        .add_extension(
            x509.SubjectAlternativeName([x509.UniformResourceIdentifier(SIGNER_URL)]),
            critical=False,
        )
        .add_extension(
            x509.ExtendedKeyUsage([ExtendedKeyUsageOID.CODE_SIGNING]),
            critical=False,
        )
        .add_extension(
            x509.SubjectKeyIdentifier.from_public_key(leaf_key.public_key()),
            critical=False,
        )
        .add_extension(
            x509.AuthorityKeyIdentifier.from_issuer_public_key(ca_key.public_key()),
            critical=False,
        )
        .sign(ca_key, SHA256())
    )

    mock_trusted_root = MagicMock()
    mock_trusted_root.get_fulcio_certs.return_value = [ca_cert]
    meta: dict[str, Any] = {"signer": SIGNER_URL}

    sidecar: dict[str, Any] = {"rekor_timestamp": VALID_REKOR_TS}
    with patch("skillsign.verify._get_trusted_root", return_value=mock_trusted_root):
        result = _verify_cert_chain(leaf_cert, meta, sidecar)

    assert result is None


# ---------------------------------------------------------------------------
# _verify_parsed_inputs (pure — no file I/O)
# ---------------------------------------------------------------------------


@_SKIP_CHAIN
def test_verify_parsed_inputs_verified_happy_path(mock_chain: MagicMock) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    sidecar, _, cert = make_sidecar_dict(skill_content)
    canonical_bytes = canonicalize(skill_content)

    result, meta = _verify_parsed_inputs(canonical_bytes, sidecar, cert, None, False)
    assert result == VerificationResult.VERIFIED
    assert meta["signer"] == SIGNER_URL
    assert meta["skill_id"] == SKILL_ID
    assert meta["skill_version"] == SKILL_VERSION
    assert "error" not in meta


@_SKIP_CHAIN
def test_verify_parsed_inputs_tampered_digest(mock_chain: MagicMock) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    sidecar, _, cert = make_sidecar_dict(skill_content)
    tampered_bytes = canonicalize(b"# TAMPERED\n")

    result, meta = _verify_parsed_inputs(tampered_bytes, sidecar, cert, None, False)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta


@_SKIP_CHAIN
def test_verify_parsed_inputs_corrupt_signature(mock_chain: MagicMock) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    sidecar, _, cert = make_sidecar_dict(skill_content, corrupt_signature=True)
    canonical_bytes = canonicalize(skill_content)

    result, meta = _verify_parsed_inputs(canonical_bytes, sidecar, cert, None, False)
    assert result == VerificationResult.TAMPERED
    assert "error" in meta


@_SKIP_CHAIN
def test_verify_parsed_inputs_identity_mismatch(mock_chain: MagicMock) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    sidecar, _, cert = make_sidecar_dict(
        skill_content,
        override_signer_in_sidecar="https://github.com/attacker/evil",
    )
    canonical_bytes = canonicalize(skill_content)

    result, meta = _verify_parsed_inputs(canonical_bytes, sidecar, cert, None, False)
    assert result == VerificationResult.IDENTITY_MISMATCH
    assert "error" in meta


@_SKIP_CHAIN
def test_verify_parsed_inputs_missing_eku(mock_chain: MagicMock) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    sidecar, _, cert = make_sidecar_dict(skill_content, include_code_signing_eku=False)
    canonical_bytes = canonicalize(skill_content)

    result, meta = _verify_parsed_inputs(canonical_bytes, sidecar, cert, None, False)
    assert result == VerificationResult.INVALID_CERT
    assert "error" in meta


@_SKIP_CHAIN
def test_verify_parsed_inputs_skill_id_mismatch(mock_chain: MagicMock) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    sidecar, _, cert = make_sidecar_dict(
        skill_content,
        skill_id="github.com/other-org/my-skill",
        signer=SIGNER_URL,
    )
    canonical_bytes = canonicalize(skill_content)

    result, meta = _verify_parsed_inputs(canonical_bytes, sidecar, cert, None, False)
    assert result == VerificationResult.SKILL_ID_MISMATCH
    assert "error" in meta
    assert "mismatch" in meta["error"].lower()


@_SKIP_CHAIN
def test_verify_parsed_inputs_cert_parsed_from_pem_when_none(
    mock_chain: MagicMock,
) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    sidecar, _, _ = make_sidecar_dict(skill_content)
    canonical_bytes = canonicalize(skill_content)

    result, meta = _verify_parsed_inputs(canonical_bytes, sidecar, None, None, False)
    assert result == VerificationResult.VERIFIED


@_SKIP_CHAIN
def test_verify_parsed_inputs_invalid_cert_pem_when_none(
    mock_chain: MagicMock,
) -> None:
    skill_content = b"# My Skill\n\nDoes stuff.\n"
    sidecar, _, _ = make_sidecar_dict(skill_content)
    canonical_bytes = canonicalize(skill_content)

    bad_sidecar = dict(sidecar)
    bad_sidecar["certificate"] = "not-a-valid-pem"

    result, meta = _verify_parsed_inputs(
        canonical_bytes, bad_sidecar, None, None, False
    )
    assert result == VerificationResult.INVALID_CERT
    assert "error" in meta
