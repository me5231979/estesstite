#!/bin/bash
set -euo pipefail

# SessionStart hook: register the 21st.dev Magic MCP server at user scope.
#
# In Claude Code on the web, user-scoped config (~/.claude.json) lives in an
# ephemeral container and is discarded when the session ends, so the server
# must be re-registered on each session start.
#
# The API key is NOT stored in this file. Set MAGIC_API_KEY as an environment
# secret in your Claude Code environment settings.

# Only run in remote (web) sessions; local machines keep their own config.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Nothing to do without an API key. Warn (to stderr) and exit cleanly so the
# session still starts.
if [ -z "${MAGIC_API_KEY:-}" ]; then
  echo "session-start: MAGIC_API_KEY not set; skipping Magic MCP registration." >&2
  exit 0
fi

# Idempotent: skip if already registered.
if claude mcp get magic >/dev/null 2>&1; then
  echo "session-start: Magic MCP already registered." >&2
  exit 0
fi

# Send the CLI's confirmation to stderr to keep the hook's stdout clean.
claude mcp add magic --scope user --env API_KEY="$MAGIC_API_KEY" \
  -- npx -y @21st-dev/magic@latest >&2

echo "session-start: registered Magic MCP (user scope)." >&2
