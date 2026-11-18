---
name: social-reel-pro
description: Create professional Instagram/Facebook Reels and YouTube Shorts with a strong hook, clean captions, tight pacing, safe text placement and a CTA ending. Use for any short vertical social video request.
---
# /social-reel-pro

## Reel formula (adapt; don't apply blindly)
| Time | Job |
|---|---|
| 0–1.5 s | **Hook:** a visual surprise plus a hook line (curiosity, a promise, or a bold statement). No logos first. |
| 1.5 s–70 % | **Value or story:** fast, clear, one idea per shot, with captions. |
| Peak | The payoff or reveal, held a beat longer. |
| Last 2–3 s | **CTA:** one action ("Follow for…", "DM for…", "Comment X"), subtle and on brand. Loop-friendly if possible. |

Length: 7–30 s performs best for most accounts. Only go longer if it's genuinely story-driven.

## Specs
- 1080×1920
- 30 fps (or the source frame rate)
- Media Encoder preset `TV Reels 9x16 - H264 16-24Mbps`, or the Edits export
- Safe zone: top 14 %, bottom 20 %, right 12 % (the `new_reel_comp.jsx` guide shows it in red)

## Procedure
1. Clarify the hook text, CTA, music direction, and whether to keep the original audio.
2. Run the /cinematic-edit steps with Reels pacing (0.6–1.8 s shots).
3. Captions: use /auto-caption-studio if there's speech, and /kinetic-typography for the hook and CTA.
4. Sound: /beat-sync-edit, then /sound-design.
5. Run /project-preflight, then render, then grab frames at 0.5 s, the midpoint, the peak, and the CTA. Check readability at phone size (scale the stills to 360 px wide).
6. Deliver the MP4, a 1-line caption suggestion, and 3–5 hashtags only if asked.

## Quality checks
- Is the hook readable with the sound off?
- Is any text under the UI?
- Does the first frame work as a thumbnail?
- Is audio at about −14 LUFS?

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
