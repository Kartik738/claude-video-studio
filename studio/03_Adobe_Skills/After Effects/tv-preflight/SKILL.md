---
name: tv-preflight
description: Check the project for delivery problems before rendering. Use when asked if a project is ready, before exports, or to find problems.
---
When checking a project, report each item as OK or a warning with the exact fix:
- Missing footage (with path) and missing or substituted fonts.
- Expression errors (comp > layer > property).
- Comp size, frame rate, duration. Odd pixel dimensions are not allowed for H.264.
- Layers starting after the comp end, and gaps where no layer covers the frame (black frames).
- Audio present? Peaks should stay below -1 dB.
- List every text layer's text so spelling can be checked. Flag likely typos.
- Text or key subjects outside the vertical safe zone.
- Render queue items, templates and output paths. Never overwrite an existing file; use _v2, _v3.
Do not change anything during a check unless asked.
