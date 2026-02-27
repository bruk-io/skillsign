"""SkillSign CLI entry point."""

import sys

import click

from skillsign import __version__


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
def sign(file: str) -> None:
    """Sign a SKILL.md file, writing a detached sidecar."""
    _not_implemented()


@cli.command()
@click.argument("files", nargs=-1, required=True, type=click.Path(exists=True))
def verify(files: tuple[str, ...]) -> None:
    """Verify one or more SKILL.md files against their sidecars."""
    _not_implemented()


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
