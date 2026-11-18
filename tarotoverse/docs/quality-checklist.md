# Tarotoverse — Quality Checklist

Run this on the **actual exported file**, not just on the timeline. Use `captureFrame` (it renders through the same pipeline as the export) and `frameSheet`/`probeMedia`/`loudness`/`audioLevels` on the exported MP4.

Look at frames about 390 px wide, which is roughly a phone screen. If any text isn't comfortably readable at that size, the Reel fails. Fix it and re-export.

## Text
- [ ] Every supplied text matches word for word (capitalisation and punctuation exact).
- [ ] The hook is readable from frame 0, or within a few frames.
- [ ] The reveal message starts at the specified time, such as exactly 2.000 s after the card is clearly revealed. Measure the reveal on the export pipeline, frame by frame. A card that is tilted or motion-blurred does not count as revealed.
- [ ] Hierarchy holds: hook > reveal > CTA > watermark.
- [ ] Nothing is clipped, overlapping or awkwardly wrapped. Margins are even and alignment is centred.
- [ ] All text sits inside the safe area: away from the top ~8% and the bottom ~20%, and clear of the right-hand button column near the bottom.
- [ ] Contrast holds on the busiest frame the text sits over.

## Card and reading
- [ ] The real card is unaltered and clearly visible. Effects do not cover its artwork.
- [ ] The flip is clear and satisfying, never hidden by an effect.

## Picture
- [ ] No washed-out, blown-white or milky frames, especially around effects.
- [ ] Skin tones look natural, and the grade is consistent across cuts.
- [ ] No black frames, glitches, jumps at the cuts, or effects switching on or off abruptly.
- [ ] Effect overlays line up with the card throughout. Check several frames while the card is still moving.

## Audio
- [ ] The music is audible, licensed and lines up with the reveal as planned.
- [ ] Every sound effect is actually audible in the export. Compare `audioLevels` against the version without it.
- [ ] Integrated loudness is about −16 to −17 LUFS, and the sample peak is below 0 dBFS (ideally ≤ −1).
- [ ] No abrupt audio cuts: there are fades in and out.

## File
- [ ] 1080×1920, 9:16, frame rate matched to the footage, H.264 (`avc1`), AAC stereo.
- [ ] The duration is as intended.
- [ ] The file is saved where the owner can find it (Downloads), and earlier versions are untouched.

## Lessons learned (technical problems not to repeat)
- **Two preview tools disagree.** `frameSheet` on the timeline can be a few frames off from the export, so measure timing with `captureFrame`. (Tarot 1)
- **Long fades stall.** A long text fade-in left the hook unreadable for about 3 s. (Tarot 1)
- **Sound effects can vanish in the mix.** A quiet effect at 0.45 volume was inaudible in the export. Raising it then pushed the peak to +0.8 dBFS; the fix was to lower the music to 0.8 and set the effect to 0.9. (Tarot 1)
- **Accent volume depends on the song.** "Pixie dust" at 0.9 over "Young And Beautiful" at 0.8 peaked at +0.28 dBFS. Setting the effect to 0.6 and the music to 0.78 gave −1.09 dBFS, with the effect still clearly audible. Re-measure the peak for every new song and effect pair. (Tarot 2)
- **Card outlines can catch the deck.** A tracked outline prompted as just "tarot card" included the deck behind it. Use a specific prompt that describes the card's artwork. (Tarot 1)
- **Letter-by-letter reveals hide timed text.** A range-selector reveal starting at 0% kept "Read Caption" invisible for ~4 frames after its timed start. Timed text must be visible on its first frame; use a focus-pull or scale settle instead. (Universe 01)
- **Licensed Edits songs can't be analysed in place** (`audioLevels`/`audioOnsets` say "no readable source file"). Export a 30 s audition (silent placeholder video + the song, slipped to the section you need), then measure the MP4 with `tools/audio_profile.py` (level/brightness curve + tempo) and `tools/audio_character.py` (percussiveness). (Universe 02)
- **Edits slows to time-outs while After Effects renders.** Finish AE renders first; re-check `elements` after a timed-out add, because the add may have gone through (a duplicate "… 2" clip appeared). (Universe 02)
- **Tiled previews of AE `saveFrameToPng` stills can look milky** (alpha in the PNG). Judge the grade on a full-size frame or the rendered MP4. (Universe 02)
- **A 0.55 accent can vanish under a chorus.** "Blast shimmer" at 0.55 added only ~1 dB; prove audibility with an A/B export (effect muted vs on). (Universe 01)
