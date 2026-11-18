---
name: tarotoverse-reel
description: Create a new @tarotoverse Instagram Reel from an Instagram Edits project or source video. It analyses the footage, plans a unique on-brand creative treatment, then grades, adds typography, CTA and watermark, magical effects and licensed music, verifies the export at phone size, and saves the decisions. Use whenever the owner asks to edit or create a Tarotoverse reel or video (e.g. "edit Tarot 2", "use our Tarotoverse editing system").
---

# /tarotoverse-reel — New Reel workflow

Goal: a Reel that is unmistakably Tarotoverse, and creatively right for *this* reading — never a copy of the last one.

## Input the owner may give
- **Edits project name** (e.g. "Tarot 2") or a path to the source video.
- **Opening text**, **reveal text** (e.g. "Read Caption"), and optionally a theme, the card's meaning, or a CTA override.
- **Defaults when not given:**
  - CTA `DM for Personal Tarot Reading`.
  - Watermark `@tarotoverse`.
  - Reveal text appears exactly 2 s after the card is clearly revealed, if the owner asks for timed reveal text.
- **Missing details:** if the reading's meaning is essential and can't be inferred from the footage or the owner's words, ask only for that. Don't ask about anything the brand docs already settle.

## Step 0 — Load the system (always)
Read `CLAUDE.md`, `docs/tarotoverse-brand.md`, the last 3–5 entries of `docs/reel-history.md`, `docs/quality-checklist.md` and `edits-reference.md` (next to this file).
Then write down which treatments recent Reels used, so you can avoid repeating them by default.

## Step 1 — Locate and protect
1. Check that the Edits connection is live (`appState`, `projects`). If the Edits tools aren't loaded, search for them with ToolSearch (keyword "metapilot").
2. Find the project. Duplicate it, rename the copy `<Name> — Tarotoverse Edit`, and work only on the copy. Never touch the original.
3. Inspect the copy: `tracks`, `elements`, `getCanvas`, and `clipMetadata` (source resolution, fps, duration, and the source file path).

## Step 2 — Analyse the footage
- Make contact sheets with `frameSheet` over the whole clip. Note framing, light and white balance, background clutter, hands, the card's position, existing audio (`audioLevels`), and any speech (`transcribeClip`).
- Find the **flip start** and the **clear-reveal frame** (the card flat, sharp and readable). Measure the reveal on the edited timeline with `captureFrame`, frame by frame (1/30 s steps), *after* pacing changes.
- Identify the card if its name is printed or clearly recognisable. Never invent its meaning.

## Step 3 — Creative brief (write it before editing)
Decide and state, briefly:
- **Emotional identity:** for example romantic, mysterious, hopeful, intense, comforting, magical, reflective or empowering.
- **Visual identity:** warm or cool, palette, contrast, glow colour and character.
- **Motion identity:** push-in, pull-out, hold, speed ramps, or natural pace.
- **Audio identity:** the music mood and any reveal accent.
- **Typography layout:** where the hook, the reveal block and the watermark sit in *this* footage.
- **Effect motif:** one main idea, chosen for the meaning (see the brand doc's examples).
- **What's different** from the last Reels, and why.

Reuse a past approach only if it genuinely suits this footage best, and say so.

## Step 4 — Edit
Use the recipes in `edits-reference.md`.
1. **Pacing.** Trim dead space, tighten the start, and speed up idle browsing (around 1.3–1.6×). Keep the flip at natural speed.
2. **Colour.** Apply `setColorGrade` to every clip piece (most sliders run −1…1; saturation 1 is neutral). Compare against the original frames.
3. **Motion.** Use `setTransformKeyframes` for gentle push-ins or pull-outs. Keep scale continuous across cuts.
4. **Typography.** Use the brand type system:
   - The hook visible from frame 0.
   - The reveal text and CTA as one composed block.
   - Contrast panels behind the text where the background is busy.
5. **Magic.** Build the chosen motif with custom overlays (`tools/`) and/or built-in effects that pass a test frame. Test every effect on a real frame before committing. Reject anything that washes out the picture, hides the card, or looks cheap.
6. **Music.**
   - Research current trends (WebSearch, last 7–14 days, cited sources).
   - Check that the candidates are in the Edits library (`listMusicTracks`).
   - Pick by emotional fit, then trend.
   - Add the track with `addSongToComposition`, slide it with `slipClip` to the song's best section, and line a downbeat up with the reveal (`beatMarkers`).
   - Add fades, and mute the room hiss.
7. **Accent sound (optional).** Use a subtle sound effect at the reveal (`searchSoundEffects`), then verify it in the export.

## Step 5 — Verify, fix, export
- Export HEVC into the Edits container, convert it to H.264, and copy it to `~/Downloads/Tarotoverse_<Project>_<Version>.mp4`. See `edits-reference.md`.
- Run **every** item in `docs/quality-checklist.md` on the exported file. Fix the problems, re-export, and check again.
- Never overwrite earlier versions. Use a new filename for each version.

## Step 6 — Deliver and record
- Send the file, open it in Finder (`open -R <path>`), and report in plain language:
  - the text timestamps;
  - the fonts and colours;
  - the effects;
  - the music, with its trend evidence, or an honest statement that there isn't any;
  - the checks performed;
  - any limitations.
- Add a **Pending** entry to `docs/reel-history.md` using its template.
- When the owner approves, mark the entry **Approved** and record their feedback. Route each piece of feedback by type, as described in `CLAUDE.md` under "Learning from feedback".
- Copy approved exports into `references/approved/` and update its README.
- Never publish to Instagram without explicit approval.

## Content types — adapt, don't assume romance
Love and feelings, reconciliation, no-contact, career, finances, spiritual guidance, healing, manifestation, yes/no, pick-a-card and collective readings each need their own mood. Start from the brand doc's tone table and let the actual footage and words decide.

For pick-a-card readings, make each pile or option clearly readable, and give it a label only if the owner supplies one.
