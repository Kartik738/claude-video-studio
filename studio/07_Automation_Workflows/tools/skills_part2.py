from skills_part1 import SKILLS, COMMON, TK
SKILLS["influencer-cinematic-edit"] = ("Transform raw influencer footage into premium lifestyle, travel, fashion or personality reels: creative cuts, cinematic framing, seamless transitions, clean grade, engaging pacing. Use when the owner gives multiple raw clips of a person/lifestyle and wants a polished reel.", """
# /influencer-cinematic-edit

## Style principles
- The person is the hero. Prioritise eye contact, genuine expressions, and movement toward the camera.
- **Shot rhythm:** establish (location), then the person, then details (outfit, hands, food, texture), then a reaction, then the hero shot.
- **Seamless transitions only when the footage supports them:**
  - match cut on similar shapes or motion
  - whip pan to whip pan
  - object wipe (something passes the lens)
  - a jump in the same framing for an outfit change
  - speed ramp into the beat
  - Never use a transition pack on every cut.
- **Framing:** reframe to 9:16 with the subject's eyes in the upper third. Use slow push-ins (scale 100 to 104 % over a shot) for life.
- **Grade:** `natural` or `warm-cinematic`, with skin protected (/professional-color-grade).
- **Audio:** remove the original audio if asked. Keep a few natural sound moments (laugh, waves) under the music if they add life.

## Procedure
1. Shot log (as in /cinematic-edit), and rate each clip A/B/C.
2. Choose the music (owner-supplied or Edits library), then build the beat map (/beat-sync-edit).
3. Assemble the A-clips on downbeats. Fill with B-clips. Cut all C-clips.
4. Speed ramps:
   - Edits: `setSpeedCurve`
   - AE: time remap with eased keys
5. Grade, then minimal text (name or location tag, optional hook), then the sound polish.
6. Preflight, then render, then a contact sheet for the owner.

## Avoid
- Over-sharpening
- Beauty smoothing that looks fake
- More than 2 fonts
- Predictable zoom-transition spam
""")
SKILLS["auto-caption-studio"] = ("Create accurate, editable captions with professional line breaks, timing, hierarchy and configurable styles (clean, bold social, karaoke highlight, elegant serif). Use for subtitles, captions, 'add text of what I say'.", """
# /auto-caption-studio

## Transcription options (choose in this order)
1. **Edits app:** `generateCaptions`, then `listCaptionStyles`/`setCaptionStyle`/`setCaptionHighlights`. Fast, styled, and editable in the app.
2. **Premiere Pro:** Text panel › Transcribe sequence › Create captions. Speech-to-Text is included with the subscription. Use when the edit lives in Premiere.
3. **After Effects:** build caption text layers from a transcript with timings (one layer per caption via `add_kinetic_title.jsx`, style `words`, glow off, size 60).

## Caption rules
- Max 2 lines, about 32 characters per line for vertical video. Break at natural phrase boundaries, never between an article and its noun.
- On screen for 1–6 s each. No gaps shorter than 0.25 s (merge them instead).
- Position in the lower-middle safe area (y about 0.62–0.70 on 9:16). Never under the UI.
- Emphasis: highlight 1 keyword per caption at most, in the brand colour.
- **Proofread:** names, brand words (e.g. "Tarotoverse"), numbers, and Hinglish/Hindi spellings. Ask the owner about uncertain words. Don't guess.

## Output
Captions burned into the render (for Reels) and/or an editable caption track. For YouTube, also export an .srt when using Premiere.
""")
SKILLS["auto-shorts"] = ("Convert longer footage (podcast, vlog, talk, long video) into well-framed, professionally paced short-form clips with editorial review points. Use for 'make shorts/reels from this long video', 'clip this podcast'.", """
# /auto-shorts

## Procedure
1. **Transcribe:**
   - Premiere Speech-to-Text, or Edits `transcribeClip`
   - Adobe `media_summarize` only with the owner's OK (cloud service)
2. **Find moments:** self-contained 15–60 s segments with a strong opening line, one clear idea, and an ending or punchline. Score each on hook, clarity, emotion, and standalone sense. Propose the top 3–5 with timestamps and the reason.
3. **REVIEW CHECKPOINT:** the owner picks which ones to make. Never publish or skip this step.
4. **Reframe to 9:16:**
   - Edits: `autoReframe`
   - Premiere: Auto Reframe Sequence
   - AE: scale and position keyframes following the speaker
   - Keep the face in the upper third. Two speakers: cut between them, or use a split screen.
5. **Tighten:** remove dead air and filler words (Edits `findPauses`; Premiere text-based editing › delete pauses). Keep breaths that sound natural.
6. Add a hook title in the first 1.5 s (/kinetic-typography), captions (/auto-caption-studio), and a soft music bed if suitable (−24 to −28 LUFS under speech).
7. Export each clip with the `TV Reels` preset. Name files `<source>_short_<n>_<topic>.mp4`.

## Output
A table of clips (in/out, hook line, length) plus the rendered files.
""")
SKILLS["video-enhancement"] = ("Audit footage for exposure, noise, sharpness, compression artifacts, shake and colour inconsistency, then apply suitable non-destructive fixes. Use for 'improve quality', 'enhance', 'too noisy/shaky/soft', 'make it look HD'.", """
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
""")
SKILLS["render-master"] = ("Choose and apply the right render/export settings for the destination (Reels, Shorts, YouTube, review copy, master, ProRes intermediate, alpha overlay), balancing quality, size and compatibility. Use for 'export', 'render', 'what settings', 'file too big'.", """
# /render-master

## Decision table
| Destination | Tool and preset |
|---|---|
| IG/FB Reels, YT Shorts | AE: `H.264 - Match Render Settings - 40 Mbps` with a 1080×1920 comp. Or Media Encoder **`TV Reels 9x16 - H264 16-24Mbps`**. Or the Edits export. |
| WhatsApp/email review | **`TV Review Copy - H264 6-8Mbps`**, or the AE 5/15 Mbps template |
| Archive master | **`TV Master - H264 40-50Mbps`**, or ProRes 422 HQ if space allows |
| YouTube | AME built-in `YouTube 1080p HD` / `YouTube 2160p 4K` |
| Edit-friendly intermediate | `Apple ProRes 422 HQ` (big files: about 1.8 GB per minute at 1080p) |
| Transparent overlay | AE `High Quality with Alpha` (ProRes 4444) |

## Rules
- Match the comp frame rate to the source. Never export 30 fps footage at 60.
- Render from AE with `queue_render.jsx` (never overwrites) or `aerender`.
- Don't render twice through H.264. Re-edit from the source or ProRes.
- Check free disk space before big renders (`df -h ~`). Keep 15 GB free.
- **Verify every output:** the file exists and size is > 0; duration, resolution and fps are as expected (`mdls`, or `ffprobe` if installed); grab first, middle and last frames.

## Report
File path, size, duration, resolution, and fps, in plain words.
""")
SKILLS["project-preflight"] = ("Check an After Effects/Premiere project or a rendered video before delivery: missing media and fonts, expression errors, text/spelling, comp settings, audio presence/clipping, black frames, aspect ratio, render risks. Use before any export or when the owner asks 'is it ready?'.", f"""
# /project-preflight

## Step 1: project check (After Effects, read-only)
```bash
TV="~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows"
"$TV/bin/ae_run.sh" "$TV/ae_scripts/preflight.jsx" '{{"comp":"<optional comp name>"}}' 120
```
It reports:
- missing footage and fonts
- expression errors
- odd dimensions
- layers starting after the comp end
- audio presence
- every on-screen text string
- render-queue status

## Step 2: content checks (by Claude)
- **Spelling:** proofread every text string it lists. Pay attention to brand names and CTAs.
- **Framing:** grab frames (AE `saveFrameToPng` in a script, or Edits `captureFrame`). Check the safe zones, faces cut off, and stray layers.

## Step 3: render checks
- File exists.
- Duration, size and fps are as expected.
- With ffmpeg installed: `blackdetect` for black or flash frames, `ebur128` for loudness (target about −14 LUFS, peaks ≤ −1), `silencedetect` for silent gaps.
- Visual contact sheet of 1 frame per second.

## Output
A checklist with ✓ / ⚠ for each item, the exact fixes for each ⚠, and a "ready / not ready" verdict.
- Never mark something ✓ that wasn't checked. Say "not checked (reason)".
- Premiere projects: there's no outside scripting. Ask the owner to use File › Project Manager or the Premiere AI Assistant, or check the exported file instead.
""")
SKILLS["project-cleanup"] = ("Organise a project: assets into folders/bins, consistent naming, comps/sequences tidy, without deleting potentially needed media. Use for 'clean up', 'organise', 'my project is messy'.", """
# /project-cleanup

## After Effects
1. Run `status.jsx`. If there are unsaved changes, ask the owner to save first, so the cleanup is its own undoable step.
2. Run `organize_project.jsx`. It sorts items into `01 Comps / 02 Precomps / 03 Footage / 04 Audio / 05 Images & Graphics / 06 Solids` and **never deletes**. Undo with one Cmd+Z.
3. Report the unused footage count (from `preflight.jsx`) and *suggest* AE's File › Dependencies › Remove Unused Footage. Don't run it automatically, and only with the owner's yes after they've seen the list.
4. Suggest File › Dependencies › Collect Files when the project must move to another drive.
5. **Naming:** comps `Brand_Topic_Format_v01` (e.g. `Tarotoverse_LoveMessage_9x16_v03`). Rename only with the owner's OK if other projects reference them.

## Premiere Pro (manual, with guidance)
- Bins: `01 Sequences / 02 Footage / 03 Audio / 04 Graphics / 05 Exports`.
- Use label colours: video = blue, audio = green, graphics = yellow.
- File › Project Manager › Consolidate (copy) to archive. Never "Remove unused" without a backup.

## Disk housekeeping (with permission)
- AE: Settings › Media & Disk Cache › Empty Disk Cache (it was 6.4 GB at the audit).
- Premiere: Media Cache › Delete unused.
- These are caches: safe to clear, and they rebuild automatically.
""")
SKILLS["creative-director"] = ("Review an edit like a creative director and give specific, prioritised improvements to hook, storytelling, pacing, motion, typography, colour, audio and finishing. Use for 'review my video', 'what can be better', 'feedback', or before final delivery of important work.", """
# /creative-director

## Method
1. **Watch:** contact sheet of 1 frame per second, plus frames at 0.5 s, every cut, and the final 2 s. Read the text strings and the audio levels.
2. Score 1–5 on each:
   - **Hook** (stops the scroll in 1.5 s?)
   - **Story** (clear arc?)
   - **Pacing** (any dead spots?)
   - **Visual quality** (framing, focus, colour consistency)
   - **Typography** (readable, hierarchy, alignment, on brand)
   - **Motion and FX** (motivated, tasteful?)
   - **Sound** (mix, loudness, sync)
   - **Ending/CTA** (clear, not desperate)
   - **Platform fit** (specs, safe zones, length)
3. **Top 3 fixes** with the biggest impact, each with an exact action: timecode, what to change, which skill or script does it.
4. **Keep list:** what's working and must not be lost.
5. **Optional:** a bolder alternative idea (one paragraph) if the edit is safe but forgettable.

## Tone
Direct, specific, kind. No vague words like "make it pop". Every note needs a timecode and an action.
""")

import os, sys
out = sys.argv[1]
for name,(desc,body) in SKILLS.items():
    d = os.path.join(out, name); os.makedirs(d, exist_ok=True)
    open(os.path.join(d,"SKILL.md"),"w").write(f"---\nname: {name}\ndescription: {desc}\n---\n{body.strip()}\n{COMMON}")
print(len(SKILLS), "skills written")
