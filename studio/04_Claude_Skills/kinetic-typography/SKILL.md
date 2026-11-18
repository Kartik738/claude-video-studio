---
name: kinetic-typography
description: Create readable, precisely aligned, elegantly animated on-screen text (titles, hooks, quotes, lists, CTAs) with good hierarchy, spacing, easing and timing. Use whenever a video needs animated text or titles.
---
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

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
