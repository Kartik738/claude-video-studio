---
name: project-preflight
description: Check an After Effects/Premiere project or a rendered video before delivery: missing media and fonts, expression errors, text/spelling, comp settings, audio presence/clipping, black frames, aspect ratio, render risks. Use before any export or when the owner asks 'is it ready?'.
---
# /project-preflight

## Step 1: project check (After Effects, read-only)
```bash
TV="~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows"
"$TV/bin/ae_run.sh" "$TV/ae_scripts/preflight.jsx" '{"comp":"<optional comp name>"}' 120
```
It reports:
- missing footage and fonts
- expression errors
- odd dimensions
- layers starting after the comp end
- audio presence
- every on-screen text string
- render-queue status

## Step 2: content checks (by Claude)
- **Spelling:** proofread every text string it lists. Pay attention to brand names and CTAs.
- **Framing:** grab frames (AE `saveFrameToPng` in a script, or Edits `captureFrame`). Check the safe zones, faces cut off, and stray layers.

## Step 3: render checks
- File exists.
- Duration, size and fps are as expected.
- With ffmpeg installed: `blackdetect` for black or flash frames, `ebur128` for loudness (target about −14 LUFS, peaks ≤ −1), `silencedetect` for silent gaps.
- Visual contact sheet of 1 frame per second.

## Output
A checklist with ✓ / ⚠ for each item, the exact fixes for each ⚠, and a "ready / not ready" verdict.
- Never mark something ✓ that wasn't checked. Say "not checked (reason)".
- Premiere projects: there's no outside scripting. Ask the owner to use File › Project Manager or the Premiere AI Assistant, or check the exported file instead.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
