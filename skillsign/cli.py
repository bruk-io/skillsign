"""SkillSign CLI entry point."""

import click

from skillsign import __version__


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
    click.echo("Not yet implemented.")
    raise SystemExit(10)


@auth.command()
def status() -> None:
    """Show current authentication state."""
    click.echo("Not yet implemented.")
    raise SystemExit(10)


@cli.command()
@click.argument("file", type=click.Path(exists=True))
def sign(file: str) -> None:
    """Sign a SKILL.md file, writing a detached sidecar."""
    click.echo("Not yet implemented.")
    raise SystemExit(10)


@cli.command()
@click.argument("files", nargs=-1, required=True, type=click.Path(exists=True))
def verify(files: tuple[str, ...]) -> None:
    """Verify one or more SKILL.md files against their sidecars."""
    click.echo("Not yet implemented.")
    raise SystemExit(10)
