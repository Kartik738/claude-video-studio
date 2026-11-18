TK = "~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md"
COMMON = f"""
## Ground rules (all editing skills)
- Read `{TK}` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
"""
SKILLS = {}
SKILLS["cinematic-edit"] = ("Plan and execute an elegant cinematic edit (shot selection, pacing, framing, continuity, transitions, colour and audio) from raw footage. Use when the owner asks for a 'cinematic', 'film-like', 'premium' or 'story' edit of any footage.", """
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
""")
SKILLS["magical-vfx"] = ("Design restrained, believable magical/ethereal visual effects: glow, light motes, aura, mist, light sweeps, sparkles. Use for mystical, spiritual, tarot, fantasy or dreamy looks, or when the owner says 'add magic', 'glow', 'particles'.", """
# /magical-vfx

**Principle:** magic should look like *light inside the scene*, not stickers on top. Less is more: one hero effect per moment.

## Effect menu (native After Effects, no plugins, via `add_magic_fx.jsx`)
| fx | What it is | Good for | Typical args |
|---|---|---|---|
| `aura` | soft pulsing glow bloom centred on x,y | tarot card, face, candle | `amount 0.6–1`, `x/y` = card centre (0–1) |
| `motes` | drifting golden particles | ambience across a whole shot | `amount 0.4–0.8` |
| `mist` | slow fractal haze, screen blend | night/mystic atmosphere | `amount 0.3–0.6` |
| `sweep` | light sweep across the frame | reveal of a card or title | `dur 1.2–1.8` |
| `stars` | twinkling sparkles | a short accent on a reveal beat | `dur ≤ 2`, `amount 0.5` |

Colour palette:
- gold `FFD68C`
- moonlight `D8E4FF`
- rose `FFC6D4`
- ember `FFB27A`
- violet `C9B6FF`

If Video Copilot Saber/Orb or other free plugins have been installed (check `02_Installed_Plugins/PLUGINS.md`), use Saber for energy edges and light strokes on cards/text.

For effects that must hug a moving object, use the Tarotoverse `card_halo.py` and `light_motes.py` tools (PNG overlays with Edits object tracking). See `~/Claude AI/Tarotoverse/tools/README.md`.

## Procedure
1. Identify the moment(s) that deserve magic: a reveal, a hook, the emotional peak.
2. Pick at most 2 effects per shot. Time them to a beat or a hand movement.
3. Apply with `add_magic_fx.jsx`. Fade in and out (built in).
4. Grab a frame at the peak. Check that the effect doesn't wash out faces or the card, and that text stays readable.
5. If it's too strong, lower `amount` or layer opacity. If it looks fake, add a little `mist` so the light "lives" in the air.

## Quality checks
- Highlights not blown on the subject.
- No effect running the entire reel at full strength.
- The colour matches the grade.
- Motion is slow and elegant, never frantic.
- Renders in reasonable time on 8 GB RAM (pre-render heavy particle layers if previews stall).
""")
SKILLS["kinetic-typography"] = ("Create readable, precisely aligned, elegantly animated on-screen text (titles, hooks, quotes, lists, CTAs) with good hierarchy, spacing, easing and timing. Use whenever a video needs animated text or titles.", """
# /kinetic-typography

## Rules of good kinetic type
- **Readability first:** each line stays on screen for at least (words × 0.3 s) + 0.6 s.
- **Size:** at most 5–7 words per line on 9:16. Hook size 80–110 px on 1080×1920; body 54–70 px.
- **Hierarchy:** one hero line (large), one support line (smaller, lighter weight or italic serif).
- **Placement:** inside the safe zone (top 14%, bottom 20%, right 12%). Hooks sit around y = 0.28–0.38; CTAs around y = 0.70–0.76.
- **Motion:** ease-out entrances of 0.5–1.2 s, a gentle hold, and a quick 0.3–0.5 s exit. Don't use bounces for premium brands.
- **Contrast:** a soft drop shadow or glow (built in), or a subtle dark gradient behind the text. Never place text over busy highlights without support.
- **Fonts:** at most 2 families.
  - Elegant pairing: a serif display (e.g. Cormorant, Playfair Display, or Adobe Fonts "Bodoni"/"Ivy Presto") with a clean sans (Montserrat/Inter).
  - Check that fonts are active (`preflight.jsx` lists missing fonts). Adobe Fonts are included with the subscription.

## Styles available (`add_kinetic_title.jsx`)
- `rise`: per-character blur-up fade. Elegant default.
- `words`: per-word rise. Good for hooks.
- `track`: letters glide together from wide tracking. Luxury titles.
- `typewriter`: character reveal. Messages or "secret" reveals.

## Procedure
1. Write the text plan: line, start, duration, style, size, and y position.
2. Read the text back to the owner, or proofread it. Spelling mistakes are the #1 amateur tell.
3. Apply each line in time order, then grab frames at the mid-point of each title.
4. Check alignment (centred, consistent margins) and that no two titles overlap in time unless intended.
5. Fine-tune by hand in AE if needed. Everything stays editable (animators and effects are named).

## Output
Text layers named `Title: …`, plus a timing table in the summary.
""")
SKILLS["professional-color-grade"] = ("Analyse footage and apply controlled cinematic colour correction and grading that protects natural skin tones and detail. Use for 'colour grade', 'make it look cinematic', 'fix colours', 'match shots', 'too dark/bright/orange'.", """
# /professional-color-grade

## Order of operations (always)
1. **Technical correction** (per clip): exposure, white balance, contrast, highlight recovery. Use a Lumetri effect on the clip itself, or Edits `applyAdjust`.
2. **Shot matching:** make all clips agree (same white point, similar exposure) before any look.
3. **Creative look** (one adjustment layer over everything): `add_grade.jsx`, or a LUT at 30–60 % intensity.
4. **Finishing:** vignette, a touch of grain if there's banding, sharpening only on soft footage (Lumetri Sharpen ≤ 15).

## Looks (`add_grade.jsx`; start with strength 0.6–0.8)
| look | Use for |
|---|---|
| `natural` | influencer, product, daylight |
| `warm-cinematic` | lifestyle, travel, golden hour |
| `mystic-night` | tarot, night, moody spiritual |
| `teal-gold` | dramatic travel/fashion. Watch skin. |
| `soft-luxe` | fashion and beauty: lifted blacks, gentle highlights |

## Skin-tone protection
- Skin should sit near the vectorscope skin line. If the look shifts skin green, magenta or grey, reduce strength or add an HSL Secondary key on skin to pull it back.
- Never push saturation above about 110 % globally. Use vibrance instead.

## Procedure
1. Grab a frame of each clip and judge exposure and colour cast (describe what you see).
2. Correct per clip, then apply the look, then grab before/after frames of 2–3 key shots.
3. Show the owner the before/after. Adjust strength based on their reaction.

## Quality checks
- No crushed blacks hiding detail in hair or clothes.
- No clipped skies or faces.
- Consistent across cuts.
- Text and effects colours still harmonise.
""")
SKILLS["sound-design"] = ("Prepare professional audio: music bed, ambience, whooshes/risers/impacts, dialogue cleanup, EQ, ducking and loudness for social or cinematic delivery. Use when the owner mentions sound, music levels, noise, voice, SFX or 'make it sound pro'.", """
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
""")
SKILLS["beat-sync-edit"] = ("Analyse licensed or owner-supplied music and plan cuts, transitions, text hits and motion around meaningful beats, downbeats and phrase changes. Use for 'sync to the beat', 'music video style', 'cut on beat'.", """
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
""")
SKILLS["social-reel-pro"] = ("Create professional Instagram/Facebook Reels and YouTube Shorts with a strong hook, clean captions, tight pacing, safe text placement and a CTA ending. Use for any short vertical social video request.", """
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
""")
SKILLS["tarotoverse-mystical-reel"] = ("Create premium mystical tarot Reels for @tarotoverse: elegant typography, restrained magical VFX, luxurious atmospheric light, brand-consistent but creatively different each time. Use for any Tarotoverse / tarot reel request.", """
# /tarotoverse-mystical-reel

**This skill defers to the existing Tarotoverse system.** Its rules win over anything generic.

1. Load these first:
   - `~/Claude AI/Tarotoverse/CLAUDE.md`
   - the `/tarotoverse-reel` skill (`~/Claude AI/Tarotoverse/.claude/skills/tarotoverse-reel/SKILL.md`)
   - `docs/tarotoverse-brand.md`
   - `docs/quality-checklist.md`
   - `docs/reel-history.md` (so this Reel differs from recent ones)
2. Approved references: the "Final Typography Edit" and the "Enchanted Edit" (golden aura, light motes, chime). Match their quality bar.

## Two production paths
- **Fast path (Edits app):** the proven `/tarotoverse-reel` workflow, with `card_halo.py`/`light_motes.py` overlays.
- **Premium path (After Effects).** Use it when the owner wants richer typography or effects:
  1. `new_reel_comp.jsx` with the footage (muteOriginal if music replaces it)
  2. `add_grade.jsx` with look `mystic-night` or `soft-luxe`, strength 0.6–0.8
  3. `add_magic_fx.jsx`: `aura` on the card reveal (x/y = card centre), `motes` at amount 0.4–0.6, optional `mist` 0.3, `sweep` on the reveal beat
  4. `add_kinetic_title.jsx`: hook with `words` or `rise`, serif display, colour `F4E7C5`; CTA "DM for Personal Tarot Reading" with `rise`, smaller, at y about 0.72
  5. `preflight.jsx`, then `queue_render.jsx`, or `aerender` for a saved project
  - Precedent: `~/Claude AI/Tarotoverse/ae/build_reel02.jsx` and `universe01/` are earlier successful AE builds. Reuse their patterns.

## Variation dial (change 2–3 per Reel; log them in reel-history)
- glow colour: gold, moonlight, rose, violet
- hook style: words, typewriter, track
- magic: aura pulse vs slow bloom; motes vs stars
- grade: mystic-night vs soft-luxe
- pacing: slow reveal vs quick browse-then-hold

## After delivery
- Update `docs/reel-history.md`.
- Mark the Reel approved only after the owner says so.
""")
