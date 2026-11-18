# Claude ↔ Adobe Toolkit (reference for all editing skills)

Root: `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows`
Shortcut below: `$TV` = that folder.

## 1. How Claude drives After Effects (tested 2026-11-14 on AE 27.0)

```bash
"$TV/bin/ae_run.sh" "$TV/ae_scripts/<script>.jsx" '<json args>' [timeout_seconds]
```

- AE must be open. The script runs in the project that is currently open, and it prints whatever the script `report()`s.
- AE cannot read scripts from system temp folders. Keep `.jsx` files inside `$TV` (or a project folder under `~/Claude AI`).
- `osascript … DoScript` returns `0` when the script ran and `1` when it was refused. If you get `1` or a timeout, AE is busy, a dialog is open, or the path is unreadable.
- **Safety rule:** before any script that *changes* things, run `status.jsx`. If `unsaved changes: true` on a project the owner did not ask you to edit, STOP and ask them to save it. Never call `app.newProject()` or close a project over unsaved work.
- Every editing script wraps its work in an undo group, so one Cmd+Z in AE reverts it.

| Script | Changes project? | ARGS (JSON) |
|---|---|---|
| `status.jsx` | no | – |
| `preflight.jsx` | no | `{comp?}` – missing media/fonts, expression errors, text list for spell-check, audio, render queue |
| `list_templates.jsx` | no | – (needs ≥1 render-queue item) |
| `organize_project.jsx` | moves items into folders; never deletes | – |
| `new_reel_comp.jsx` | adds comp | `{name,w,h,fps,dur,footage:[paths],music,muteOriginal,fit}` |
| `add_kinetic_title.jsx` | adds text layer | `{text,style:rise/track/words/typewriter,t,dur,font,size,color,y,glow,tracking}` |
| `add_magic_fx.jsx` | adds FX layer | `{fx:motes/mist/aura/sweep/stars/saber,t,dur,color,amount,x,y,target}` (saber = Video Copilot Saber glow on the text layer named in target) |
| `add_grade.jsx` | adds adjustment layer | `{look:natural/warm-cinematic/mystic-night/teal-gold/soft-luxe,strength}` |
| `make_aspect_variants.jsx` | adds comps | `{ratios:["1:1","4:5","16:9"],long}` |
| `queue_render.jsx` | adds RQ item | `{comp,out,om,rs,render:false}` – never overwrites; adds `_v2` etc. |

Headless render of a saved project (no UI needed):
```bash
"/Applications/Adobe After Effects 2027/aerender" -project "/path/file.aep" -comp "Comp Name" \
  -RStemplate "Best Settings" -OMtemplate "H.264 - Match Render Settings - 40 Mbps" -output "/path/out.mp4"
```
AE output-module templates that exist: `H.264 - Match Render Settings - 5/15/40 Mbps`, `High Quality`, `High Quality with Alpha`, `Lossless`, `Lossless with Alpha`, `Alpha Only`, `TIFF Sequence with Alpha`, `AIFF 48kHz`.

## 2. Edits app (Instagram "Edits", via the metapilot-native MCP)
Fast phone-style Reel editing with captions, music library, beat markers, auto-reframe, object tracking. The proven Tarotoverse pipeline uses it. See `~/Claude AI/Tarotoverse/.claude/skills/tarotoverse-reel/edits-reference.md` for its quirks.
Choose **Edits** for speed and social-native captions and music; choose **After Effects** for premium typography, compositing, and custom FX.

## 3. Photoshop / Illustrator
Both accept `osascript -e 'tell application "Adobe Photoshop 2027" to do javascript …'` (they ship a scripting dictionary). This is untested in this setup. Test it on a throwaway document first.

## 4. Premiere Pro 2027
It has no AppleScript/ExtendScript entry point from outside. Options:
- (a) Premiere's own AI Assistant, with the custom skills in `03_Adobe_Skills`. Uses Adobe generative credits.
- (b) A third-party UXP bridge (MCP). Not installed; it needs the owner's approval.
- (c) Build in AE, or hand the owner an exact click-list.

## 5. Media Encoder presets (installed)
Find them in Media Encoder › Preset Browser › User Presets:
- `TV Reels 9x16 - H264 16-24Mbps`
- `TV Review Copy - H264 6-8Mbps`
- `TV Master - H264 40-50Mbps`

Built-ins to use:
- YouTube 1080p HD / 2160p 4K
- Apple ProRes 422 HQ (intermediate)
- Apple ProRes 4444 with alpha (transparent overlays)

## 6. Footage analysis
- `mdls -name kMDItemPixelWidth -name kMDItemPixelHeight -name kMDItemDurationSeconds -name kMDItemCodecs file.mov` works with no installs.
- `ffprobe`/`ffmpeg` are NOT installed yet (pending owner approval via Homebrew). Once installed:
  - black frames: `ffmpeg -i f -vf blackdetect=d=0.1:pix_th=0.1 -an -f null -`
  - loudness: `ffmpeg -i f -af ebur128 -f null -`
  - silence: `-af silencedetect=n=-35dB:d=0.4`
  - scene cuts: `-vf "select='gt(scene,0.3)',showinfo"`
  - contact sheet for visual review: `-vf "fps=1,scale=360:-1,tile=6x3"`

## 7. Delivery targets (use in every skill)
| Target | Size | FPS | Codec / bitrate | Audio | Notes |
|---|---|---|---|---|---|
| IG / FB Reels, YT Shorts | 1080×1920 | 30 (or source 24/25/30) | H.264 High, VBR 16–24 Mbps | AAC 48 kHz, −14 LUFS-ish, peaks ≤ −1 dBTP | keep text inside safe zone (top 14%, bottom 20%, right 12%) |
| Feed 4:5 | 1080×1350 | same | same | same | |
| YouTube long-form | 3840×2160 or 1920×1080 | source | YouTube 2160p/1080p preset | AAC 320, −14 LUFS | |
| Review copy | source | source | 6–8 Mbps | AAC | small for WhatsApp |
| Intermediate | source | source | ProRes 422 HQ | PCM | for round-trips |
| Overlay with alpha | source | source | ProRes 4444 with alpha | – | |

## 8. Hardware reality (MacBook Air/Pro M3, 8 GB RAM, ~21 GB free disk)
- 4K comps with heavy effects will preview slowly. Work at Half/Quarter resolution, and pre-render heavy FX layers.
- Keep at least 15 GB free disk. AE's disk cache was 6.4 GB at the audit.
- Don't run AE, Premiere, and Media Encoder renders at the same time.
