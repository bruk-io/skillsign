#!/usr/bin/env bash
set -euo pipefail

# Claude Code PreToolUse hook: runs quality checks before git push.
# Receives tool input as JSON on stdin. Only activates for git push commands.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

# Only gate on git push commands
if ! echo "$COMMAND" | grep -qE '^\s*git\s+push'; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "Pre-push checks running..."

# Format check
echo "  ruff format --check ."
if ! uv run ruff format --check . 2>&1; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"ruff format check failed. Run: uv run ruff format ."}}'
  exit 0
fi

# Lint check
echo "  ruff check ."
if ! uv run ruff check . 2>&1; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"ruff lint check failed. Run: uv run ruff check . --fix"}}'
  exit 0
fi

# Type check
echo "  mypy skillsign/"
if ! uv run mypy skillsign/ 2>&1; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"mypy type check failed"}}'
  exit 0
fi

# Unit tests only (fast, by directory)
echo "  pytest tests/unit/"
if ! uv run pytest tests/unit/ -q 2>&1; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Unit tests failed"}}'
  exit 0
fi

echo "All pre-push checks passed."
exit 0
