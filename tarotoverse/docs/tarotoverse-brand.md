# Tarotoverse — Visual Identity

This guide comes from the first approved Reel (Tarot 1, Nov 2026) and from what failed along the way.
It separates **permanent brand traits** from **choices that only suited Tarot 1** and **things that should change every time**.

---

## 1. Permanent brand characteristics (keep in every Reel)

### Typography system

| Role | Font (Edits id) | Edits size* | Colour | Treatment |
|---|---|---|---|---|
| Opening hook | Cormorant SemiBold (`Cormorant-SemiBold`) | 38–42 | Ivory `#FFF8EC` | On a soft rounded navy panel |
| Reveal message | Cormorant SemiBold | 36–40, slightly smaller than the hook | Ivory `#FFF8EC` | Same panel style as the hook |
| CTA | Manrope SemiBold (`Manrope-SemiBold`) | 16–18 | Champagne `#F3E3BE` | Directly under the reveal message, on the same panel |
| Watermark | Manrope SemiBold | ~11 | Ivory, 80% opacity | Small, near the top centre |

\*Edits' text-size scale. Size 40 renders at roughly 80 px on a 1080×1920 frame. The hook should cover roughly 75–80% of the frame width.

- **Pairing logic:** an elegant high-contrast serif for emotion and messages, plus a clean geometric sans-serif for information (CTA, handle). Keep this pairing even if the specific fonts change.
- **Weight:** SemiBold or heavier for primary text. Never thin, hairline or script fonts for primary text.
- **Contrast backing (proven):**
  - A rounded navy panel `#0B1233` at about 55% opacity, sitting *behind* the text (moved to layer 1).
  - It keeps text readable over flowers, crystals and bright cards while the footage stays visible.
  - If a Reel's background is already calm and dark, a lighter backing is fine — but test it on the busiest frame.
- **Minimum reading time (owner, Nov 2026 — "the text disappeared too quickly"):** every message must stay fully readable long enough to read twice on a phone. Starting points: a 1–2 word hook ≥ 1.5 s; a short line ≥ 2.2 s; a 6–9 word key message ≥ 5 s; "Read Caption" + CTA ≥ 3 s. Entrances ≤ 0.4 s, and the whole sentence appears at once (no word-by-word builds for key messages). Cut footage, never reading time.
- **Hook timing:** fully visible from the very first frame. In Edits, entrance animations stretch across the text's whole duration, so long fades hurt readability in the first two seconds.
- **Closing block (owner, 2026-11-15):** "Read Caption" (with an optional small line "for your full message") plus `DM for Personal Tarot Reading` ends every reading video the owner supplies. A short on-screen message from the card may come before it, together with one engagement prompt framed as claiming the message (e.g. "Double tap to claim it").
- **Colourful type (owner, 2026-11-15 — "make it more beautiful, colourful"):** the owner likes key words in iridescent gradients taken from the card's own palette (gold foil, rose, lavender, periwinkle), with a slow shimmer, against ivory supporting words. Keep the gradients light and high-contrast on the navy panel. Never use dark or neon gradients, and never colour every word.
- **Reveal-message entrance:** a short 0.5 s fade (a split "fade piece" followed by a static piece), with the panel fading in alongside it.
- **Layout logic:** text sits in calm areas, away from hands and card art. In Tarot 1 that was the upper-middle band (y ≈ 0.27). For the reveal, text went *above* the card rather than on it, because readability beat placing it on the card.

### Colour philosophy

- **Natural first:** true skin tones, the card's printed colours untouched, no heavy filters.
- **Signature finish:**
  - Slightly lowered exposure and highlights, so whites aren't harsh.
  - Gentle contrast.
  - A touch of warmth.
  - Saturation just under neutral; vibrance just over.
  - Deep jewel-like backgrounds.
- **Avoid:** purple filters, crushed blacks, oversaturation, milky washes.

### Magic philosophy

- Magic should feel like **light**, not glitter: warm gold glows, soft motes, small starlight glints.
- Effects must **follow the subject** (the card) or the air around it. They never cover text or the card's artwork.
- The **reveal is the emotional peak.** Concentrate the effect there and sync it to a music beat.
- Restraint is the brand. One well-judged effect beats three competing ones.

### Sound

- Music drives the emotion. The original room audio is usually muted when it's only hiss.
- **Tempo (owner, Nov 2026 — the Universe 01 song "was too fast"):** for love, spiritual and emotional readings, start from slow, gentle tracks around 60–85 BPM without a driving beat. Let the music's swell, not its tempo, carry the emotion, and line the swell up with the key message.
- **Reveal accent:** a delicate sound effect (Tarot 1 used "Magic chime") is welcome when it's subtle. It must be audible in the export and must not clip.
- **Loudness target:** around −16 to −17 LUFS, with peaks below 0 dBFS (ideally ≤ −1).

### Export

- 9:16, 1080×1920, H.264 MP4, frame rate matched to the footage (Tarot 1 was 30 fps), AAC stereo.
- Edits exports HEVC only, so convert with `avconvert -p Preset1920x1080`. See `edits-reference.md`.

---

## 2. Choices that suited Tarot 1 only (don't copy by default)

These worked for *that* footage and reading ("Are they thinking about you ?", Page of Swords, navy cloth, pink flowers, crystals):

- **Gold** as the glow colour. It matched the card's gold border and the warm daylight.
- **Pacing:** browsing sped up to 1.5×, the flip kept at real speed, about 3 s held on the card at the end.
- **Motion:** a slow push-in from 1.0× to 1.06× toward the cards.
- **Music:** JENNIE, "Less than a Lover" (dreamy and uncertain, to match an "are they thinking of me" hook), starting from the 0:33 highlight.
- **Effects:** an edge halo on the card that peaks on the downbeat; 8 drifting gold motes in the anticipation section; 2 corner glints.
- **Layout:** both the hook and the reveal panel in the upper-middle band.

## 3. What should change from Reel to Reel

Decide these fresh each time, from the footage and the reading's meaning:

- **Emotional identity:** romantic, mysterious, hopeful, intense, comforting, magical, reflective or empowering.
- **Palette and light:**
  - Warm (gold, amber) for love, hope or abundance.
  - Cool (silver, moonlight blue) for mystery, reflection or healing.
  - Rose for tenderness or reconciliation.
  - Deep and contrasty for intensity or no-contact.
- **Effect motif (examples):**
  - Moonlight rim glow.
  - Rising embers.
  - Slow silver dust.
  - A soft light sweep across the card.
  - A gentle bloom on the reveal.
  - Faint constellation glints.
  - A breathing aura.
  - None at all, if the footage is strong enough on its own.
- **Motion:** push-in, pull-out, a static hold, speed ramps or natural pace — follow the hands.
- **Music:** pick for the meaning. Heartbreak shouldn't get celebration music.
- **Layout:** upper band, lower band (above the Instagram UI), beside the card, or two-tier. Keep the hierarchy and readability rules fixed.

## Tone reference by reading type

| Reading type | Starting point (adapt to the footage) |
|---|---|
| Love / someone's feelings | Warm or rose light, dreamy or romantic music, intimate pacing |
| Reconciliation | Soft rose and gold, hopeful-nostalgic music, gentle slow reveal |
| No-contact | Cooler, moodier contrast, suspenseful or melancholic music, restrained glow |
| Career / finances | Clean gold or amber, confident and uplifting music, crisper pacing |
| Spiritual guidance | Moonlit silver, ethereal or ambient music, slow drift |
| Healing | Soft pastel or dawn light, peaceful music, gentle breathing aura |
| Manifestation | Bright gold sparks, uplifting build, energetic reveal |
| Yes/no | A clear, decisive reveal accent, punchier timing |
| Pick-a-card / collective | Clear piles or options, inviting music, a readable layout for each choice |
