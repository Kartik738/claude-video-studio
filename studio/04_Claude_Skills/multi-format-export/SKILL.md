---
name: multi-format-export
description: Prepare one edit in several aspect ratios (9:16, 1:1, 4:5, 16:9) by adapting framing, titles and captions per format rather than blind cropping. Use for 'make versions for YouTube/feed/square', 'repurpose for all platforms'.
---
# /multi-format-export

## Procedure
1. The master edit should be the format the owner cares about most (usually 9:16).
2. **After Effects:** select the master comp, then run `make_aspect_variants.jsx` `{"ratios":["4:5","1:1","16:9"]}`.
   - Each variant gets a blurred fill plus the fitted master.
   - This is a starting point, not the final framing.
3. **Adapt each variant:**
   - **4:5 and 1:1:** usually crop-in rather than fit. Set the "Master (fit)" layer scale to fill the frame, then keyframe its position to follow the subject. Re-check that the text isn't cut.
   - **16:9:** blurred sides rarely look premium. Prefer re-laying out the titles (left or right third) and using the full-width background footage, if it was shot wide.
   - Captions: on square or horizontal formats, move them to the lower third and resize to about 0.8×.
4. **Edits app alternative:** `setAspectRatio` plus `autoReframe` per copy of the project.
5. Render each with /render-master (Reels preset for vertical; YouTube 1080p for 16:9).
6. Grab one frame per variant at the same timecode, so the owner can compare them side by side.

## Quality checks
- No subject heads cut off.
- No text outside its frame.
- No black bars unless intended.
- File names include the ratio: `_9x16`, `_4x5`, `_1x1`, `_16x9`.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
