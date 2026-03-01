"""Unit tests for skillsign/infra/tuf.py."""

import sys
from unittest.mock import MagicMock, patch

import pytest
from sigstore.errors import NetworkError, TUFError

from skillsign.infra.tuf import get_trusted_root


def test_get_trusted_root_returns_trusted_root() -> None:
    mock_root = MagicMock()
    mock_config = MagicMock()
    mock_config.trusted_root = mock_root

    mock_sign_module = MagicMock()
    mock_sign_module.ClientTrustConfig.production.return_value = mock_config
    with patch.dict(sys.modules, {"sigstore.sign": mock_sign_module}):
        result = get_trusted_root()
    assert result is mock_root


def test_get_trusted_root_offline_flag_passed() -> None:
    mock_root = MagicMock()
    mock_config = MagicMock()
    mock_config.trusted_root = mock_root

    mock_sign_module = MagicMock()
    mock_sign_module.ClientTrustConfig.production.return_value = mock_config
    with patch.dict(sys.modules, {"sigstore.sign": mock_sign_module}):
        result = get_trusted_root(offline=True)
    assert result is mock_root
    mock_sign_module.ClientTrustConfig.production.assert_called_once_with(offline=True)


def test_get_trusted_root_returns_none_on_tuf_error() -> None:
    mock_sign_module = MagicMock()
    mock_sign_module.ClientTrustConfig.production.side_effect = TUFError("unavailable")
    with patch.dict(sys.modules, {"sigstore.sign": mock_sign_module}):
        result = get_trusted_root()
    assert result is None


def test_get_trusted_root_returns_none_on_network_error() -> None:
    mock_sign_module = MagicMock()
    mock_sign_module.ClientTrustConfig.production.side_effect = NetworkError("timeout")
    with patch.dict(sys.modules, {"sigstore.sign": mock_sign_module}):
        result = get_trusted_root()
    assert result is None


def test_get_trusted_root_returns_none_on_os_error() -> None:
    mock_sign_module = MagicMock()
    mock_sign_module.ClientTrustConfig.production.side_effect = OSError("disk error")
    with patch.dict(sys.modules, {"sigstore.sign": mock_sign_module}):
        result = get_trusted_root()
    assert result is None


def test_get_trusted_root_returns_none_on_timeout_error() -> None:
    mock_sign_module = MagicMock()
    mock_sign_module.ClientTrustConfig.production.side_effect = TimeoutError("timeout")
    with patch.dict(sys.modules, {"sigstore.sign": mock_sign_module}):
        result = get_trusted_root()
    assert result is None


def test_get_trusted_root_propagates_attribute_error() -> None:
    """AttributeError (programming error) must NOT be swallowed."""
    mock_sign_module = MagicMock()
    mock_sign_module.ClientTrustConfig.production.side_effect = AttributeError("bad")
    with (
        patch.dict(sys.modules, {"sigstore.sign": mock_sign_module}),
        pytest.raises(AttributeError),
    ):
        get_trusted_root()


def test_get_trusted_root_propagates_type_error() -> None:
    """TypeError (programming error) must NOT be swallowed."""
    mock_sign_module = MagicMock()
    mock_sign_module.ClientTrustConfig.production.side_effect = TypeError("wrong type")
    with (
        patch.dict(sys.modules, {"sigstore.sign": mock_sign_module}),
        pytest.raises(TypeError),
    ):
        get_trusted_root()
