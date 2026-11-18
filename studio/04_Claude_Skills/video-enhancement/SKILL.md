---
name: video-enhancement
description: Audit footage for exposure, noise, sharpness, compression artifacts, shake and colour inconsistency, then apply suitable non-destructive fixes. Use for 'improve quality', 'enhance', 'too noisy/shaky/soft', 'make it look HD'.
---
# /video-enhancement

**Honesty rule:** software can't add detail that isn't there. Don't over-sharpen, invent texture, plastic-smooth skin, or upscale without need.

## Audit (per clip)
| Problem | How to spot | Fix (native tools) |
|---|---|---|
| Under/over-exposure | frame grab, histogram | Lumetri Exposure/Highlights/Shadows |
| White balance cast | whites look blue or orange | Lumetri Temperature/Tint |
| Noise (low light) | grainy shadows | AE: Remove Grain (careful, slow). Premiere: Lumetri denoise-lite. Lift exposure less. |
| Softness | edges mushy at 100 % | Unsharp Mask (Amount 30–60, Radius 0.8–1.2) or Lumetri Sharpen ≤ 15 |
| Shake | wobble | AE/Premiere Warp Stabilizer (Smooth Motion, 3–8 %; Subspace only if needed) |
| Banding / compression | stepped gradients in sky or glow | Add Grain (subtle, 0.2–0.4) and render at a higher bitrate |
| Mixed frame rates | stutter | conform or interpret footage to the comp fps; use Frame Blending only for slow-mo |
| Low resolution | < 1080 wide for a 1080 output | scale with Detail-preserving Upscale ≤ 150 %. Tell the owner the limit. |

## Procedure
1. Audit, then report findings in plain words, then propose fixes (most important first).
2. Apply fixes on duplicate or adjustment layers so the original is untouched.
3. Show before/after stills at 100 % crop.
4. Render a review copy and check for new artefacts: halos, warping, flicker.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
