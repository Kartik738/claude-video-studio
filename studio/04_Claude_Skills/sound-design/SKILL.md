---
name: sound-design
description: Prepare professional audio: music bed, ambience, whooshes/risers/impacts, dialogue cleanup, EQ, ducking and loudness for social or cinematic delivery. Use when the owner mentions sound, music levels, noise, voice, SFX or 'make it sound pro'.
---
# /sound-design

## Targets
- Social: integrated loudness about −14 LUFS, true peak ≤ −1 dBTP.
- Dialogue sits on top; music is ducked 8–12 dB under speech.
- Every SFX must be motivated by something on screen (a cut, a reveal, text appearing).

## Toolbox
- **Edits app:**
  - `searchSoundEffects`/`addSoundEffect`, `addMusicTrack` (licensed in-app library)
  - `setDucking`, `setVoiceEnhance`, `loudness`, `audioLevels`
- **After Effects:** audio effects (Parametric EQ, Compressor, De-esser new in 27.0, Reverb) on layers.
- **Premiere Pro:** Essential Sound panel (Dialogue › Enhance Speech, auto-ducking, Loudness Auto-Match), and the Premiere AI Assistant skill `mix-audio-with-essential-sound`.
- **Adobe Podcast Enhance Speech** (via the Adobe MCP `media_enhance_speech`). It uses an Adobe cloud service, so ask before using it.

## Procedure
1. **Inventory:** is there dialogue, wanted ambience, or unwanted original audio (mute it if the brief says so)?
2. **Dialogue:** remove noise, then EQ (high-pass 80 Hz, small cut around 300 Hz if boomy, gentle presence lift around 3–5 kHz), then compress lightly and de-ess.
3. **Music:** start on a phrase boundary and end on a resolved note or a fade. Edit to beats (/beat-sync-edit).
4. **SFX:**
   - a soft whoosh into transitions
   - a shimmer or chime on a magical reveal
   - a low riser into the hook
   - a subtle impact on the title
   - At most one SFX per 2–3 s.
5. **Mix and measure:** peaks, LUFS. Fix clipping.

## Licensing
Only use music and SFX from the owner, the Edits library, Adobe Stock (licensed), or sources recorded in `LICENSES.md`. Don't use commercial songs without rights.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
