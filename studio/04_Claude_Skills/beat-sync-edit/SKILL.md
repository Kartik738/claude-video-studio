---
name: beat-sync-edit
description: Analyse licensed or owner-supplied music and plan cuts, transitions, text hits and motion around meaningful beats, downbeats and phrase changes. Use for 'sync to the beat', 'music video style', 'cut on beat'.
---
# /beat-sync-edit

## Procedure
1. **Get beats:**
   - Edits: `beatMarkers`/`audioOnsets`/`setBeatDensity`
   - with ffmpeg installed: onset detection via `silencedetect`/`astats`
   - otherwise ask the owner for the BPM, or tap it from the waveform.
2. **Map structure:** intro, build, drop/chorus, outro. Note the **downbeats** (bar starts) and the **phrase changes** (every 4 or 8 bars). These are the important ones, not every beat.
3. **Assign:**
   - Big visual changes (new scene, title, reveal) go on downbeats or phrase changes.
   - Ordinary cuts go on beats, sometimes on off-beats for flow.
   - Effects like flash, glow pulse, or zoom punch go only on accents. Use at most 1 in 4 bars.
4. **Pacing curve:** slower cuts in the intro, faster in the build, the hero shot held at the drop, then a calm outro.
5. **Build** in Edits (`addBeatMarker`, `split` at beat times) or AE (layer in-points at beat times). Add AE markers to the music layer for reference.
6. **Check** by watching a preview render. Cuts should feel *on* the beat. Being 1–2 frames early often feels tighter.

## Output
A beat map table (time, beat type, edit event) plus the edit.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
