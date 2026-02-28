"""SkillSign CLI entry point."""

import sys
from pathlib import Path

import click

from skillsign import __version__
from skillsign.errors import SkillSignError


def _not_implemented() -> None:
    """Exit with code 10 for unimplemented commands."""
    click.echo("Not yet implemented.", err=True)
    sys.exit(10)


@click.group()
@click.version_option(version=__version__, prog_name="skillsign")
def cli() -> None:
    """Cryptographic signing and verification for Claude Code SKILL.md files."""


@cli.group()
def auth() -> None:
    """Authentication commands."""


@auth.command()
def login() -> None:
    """Authenticate with GitHub via OIDC."""
    _not_implemented()


@auth.command()
def status() -> None:
    """Show current authentication state."""
    _not_implemented()


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

    click.echo(f"Signed: {skill_path}")
    click.echo(f"Sidecar: {sidecar_path}")
    click.echo(f"Signer: {sidecar_data['signer']}")


@cli.command()
@click.argument("files", nargs=-1, required=True, type=click.Path(exists=True))
def verify(files: tuple[str, ...]) -> None:
    """Verify one or more SKILL.md files against their sidecars."""
    from skillsign.verify import VerificationResult, exit_code_for, verify_skill

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

        if result == VerificationResult.VERIFIED:
            click.echo(f"{file}: VERIFIED")
            click.echo(f"  Signer: {meta['signer']}")
            click.echo(f"  Skill:  {meta['skill_id']} v{meta['skill_version']}")
        elif result == VerificationResult.UNSIGNED:
            click.echo(f"{file}: UNSIGNED (no sidecar found)")
        else:
            click.echo(f"{file}: {result.value}")
            if "error" in meta:
                click.echo(f"  {meta['error']}")

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
