"""Unit tests for OIDC auth flow (Section 4.1)."""

from unittest.mock import MagicMock, patch

import pytest

from skillsign.auth import get_identity_token
from skillsign.errors import SkillSignError

# --- Happy path: ambient credential (CI) ---


@patch("skillsign.auth.detect_credential")
@patch("skillsign.auth.IdentityToken")
def test_ambient_credential_detected(
    mock_token_cls: MagicMock,
    mock_detect: MagicMock,
) -> None:
    """When ambient OIDC credential is available, use it directly."""
    mock_detect.return_value = "raw.jwt.token"
    mock_token = MagicMock()
    mock_token_cls.return_value = mock_token

    result = get_identity_token()

    assert result is mock_token
    mock_detect.assert_called_once_with("sigstore")
    mock_token_cls.assert_called_once_with("raw.jwt.token", client_id="sigstore")


@patch("skillsign.auth.detect_credential")
@patch("skillsign.auth.IdentityToken")
def test_ambient_credential_invalid_token(
    mock_token_cls: MagicMock,
    mock_detect: MagicMock,
) -> None:
    """When ambient credential exists but token is invalid, fail."""
    mock_detect.return_value = "bad.jwt.token"
    mock_token_cls.side_effect = ValueError("invalid token")

    with pytest.raises(SkillSignError, match="ambient OIDC") as exc_info:
        get_identity_token()
    assert exc_info.value.exit_code == 10


# --- Happy path: interactive flow ---


@patch("skillsign.auth.detect_credential")
@patch("skillsign.auth.Issuer")
def test_interactive_flow_when_no_ambient(
    mock_issuer_cls: MagicMock,
    mock_detect: MagicMock,
) -> None:
    """When no ambient credential, fall back to interactive browser flow."""
    mock_detect.return_value = None
    mock_issuer = MagicMock()
    mock_issuer_cls.return_value = mock_issuer
    mock_token = MagicMock()
    mock_issuer.identity_token.return_value = mock_token

    result = get_identity_token()

    assert result is mock_token
    mock_issuer_cls.assert_called_once_with("https://oauth2.sigstore.dev/auth")
    mock_issuer.identity_token.assert_called_once_with(client_id="sigstore")


@patch("skillsign.auth.detect_credential")
@patch("skillsign.auth.Issuer")
def test_interactive_flow_when_detect_raises(
    mock_issuer_cls: MagicMock,
    mock_detect: MagicMock,
) -> None:
    """When detect_credential raises (network error), fall back to interactive."""
    mock_detect.side_effect = Exception("network error")
    mock_issuer = MagicMock()
    mock_issuer_cls.return_value = mock_issuer
    mock_token = MagicMock()
    mock_issuer.identity_token.return_value = mock_token

    result = get_identity_token()

    assert result is mock_token


# --- Error paths ---


@patch("skillsign.auth.detect_credential")
@patch("skillsign.auth.Issuer")
def test_issuer_connection_failure(
    mock_issuer_cls: MagicMock,
    mock_detect: MagicMock,
) -> None:
    """When OIDC issuer connection fails, exit code 10."""
    mock_detect.return_value = None
    mock_issuer_cls.side_effect = ConnectionError("cannot reach issuer")

    with pytest.raises(SkillSignError, match="OIDC issuer") as exc_info:
        get_identity_token()
    assert exc_info.value.exit_code == 10


@patch("skillsign.auth.detect_credential")
@patch("skillsign.auth.Issuer")
def test_interactive_auth_failure(
    mock_issuer_cls: MagicMock,
    mock_detect: MagicMock,
) -> None:
    """When interactive OIDC flow fails, exit code 10."""
    mock_detect.return_value = None
    mock_issuer = MagicMock()
    mock_issuer_cls.return_value = mock_issuer
    mock_issuer.identity_token.side_effect = RuntimeError("user cancelled")

    with pytest.raises(SkillSignError, match="authentication failed") as exc_info:
        get_identity_token()
    assert exc_info.value.exit_code == 10
