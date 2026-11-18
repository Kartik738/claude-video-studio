---
name: tarotoverse-mystical-reel
description: Create premium mystical tarot Reels for @tarotoverse: elegant typography, restrained magical VFX, luxurious atmospheric light, brand-consistent but creatively different each time. Use for any Tarotoverse / tarot reel request.
---
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

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
