# 07 — Automated Editing Workflows

Each workflow is a Claude skill. Claude runs the steps it can automate and stops at **review checkpoints** for your OK. Technical commands are in `TOOLKIT.md`.

| # | Workflow | Start it with | Automated | Your checkpoints |
|---|---|---|---|---|
| 1 | Raw footage → professional reel | `/raw-to-reel` | inspect, organise, rough cut, titles, magic FX, grade, safe-zone check, preflight, export, QC report | rough cut, final approval |
| 2 | Magical tarot reel | `/tarotoverse-mystical-reel` | the same, using Tarotoverse brand rules, `card_halo.py`/`light_motes.py` or AE FX, and a variation log | hook text, final approval, "approved" status |
| 3 | Influencer video edit | `/influencer-cinematic-edit` | shot rating, beat map, sequencing, mute original audio, grade, titles, export | clip choice if unclear, final |
| 4 | Batch social formats (9:16 / 4:5 / 1:1 / 16:9) | `/multi-format-export` | variant comps (fit + blurred fill), renders | **framing of each variant** (an automatic crop is only a starting point) |
| 5 | Automated QC | `/project-preflight` | missing media/fonts, expression errors, text list for spelling, audio, dimensions, render queue. With ffmpeg: black frames, loudness, silence, contact sheet. | anything flagged ⚠ |

## What is genuinely automated today (tested 2026-11-14)
- **After Effects (via AppleScript → ExtendScript), tested:**
  - creating reel comps from footage
  - grades
  - 5 magical effects
  - 4 title styles
  - aspect variants
  - preflight
  - frame grabs
  - render queue and render
- **Edits app:** full reel editing via the metapilot MCP (used in earlier Tarotoverse reels).
- **ffmpeg:** footage and render inspection, contact sheets.

## What is NOT automated (and the workaround)
| Gap | Why | Workaround |
|---|---|---|
| Premiere Pro editing | Adobe gives no outside scripting door | Build in AE or Edits. For Premiere, Claude writes click-by-click steps, or you use Premiere's AI Assistant. |
| Judging taste ("is this beautiful?") | Needs human eyes | Claude shows frame sheets and renders at each checkpoint |
| Music licensing | Legal judgement | Only use your own, Edits library, or Adobe Stock tracks |
| Plugin installs | Need your Mac password | Claude opens the official installer; you click and type the password |

## Adding a new automation
1. Write a new `.jsx` in `ae_scripts/`. `lib.jsx` helpers are preloaded; use `report()` to send results back.
2. Test it on a throwaway project.
3. Add a row to the table in `TOOLKIT.md`.
