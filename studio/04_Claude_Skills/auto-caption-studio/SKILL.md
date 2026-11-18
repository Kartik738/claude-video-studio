---
name: auto-caption-studio
description: Create accurate, editable captions with professional line breaks, timing, hierarchy and configurable styles (clean, bold social, karaoke highlight, elegant serif). Use for subtitles, captions, 'add text of what I say'.
---
# /auto-caption-studio

## Transcription options (choose in this order)
1. **Edits app:** `generateCaptions`, then `listCaptionStyles`/`setCaptionStyle`/`setCaptionHighlights`. Fast, styled, and editable in the app.
2. **Premiere Pro:** Text panel › Transcribe sequence › Create captions. Speech-to-Text is included with the subscription. Use when the edit lives in Premiere.
3. **After Effects:** build caption text layers from a transcript with timings (one layer per caption via `add_kinetic_title.jsx`, style `words`, glow off, size 60).

## Caption rules
- Max 2 lines, about 32 characters per line for vertical video. Break at natural phrase boundaries, never between an article and its noun.
- On screen for 1–6 s each. No gaps shorter than 0.25 s (merge them instead).
- Position in the lower-middle safe area (y about 0.62–0.70 on 9:16). Never under the UI.
- Emphasis: highlight 1 keyword per caption at most, in the brand colour.
- **Proofread:** names, brand words (e.g. "Tarotoverse"), numbers, and Hinglish/Hindi spellings. Ask the owner about uncertain words. Don't guess.

## Output
Captions burned into the render (for Reels) and/or an editable caption track. For YouTube, also export an .srt when using Premiere.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
