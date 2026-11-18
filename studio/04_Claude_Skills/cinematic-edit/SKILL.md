---
name: cinematic-edit
description: Plan and execute an elegant cinematic edit (shot selection, pacing, framing, continuity, transitions, colour and audio) from raw footage. Use when the owner asks for a 'cinematic', 'film-like', 'premium' or 'story' edit of any footage.
---
# /cinematic-edit

**Goal:** turn raw clips into an edit that feels intentional: motivated cuts, controlled rhythm, consistent colour, clean sound.

## Inputs
- Footage paths. Required.
- A brief: mood, length, platform, and any must-have moments.
- Optional: music, reference stills or links, required text.

## Procedure
1. **Inspect** every clip: resolution, fps, duration, codec (`mdls`, or `ffprobe` if installed). Flag mixed frame rates, vertical vs horizontal, and log/HDR footage.
2. **Shot log.** Grab frames (contact sheet, or Edits `sampleFrames`/`captureFrame`). For each clip, note: the subject, shot size (wide/medium/close/detail), camera move, usable in/out, and problems (shake, focus, exposure).
3. **Structure.** Build a beat outline: hook (0–2 s), setup, build, peak, resolve/CTA. Open on the strongest image, not the chronological first.
4. **Rhythm rules:**
   - Vary shot sizes (wide → close → detail).
   - Cut on motion or on the music downbeat.
   - Average shot length is 0.8–2.0 s for Reels and 2–5 s for cinematic long-form.
   - Hold the hero moment longer.
   - Avoid two similar framings back to back (no jump cuts unless they're stylistic).
5. **Transitions:**
   - Default to hard cuts.
   - Use motivated transitions only: match cut, whip/motion-blur cut, light-leak or flash on a beat, or a dip to black for a time jump.
   - Use at most one "effect" transition per 10 s.
6. **Build.**
   - After Effects: `new_reel_comp.jsx`, then trim and arrange the layers.
   - Edits: `importMedia`, then `split`/`trim`/`reorderClip`.
7. **Colour:** call /professional-color-grade (start at `natural` or `warm-cinematic`, strength 0.6–0.8).
8. **Sound:** call /sound-design (music bed, ambience, a whoosh or riser only where a cut needs lift).
9. **Text** only if the brief needs it: /kinetic-typography.
10. **QC** with /project-preflight, then render a review copy (`queue_render.jsx` with the 15 Mbps template, or the Edits export).

## Output
- An editable project.
- A review render.
- A 5-line edit summary: structure, length, music, the look used, and anything the owner should check.

## Quality checks
- No flash frames or black gaps.
- Horizon level.
- Skin tones natural.
- Audio never clips (peaks ≤ −1 dBFS).
- Hook readable in the first 1.5 s.
- Nothing important under the platform UI.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
