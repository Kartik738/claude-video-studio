---
name: render-master
description: Choose and apply the right render/export settings for the destination (Reels, Shorts, YouTube, review copy, master, ProRes intermediate, alpha overlay), balancing quality, size and compatibility. Use for 'export', 'render', 'what settings', 'file too big'.
---
# /render-master

## Decision table
| Destination | Tool and preset |
|---|---|
| IG/FB Reels, YT Shorts | AE: `H.264 - Match Render Settings - 40 Mbps` with a 1080×1920 comp. Or Media Encoder **`TV Reels 9x16 - H264 16-24Mbps`**. Or the Edits export. |
| WhatsApp/email review | **`TV Review Copy - H264 6-8Mbps`**, or the AE 5/15 Mbps template |
| Archive master | **`TV Master - H264 40-50Mbps`**, or ProRes 422 HQ if space allows |
| YouTube | AME built-in `YouTube 1080p HD` / `YouTube 2160p 4K` |
| Edit-friendly intermediate | `Apple ProRes 422 HQ` (big files: about 1.8 GB per minute at 1080p) |
| Transparent overlay | AE `High Quality with Alpha` (ProRes 4444) |

## Rules
- Match the comp frame rate to the source. Never export 30 fps footage at 60.
- Render from AE with `queue_render.jsx` (never overwrites) or `aerender`.
- Don't render twice through H.264. Re-edit from the source or ProRes.
- Check free disk space before big renders (`df -h ~`). Keep 15 GB free.
- **Verify every output:** the file exists and size is > 0; duration, resolution and fps are as expected (`mdls`, or `ffprobe` if installed); grab first, middle and last frames.

## Report
File path, size, duration, resolution, and fps, in plain words.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
