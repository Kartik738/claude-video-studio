---
name: influencer-cinematic-edit
description: Transform raw influencer footage into premium lifestyle, travel, fashion or personality reels: creative cuts, cinematic framing, seamless transitions, clean grade, engaging pacing. Use when the owner gives multiple raw clips of a person/lifestyle and wants a polished reel.
---
# /influencer-cinematic-edit

## Style principles
- The person is the hero. Prioritise eye contact, genuine expressions, and movement toward the camera.
- **Shot rhythm:** establish (location), then the person, then details (outfit, hands, food, texture), then a reaction, then the hero shot.
- **Seamless transitions only when the footage supports them:**
  - match cut on similar shapes or motion
  - whip pan to whip pan
  - object wipe (something passes the lens)
  - a jump in the same framing for an outfit change
  - speed ramp into the beat
  - Never use a transition pack on every cut.
- **Framing:** reframe to 9:16 with the subject's eyes in the upper third. Use slow push-ins (scale 100 to 104 % over a shot) for life.
- **Grade:** `natural` or `warm-cinematic`, with skin protected (/professional-color-grade).
- **Audio:** remove the original audio if asked. Keep a few natural sound moments (laugh, waves) under the music if they add life.

## Procedure
1. Shot log (as in /cinematic-edit), and rate each clip A/B/C.
2. Choose the music (owner-supplied or Edits library), then build the beat map (/beat-sync-edit).
3. Assemble the A-clips on downbeats. Fill with B-clips. Cut all C-clips.
4. Speed ramps:
   - Edits: `setSpeedCurve`
   - AE: time remap with eased keys
5. Grade, then minimal text (name or location tag, optional hook), then the sound polish.
6. Preflight, then render, then a contact sheet for the owner.

## Avoid
- Over-sharpening
- Beauty smoothing that looks fake
- More than 2 fonts
- Predictable zoom-transition spam

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
