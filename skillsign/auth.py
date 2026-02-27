"""OIDC authentication flow per Section 4.1 of the SkillSign spec.

The sigstore SDK handles ephemeral key generation, Fulcio certificate
issuance, and Rekor submission internally. This module handles the
identity layer: detecting ambient credentials (CI) or running the
interactive browser-based OIDC flow.
"""

from sigstore.oidc import IdentityToken, Issuer, detect_credential

from skillsign.errors import SkillSignError

_SIGSTORE_OAUTH_ISSUER = "https://oauth2.sigstore.dev/auth"
_SIGSTORE_CLIENT_ID = "sigstore"


def get_identity_token() -> IdentityToken:
    """Obtain an OIDC identity token for signing.

    Tries ambient credential detection first (GitHub Actions OIDC).
    Falls back to interactive browser-based flow via Sigstore's OAuth.

    Returns an IdentityToken for use with SigningContext.signer().
    Raises SkillSignError with exit_code=10 if authentication fails.
    """
    # Try ambient credentials first (GitHub Actions OIDC)
    raw_token = _detect_ambient_credential()
    if raw_token is not None:
        try:
            return IdentityToken(raw_token, client_id=_SIGSTORE_CLIENT_ID)
        except Exception as e:
            raise SkillSignError(
                f"Failed to process ambient OIDC token: {e}", exit_code=10
            ) from e

    # Fall back to interactive browser flow
    return _interactive_login()


def _detect_ambient_credential() -> str | None:
    """Detect ambient OIDC credential from CI environment.

    Returns the raw JWT string if found, None otherwise.
    """
    try:
        return detect_credential(_SIGSTORE_CLIENT_ID)
    except Exception:
        # detect_credential raises on network errors; treat as no credential
        return None


def _interactive_login() -> IdentityToken:
    """Run interactive browser-based OIDC flow.

    Opens a browser for the user to authenticate with their GitHub account
    via Sigstore's OAuth flow.

    Raises SkillSignError with exit_code=10 if authentication fails.
    """
    try:
        issuer = Issuer(_SIGSTORE_OAUTH_ISSUER)
    except Exception as e:
        raise SkillSignError(
            f"Failed to connect to OIDC issuer: {e}", exit_code=10
        ) from e

    try:
        return issuer.identity_token(client_id=_SIGSTORE_CLIENT_ID)
    except Exception as e:
        raise SkillSignError(f"OIDC authentication failed: {e}", exit_code=10) from e
