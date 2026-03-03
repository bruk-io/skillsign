# SkillSign

Cryptographic signing and verification for Claude Code SKILL.md files using Sigstore keyless signing.

## Key Documents

| Document | Location | Purpose |
|---|---|---|
| Specification | `docs/spec.md` | v0.1 draft — the source of truth for all behavior |
| Roadmap | `docs/roadmap.md` | 4 phases, 45 deliverables, milestone-based |
| Scrum Plugin | `plugins/scrum/` | 6 skills: sprint planning, execution, review, integration, retrospective, evolution |
| Security Plugin | `plugins/security/` | 6 agents + 7 skills for spec security review |
| Product Mgmt Plugin | `plugins/product-management/` | 1 agent + 1 skill for roadmap and issue management |
| Architecture | `architecture/` | C4 model in LikeC4 DSL (21 files, 17 views) |

## Project Conventions

- **Language:** Python 3.14+
- **Package manager:** UV (required)
- **CLI framework:** Click
- **Formatting:** ruff with black profile
- **Type hints:** Mandatory
- **Layout:** Flat (`skillsign/skillsign/`, not `skillsign/src/skillsign/`)
- **License:** MIT

## Agent Roster

Agents are defined in their respective plugins. Each has an explicit `model` in its frontmatter.

| Agent | Model | Purpose |
|---|---|---|
| `product-manager` | Sonnet | Roadmap, issue triage, milestone management |
| `crypto-reviewer` | Opus | Signing/verification protocols, Sigstore integration |
| `identity-reviewer` | Opus | Signer identity, SAN matching, namespace security |
| `policy-reviewer` | Opus | Policy engine design, rule evaluation, CLI flag interactions |
| `input-surface-reviewer` | Opus | YAML parsing security, canonical form, size limits |
| `attack-researcher` | Opus | Threat modeling, supply chain attacks, TOCTOU |
| `consistency-checker` | Opus | Cross-references, terminology, exit code mappings |

## How Work Gets Done

Development follows a 6-phase scrum cycle, mechanized as skills in the `scrum/` plugin:

1. **`sprint-planning`** — PM selects 3-5 issues, decomposes into tasks with dependencies
2. **`sprint-execution`** — Agents claim tasks, implement in worktrees, self-verify, report
3. **`sprint-review`** — Dispatch reviewers based on what changed (code, crypto, identity, etc.)
4. **`sprint-integration`** — Merge passing work, flag failures, verify integrated codebase
5. **`sprint-retrospective`** — Reflect, detect patterns, produce concrete changes
6. **`sprint-evolution`** — Apply retro outputs, human checkpoint before next cycle

Model assignment:
- **Opus** — Judgment, architecture, security review, retro synthesis
- **Sonnet** — Implementation, code review, issue management
- **Haiku** — Explore-only (codebase search, context gathering)

## Architecture

The C4 model lives in `architecture/` and covers:
- **Level 1 (Context):** Actors (skill author, skill consumer, CI pipeline), SkillSign system, external systems (Sigstore, GitHub OIDC, TUF)
- **Level 2 (Containers):** CLI tool, skill files, TUF cache
- **Level 3 (Components):** 8 components inside the CLI (canonical processor, digest engine, signing engine, verification engine, policy engine, sidecar manager, TUF client, OIDC authenticator)
- **Dynamic views:** 14 flows covering happy paths and all error codes

Validate with: `npx likec4 validate ./architecture`

## Knowhere Marketplace Skills

The [knowhere](file:///Users/brukhabtu/Documents/src/github.com/bruk-io/knowhere) repo contains reusable plugins with Copier templates. **Use these instead of writing boilerplate by hand.** Available skills relevant to this project:

| Skill | Plugin | What it does |
|---|---|---|
| `github:ci` | `knowhere/plugins/github/` | Generate GitHub Actions CI workflow (Python/Node/Go/Rust). Uses Copier templates. |
| `github:pages` | `knowhere/plugins/github/` | Generate GitHub Pages deployment workflow |
| `containers:dockerfile` | `knowhere/plugins/containers/` | Generate multi-target Dockerfiles (Python/Node/Go/Rust) |
| `python:pyproject` | `knowhere/plugins/python/` | Scaffold Python project (pyproject.toml, flat layout, Click CLI) |
| `likec4:likec4-dsl` | `knowhere/plugins/likec4/` | LikeC4 DSL syntax reference for architecture modeling |
| `likec4:c4-methodology` | `knowhere/plugins/likec4/` | C4 methodology guidance (abstraction levels, decomposition) |
| `mkdocs:docs` | `knowhere/plugins/mkdocs/` | Scaffold MkDocs documentation site |

**How to use Copier templates** (example for CI):
```bash
uvx copier copy --trust --defaults \
  --data language="python" \
  --data package_name="skillsign" \
  /path/to/knowhere/plugins/github/skills/ci/templates/ci/ .
```

When creating new infrastructure (CI, Dockerfile, docs site), check knowhere first.

## Spec Quick Reference

- **Signing:** Section 7 — canonical form → digest → OIDC → Fulcio cert → ECDSA sign → Rekor log → sidecar
- **Verification:** Section 8 — sidecar parse → digest recompute → ECDSA verify → cert chain → SAN → EKU → SET
- **Exit codes:** 0=VERIFIED, 1=hard failure, 2=UNSIGNED, 3=POLICY_FAIL, 10=CLI error
- **Verification results:** VERIFIED, TAMPERED, INVALID_CERT, IDENTITY_MISMATCH, UNSIGNED, POLICY_FAIL, SKILL_ID_MISMATCH, MALFORMED_SIDECAR
