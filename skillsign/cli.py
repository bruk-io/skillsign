"""SkillSign CLI entry point."""

from __future__ import annotations

import glob as _glob
import json
import sys
from collections.abc import Callable, Sequence
from pathlib import Path
from typing import Any

import click
from cryptography import x509

from skillsign import __version__
from skillsign.errors import SkillSignError
from skillsign.exit_codes import EXIT_CLI_ERROR, EXIT_UNSIGNED

# Spec severity order: 1 (hard failure) > 3 (POLICY_FAIL) > 2 (UNSIGNED) > 0 (VERIFIED)
_EXIT_SEVERITY: dict[int, int] = {0: 0, 2: 1, 3: 2, 1: 3}

_GLOB_CHARS = frozenset("*?[")


def _expand_paths(args: tuple[str, ...]) -> list[str]:
    """Expand glob patterns, directories, and literal paths into a flat file list.

    For each argument:
    - If it contains glob chars (*?[), expand with glob.glob(recursive=True)
    - If it is a directory, find all *.md files in it (non-recursive)
    - Otherwise treat it as a literal path (existence checked later)
    """
    result: list[str] = []
    seen: set[str] = set()
    for arg in args:
        if any(c in arg for c in _GLOB_CHARS):
            matched = _glob.glob(arg, recursive=True)
            for p in sorted(matched):
                if p not in seen:
                    seen.add(p)
                    result.append(p)
        elif Path(arg).is_dir():
            for p in sorted(str(f) for f in Path(arg).glob("*.md")):
                if p not in seen:
                    seen.add(p)
                    result.append(p)
        else:
            if arg not in seen:
                seen.add(arg)
                result.append(arg)
    return result


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


def _is_quiet(ctx: click.Context) -> bool:
    """Return True if --quiet was set."""
    return bool(ctx.obj and ctx.obj.get("quiet"))


def _output(ctx: click.Context, text_fn: Callable[[], str], json_obj: Any) -> None:
    """Print text or JSON output depending on the --format flag in ctx.

    Suppresses all stdout output when --quiet is set.
    """
    if _is_quiet(ctx):
        return
    fmt = ctx.obj.get("format", "text") if ctx.obj else "text"
    if fmt == "json":
        click.echo(json.dumps(json_obj, indent=2))
    else:
        click.echo(text_fn())


def _error(ctx: click.Context, message: str) -> None:
    """Print an error to stderr unless --quiet is set."""
    if not _is_quiet(ctx):
        click.echo(message, err=True)


@click.group(cls=_SkillSignGroup)
@click.version_option(version=__version__, prog_name="skillsign")
@click.option(
    "--format",
    "output_format",
    type=click.Choice(["text", "json"]),
    default="text",
    help="Output format (text or json).",
)
@click.option(
    "--quiet",
    is_flag=True,
    default=False,
    help="Suppress all stdout output.",
)
@click.pass_context
def cli(ctx: click.Context, output_format: str, quiet: bool) -> None:
    """Cryptographic signing and verification for Claude Code SKILL.md files."""
    ctx.ensure_object(dict)
    ctx.obj["format"] = output_format
    ctx.obj["quiet"] = quiet


@cli.group()
def auth() -> None:
    """Authentication commands."""


@auth.command()
@click.pass_context
def login(ctx: click.Context) -> None:
    """Authenticate with GitHub via OIDC."""
    from skillsign.auth import get_identity_token

    try:
        token = get_identity_token()
    except SkillSignError as e:
        _error(ctx, f"Error: {e}")
        sys.exit(e.exit_code)

    _output(
        ctx,
        lambda: f"Authenticated as: {token.identity}\nIssuer: {token.federated_issuer}",
        {"identity": token.identity, "issuer": token.federated_issuer},
    )


@auth.command()
@click.pass_context
def status(ctx: click.Context) -> None:
    """Show current authentication state."""
    from skillsign.auth import _detect_ambient_credential

    raw_token = _detect_ambient_credential()
    if raw_token is None:
        _output(
            ctx,
            lambda: "Not authenticated.\nRun 'skillsign auth login' to authenticate.",
            {
                "authenticated": False,
                "identity": None,
                "issuer": None,
                "expired": False,
            },
        )
        return

    from sigstore.oidc import IdentityToken

    from skillsign.auth import _SIGSTORE_CLIENT_ID

    try:
        token = IdentityToken(raw_token, client_id=_SIGSTORE_CLIENT_ID)
    except (ValueError, Exception) as e:
        _error(ctx, f"Error: failed to process ambient token: {e}")
        sys.exit(EXIT_CLI_ERROR)

    if token.in_validity_period():
        _output(
            ctx,
            lambda: (
                f"Authenticated as: {token.identity}\nIssuer: {token.federated_issuer}"
            ),
            {
                "authenticated": True,
                "identity": token.identity,
                "issuer": token.federated_issuer,
                "expired": False,
            },
        )
    else:
        _output(
            ctx,
            lambda: "Token expired.\nRun 'skillsign auth login' to re-authenticate.",
            {
                "authenticated": False,
                "identity": token.identity,
                "issuer": token.federated_issuer,
                "expired": True,
            },
        )


@cli.command()
@click.argument("file", type=click.Path(exists=True))
@click.option("--force", is_flag=True, help="Overwrite existing sidecar.")
@click.pass_context
def sign(ctx: click.Context, file: str, *, force: bool = False) -> None:
    """Sign a SKILL.md file, writing a detached sidecar."""
    from skillsign.sidecar import write_sidecar
    from skillsign.signing import sign_skill

    skill_path = Path(file)
    try:
        sidecar_data = sign_skill(skill_path, force=force)
        sidecar_path = Path(str(skill_path) + ".skillsign")
        write_sidecar(sidecar_data, sidecar_path)
    except SkillSignError as e:
        _error(ctx, f"Error: {e}")
        sys.exit(e.exit_code)

    sidecar_path_str = str(sidecar_path)
    signer = sidecar_data["signer"]
    _output(
        ctx,
        lambda: _format_sign_output(str(skill_path), sidecar_path_str, signer),
        {"file": str(skill_path), "sidecar": sidecar_path_str, "signer": signer},
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


def _extract_cert_names(pem: str) -> tuple[str, str]:
    """Extract subject CN and issuer CN from a PEM certificate.

    Returns (subject_cn, issuer_cn). Falls back to "<unknown>" if the
    attribute is absent.
    """
    cert = x509.load_pem_x509_certificate(pem.encode())
    try:
        subject_cn = cert.subject.get_attributes_for_oid(x509.oid.NameOID.COMMON_NAME)[
            0
        ].value
    except IndexError:
        subject_cn = "<unknown>"
    try:
        issuer_cn = cert.issuer.get_attributes_for_oid(x509.oid.NameOID.COMMON_NAME)[
            0
        ].value
    except IndexError:
        issuer_cn = "<unknown>"
    return str(subject_cn), str(issuer_cn)


def _format_inspect_output(
    file: str, data: dict[str, Any], subject_cn: str, issuer_cn: str
) -> str:
    """Format inspect metadata for display."""
    lines = [
        f"{file}: SIGNED",
        f"  Signer:           {data['signer']}",
        f"  Skill ID:         {data['skill_id']}",
        f"  Skill Version:    {data['skill_version']}",
        f"  Timestamp:        {data['timestamp']}",
        f"  Digest:           {data['digest']}",
        f"  Rekor Log ID:     {data['rekor_log_id']}",
        f"  Rekor Timestamp:  {data['rekor_timestamp']}",
        f"  Cert Subject CN:  {subject_cn}",
        f"  Cert Issuer CN:   {issuer_cn}",
    ]
    return "\n".join(lines)


@cli.command()
@click.argument("files", nargs=-1, required=True, type=str)
@click.option("--strict", is_flag=True, help="Live Rekor query to confirm log entry.")
@click.pass_context
def verify(ctx: click.Context, files: tuple[str, ...], *, strict: bool = False) -> None:
    """Verify one or more SKILL.md files against their sidecars.

    FILES may be explicit paths, glob patterns (e.g. 'skills/*.md'), or
    directories (all *.md files in the directory are verified).
    """
    from skillsign.verify import exit_code_for, verify_skill

    # Validate that literal paths (non-glob, non-directory args) actually exist.
    # Glob/directory expansion already filters to existing files.
    for arg in files:
        if (
            not any(c in arg for c in _GLOB_CHARS)
            and not Path(arg).is_dir()
            and not Path(arg).exists()
        ):
            raise click.BadParameter(
                f"Path '{arg}' does not exist.",
                param_hint="'FILES'",
            )

    expanded = _expand_paths(files)
    if not expanded:
        _error(ctx, "Error: no files matched")
        sys.exit(EXIT_CLI_ERROR)

    worst_exit = 0
    results: list[dict[str, Any]] = []
    text_lines: list[str] = []

    for file in expanded:
        skill_path = Path(file)
        try:
            result, meta = verify_skill(skill_path, strict=strict)
        except SkillSignError as e:
            if e.exit_code == EXIT_CLI_ERROR:
                _error(ctx, f"Error: {e}")
                sys.exit(EXIT_CLI_ERROR)
            _error(ctx, f"{file}: ERROR — {e}")
            severity = _EXIT_SEVERITY.get(e.exit_code, 0)
            if severity > _EXIT_SEVERITY.get(worst_exit, 0):
                worst_exit = e.exit_code
            results.append(
                {
                    "file": file,
                    "result": "ERROR",
                    "exit_code": e.exit_code,
                    "signer": None,
                    "skill_id": None,
                    "skill_version": None,
                    "error": str(e),
                }
            )
            continue

        code = exit_code_for(result)
        if _EXIT_SEVERITY.get(code, 0) > _EXIT_SEVERITY.get(worst_exit, 0):
            worst_exit = code
        text_lines.append(_format_verification_output(file, result.value, meta))
        results.append(
            {
                "file": file,
                "result": result.value,
                "exit_code": code,
                "signer": meta.get("signer"),
                "skill_id": meta.get("skill_id"),
                "skill_version": meta.get("skill_version"),
                "error": meta.get("error"),
            }
        )

    _output(ctx, lambda: "\n".join(text_lines), results)
    sys.exit(worst_exit)


@cli.command()
@click.argument("file", type=click.Path(exists=True))
@click.pass_context
def inspect(ctx: click.Context, file: str) -> None:
    """Show signature metadata without verifying."""
    from skillsign.sidecar import read_sidecar

    skill_path = Path(file)
    sidecar_path = Path(str(skill_path) + ".skillsign")

    if not sidecar_path.exists():
        _output(
            ctx,
            lambda: f"{file}: UNSIGNED (no sidecar found)",
            {"file": file, "signed": False},
        )
        sys.exit(EXIT_UNSIGNED)

    try:
        data = read_sidecar(sidecar_path)
    except SkillSignError as e:
        _error(ctx, f"Error: {e}")
        sys.exit(e.exit_code)

    subject_cn, issuer_cn = _extract_cert_names(data["certificate"])
    _output(
        ctx,
        lambda: _format_inspect_output(file, data, subject_cn, issuer_cn),
        {
            "file": file,
            "signed": True,
            "signer": data["signer"],
            "skill_id": data["skill_id"],
            "skill_version": data["skill_version"],
            "timestamp": data["timestamp"],
            "digest": data["digest"],
            "rekor_log_id": data["rekor_log_id"],
            "rekor_timestamp": data["rekor_timestamp"],
            "cert_subject_cn": subject_cn,
            "cert_issuer_cn": issuer_cn,
        },
    )


@cli.command()
@click.argument("file", type=click.Path(exists=True))
@click.pass_context
def unsign(ctx: click.Context, file: str) -> None:
    """Delete the sidecar file for a given SKILL.md."""
    skill_path = Path(file)
    sidecar_path = Path(str(skill_path) + ".skillsign")

    if not sidecar_path.exists():
        _output(
            ctx,
            lambda: f"{file}: no sidecar found",
            {"file": file, "removed": False},
        )
        sys.exit(EXIT_UNSIGNED)

    try:
        sidecar_path.unlink()
    except OSError as e:
        _error(ctx, f"Error: {e}")
        sys.exit(EXIT_CLI_ERROR)

    sidecar_path_str = str(sidecar_path)
    _output(
        ctx,
        lambda: f"Removed: {sidecar_path_str}",
        {"file": file, "removed": True},
    )
