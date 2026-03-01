"""SkillSign CLI entry point."""

from __future__ import annotations

import sys
from collections.abc import Sequence
from pathlib import Path
from typing import Any

import click

from skillsign import __version__
from skillsign.errors import SkillSignError
from skillsign.exit_codes import EXIT_CLI_ERROR


class _SkillSignGroup(click.Group):
    """Custom group that remaps Click's UsageError exit code (2) to 10.

    Spec Section 9.3 maps all CLI/usage errors to exit code 10.
    Click uses exit code 2 for UsageError (bad arguments, missing files, etc.),
    so we run in non-standalone mode and handle exceptions ourselves, mapping
    UsageError to exit code 10 while preserving legitimate exit code 2 (UNSIGNED).
    """

    def main(
        self,
        args: Sequence[str] | None = None,
        prog_name: str | None = None,
        complete_var: str | None = None,
        standalone_mode: bool = True,
        **extra: Any,
    ) -> Any:
        try:
            return super().main(
                args=args,
                prog_name=prog_name,
                complete_var=complete_var,
                standalone_mode=False,
                **extra,
            )
        except click.UsageError as exc:
            exc.show()
            sys.exit(EXIT_CLI_ERROR)
        except click.exceptions.Exit as exc:
            sys.exit(exc.exit_code)
        except SystemExit:
            raise
        except click.Abort:
            sys.exit(EXIT_CLI_ERROR)


def _not_implemented() -> None:
    """Exit with code 10 for unimplemented commands."""
    click.echo("Not yet implemented.", err=True)
    sys.exit(EXIT_CLI_ERROR)


@click.group(cls=_SkillSignGroup)
@click.version_option(version=__version__, prog_name="skillsign")
def cli() -> None:
    """Cryptographic signing and verification for Claude Code SKILL.md files."""


@cli.group()
def auth() -> None:
    """Authentication commands."""


@auth.command()
def login() -> None:
    """Authenticate with GitHub via OIDC."""
    from skillsign.auth import get_identity_token

    try:
        token = get_identity_token()
    except SkillSignError as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(e.exit_code)

    click.echo(f"Authenticated as: {token.identity}")
    click.echo(f"Issuer: {token.federated_issuer}")


@auth.command()
def status() -> None:
    """Show current authentication state."""
    from skillsign.auth import _detect_ambient_credential

    raw_token = _detect_ambient_credential()
    if raw_token is None:
        click.echo("Not authenticated.")
        click.echo("Run 'skillsign auth login' to authenticate.")
        return

    from sigstore.oidc import IdentityToken

    from skillsign.auth import _SIGSTORE_CLIENT_ID

    try:
        token = IdentityToken(raw_token, client_id=_SIGSTORE_CLIENT_ID)
    except Exception as e:
        click.echo(f"Error: failed to process ambient token: {e}", err=True)
        sys.exit(EXIT_CLI_ERROR)

    if token.in_validity_period():
        click.echo(f"Authenticated as: {token.identity}")
        click.echo(f"Issuer: {token.federated_issuer}")
    else:
        click.echo("Token expired.")
        click.echo("Run 'skillsign auth login' to re-authenticate.")


@cli.command()
@click.argument("file", type=click.Path(exists=True))
@click.option("--force", is_flag=True, help="Overwrite existing sidecar.")
def sign(file: str, *, force: bool = False) -> None:
    """Sign a SKILL.md file, writing a detached sidecar."""
    from skillsign.sidecar import write_sidecar
    from skillsign.signing import sign_skill

    skill_path = Path(file)
    try:
        sidecar_data = sign_skill(skill_path, force=force)
        sidecar_path = Path(str(skill_path) + ".skillsign")
        write_sidecar(sidecar_data, sidecar_path)
    except SkillSignError as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(e.exit_code)

    click.echo(
        _format_sign_output(str(skill_path), str(sidecar_path), sidecar_data["signer"])
    )


def _format_verification_output(
    file: str, result_value: str, meta: dict[str, Any]
) -> str:
    """Format a single file's verification result for display."""
    if result_value == "VERIFIED":
        return (
            f"{file}: VERIFIED\n"
            f"  Signer: {meta['signer']}\n"
            f"  Skill:  {meta['skill_id']} v{meta['skill_version']}"
        )
    if result_value == "UNSIGNED":
        return f"{file}: UNSIGNED (no sidecar found)"
    lines = [f"{file}: {result_value}"]
    if "error" in meta:
        lines.append(f"  {meta['error']}")
    return "\n".join(lines)


def _format_sign_output(skill_path: str, sidecar_path: str, signer: str) -> str:
    """Format sign command output for display."""
    return f"Signed: {skill_path}\nSidecar: {sidecar_path}\nSigner: {signer}"


@cli.command()
@click.argument("files", nargs=-1, required=True, type=click.Path(exists=True))
def verify(files: tuple[str, ...]) -> None:
    """Verify one or more SKILL.md files against their sidecars."""
    from skillsign.verify import exit_code_for, verify_skill

    worst_exit = 0

    for file in files:
        skill_path = Path(file)
        try:
            result, meta = verify_skill(skill_path)
        except SkillSignError as e:
            click.echo(f"{file}: ERROR — {e}", err=True)
            worst_exit = max(worst_exit, e.exit_code)
            continue

        code = exit_code_for(result)
        worst_exit = max(worst_exit, code)
        click.echo(_format_verification_output(file, result.value, meta))

    sys.exit(worst_exit)


@cli.command()
@click.argument("file", type=click.Path(exists=True))
def inspect(file: str) -> None:
    """Show signature metadata without verifying."""
    _not_implemented()


@cli.command()
@click.argument("file", type=click.Path(exists=True))
def unsign(file: str) -> None:
    """Delete the sidecar file for a given SKILL.md."""
    _not_implemented()
