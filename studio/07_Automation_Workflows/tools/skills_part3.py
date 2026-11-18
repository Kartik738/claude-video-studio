from skills_part1 import SKILLS, COMMON
SKILLS.clear()
SKILLS["raw-to-reel"] = ("End-to-end pipeline: raw footage + written brief (+ optional references, branding, required text, music direction) to a finished, QC'd, exported reel. Use when the owner drops footage and says 'make a reel/video from this' without naming a specific skill.", """
# /raw-to-reel (master workflow)

## Intake (ask only what's missing, all in one message)
- Footage location
- Platform and length
- Mood or reference
- Required on-screen text and CTA
- Music: provided / Edits library / none; keep or mute the original audio
- Brand: Tarotoverse uses /tarotoverse-mystical-reel; otherwise ask for the colours and font if they matter

## Pipeline (each step names the skill that owns it)
1. Inspect footage and flag technical issues → /video-enhancement (audit only)
2. Organise clips (AE `organize_project.jsx`)
3. Shot log and structure → /cinematic-edit, or /influencer-cinematic-edit for people/lifestyle
4. Rough cut → **CHECKPOINT A:** show the owner a low-res review render or contact sheet before polishing
5. Refine pacing to the music → /beat-sync-edit
6. Effects → /magical-vfx (only if the brief wants magic)
7. Text and captions → /kinetic-typography, /auto-caption-studio
8. Sound → /sound-design
9. Colour → /professional-color-grade
10. Safe-zone and framing check, then /project-preflight
11. Export → /render-master
12. QC report and **CHECKPOINT B:** owner approval
13. Optional: other aspect ratios → /multi-format-export

## Choosing the engine
- **Edits app:** fastest, social-native captions and music, object tracking.
- **After Effects:** premium typography and VFX, full control.
- You can mix them: build overlays or titles in AE (render with alpha), then finish in Edits, or the reverse.

## Final report (plain language)
What was made, where the file is, the length and specs, what to review, and what couldn't be done (and why).
""")
SKILLS["multi-format-export"] = ("Prepare one edit in several aspect ratios (9:16, 1:1, 4:5, 16:9) by adapting framing, titles and captions per format rather than blind cropping. Use for 'make versions for YouTube/feed/square', 'repurpose for all platforms'.", """
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
""")
import os, sys
for name,(desc,body) in SKILLS.items():
    d=os.path.join(sys.argv[1],name); os.makedirs(d,exist_ok=True)
    open(os.path.join(d,"SKILL.md"),"w").write(f"---\nname: {name}\ndescription: {desc}\n---\n{body.strip()}\n{COMMON}")
print("ok")
