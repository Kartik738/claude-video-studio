#!/bin/bash
# Installs Claude Video Studio on this Mac. Safe to re-run; never overwrites existing skills.
set -e
REPO="$(cd "$(dirname "$0")" && pwd)"

echo "1/4  Linking Claude Code skills into ~/.claude/skills"
mkdir -p "$HOME/.claude/skills"
for d in "$REPO"/studio/04_Claude_Skills/*/; do
  name="$(basename "$d")"
  target="$HOME/.claude/skills/$name"
  if [ -e "$target" ] || [ -L "$target" ]; then
    echo "     skip $name (already exists)"
  else
    ln -s "${d%/}" "$target" && echo "     + $name"
  fi
done

echo "2/4  Copying After Effects Assistant skills"
AE_DIR="$HOME/Documents/Adobe/Common/Assets/Assistant Skills/After Effects"
mkdir -p "$AE_DIR"
for d in "$REPO/studio/03_Adobe_Skills/After Effects"/*/; do
  name="$(basename "$d")"
  if [ -e "$AE_DIR/$name" ]; then echo "     skip $name (already exists)"; else cp -R "${d%/}" "$AE_DIR/" && echo "     + $name"; fi
done

echo "3/4  Making the After Effects runner executable"
chmod +x "$REPO/studio/07_Automation_Workflows/bin/ae_run.sh"

echo "4/4  Setting up Python tools for the Tarotoverse effects"
if command -v python3 >/dev/null; then
  bash "$REPO/tarotoverse/tools/setup.sh" || echo "     (tools setup failed; run tarotoverse/tools/setup.sh later)"
else
  echo "     python3 not found; skipped"
fi

command -v ffmpeg >/dev/null || echo "NOTE: ffmpeg not found. Install it with: brew install ffmpeg"
echo "Done. Restart Claude Code, then try /raw-to-reel."
