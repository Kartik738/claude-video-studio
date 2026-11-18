---
name: professional-color-grade
description: Analyse footage and apply controlled cinematic colour correction and grading that protects natural skin tones and detail. Use for 'colour grade', 'make it look cinematic', 'fix colours', 'match shots', 'too dark/bright/orange'.
---
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

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
