---
name: raw-to-reel
description: End-to-end pipeline: raw footage + written brief (+ optional references, branding, required text, music direction) to a finished, QC'd, exported reel. Use when the owner drops footage and says 'make a reel/video from this' without naming a specific skill.
---
# /raw-to-reel (master workflow)

## Intake (ask only what's missing, all in one message)
- Footage location
- Platform and length
- Mood or reference
- Required on-screen text and CTA
- Music: provided / Edits library / none; keep or mute the original audio
- Brand: Tarotoverse uses /tarotoverse-mystical-reel; otherwise ask for the colours and font if they matter

## Pipeline (each step names the skill that owns it)
1. Inspect footage and flag technical issues → /video-enhancement (audit only)
2. Organise clips (AE `organize_project.jsx`)
3. Shot log and structure → /cinematic-edit, or /influencer-cinematic-edit for people/lifestyle
4. Rough cut → **CHECKPOINT A:** show the owner a low-res review render or contact sheet before polishing
5. Refine pacing to the music → /beat-sync-edit
6. Effects → /magical-vfx (only if the brief wants magic)
7. Text and captions → /kinetic-typography, /auto-caption-studio
8. Sound → /sound-design
9. Colour → /professional-color-grade
10. Safe-zone and framing check, then /project-preflight
11. Export → /render-master
12. QC report and **CHECKPOINT B:** owner approval
13. Optional: other aspect ratios → /multi-format-export

## Choosing the engine
- **Edits app:** fastest, social-native captions and music, object tracking.
- **After Effects:** premium typography and VFX, full control.
- You can mix them: build overlays or titles in AE (render with alpha), then finish in Edits, or the reverse.

## Final report (plain language)
What was made, where the file is, the length and specs, what to review, and what couldn't be done (and why).

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
