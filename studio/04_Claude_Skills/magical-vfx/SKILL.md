---
name: magical-vfx
description: Design restrained, believable magical/ethereal visual effects: glow, light motes, aura, mist, light sweeps, sparkles. Use for mystical, spiritual, tarot, fantasy or dreamy looks, or when the owner says 'add magic', 'glow', 'particles'.
---
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

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
