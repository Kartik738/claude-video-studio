# Driving After Effects 2027 (Mac) — field notes (Tarot 2)
- Run scripts through `osascript … DoScript "$.evalFile(new File('<path>.jsx'))"`. `DoScriptFile` with a path containing spaces silently fails and returns 1.
- Write logs by opening and closing the file for every line, so a script that aborts still leaves a trail.
- Close the open project with `DO_NOT_SAVE_CHANGES` before `newProject`, or a save dialog blocks every later script.
- "ADBE Shadow/Highlight" can't be added by script. Guard each effect with `canAddProperty`; an invalid matchName can abort the whole script.
- Glow on a white card: keep the threshold at 85 or more and the intensity at 0.25 or less.
- `comp.saveFrameToPng(t, File)` gives quick preview stills.
- Render with `aerender -project … -comp … -OMtemplate "H.264 - Match Render Settings - 40 Mbps" -output …mp4` (about 2.5 minutes for 11 s). AE can't use Instagram's licensed music, so add the song in Edits afterwards.

# Driving Instagram Edits (Mac) — field notes

The Edits Mac app is controlled through the `metapilot-native` MCP server (tools named `mcp__metapilot-native__*`).
The tools available change with the app screen: home vs editor.
Everything below was verified on Tarot 1 (Nov 2026).

## Connection and projects
- `appState`, `projects`, `duplicateProject` (home screen only), `renameProject`, `openProject`, `saveProject`, `closeProject`.
- Duplicating requires the home screen. Run `saveProject` and then `closeProject` first.
- Tools sometimes disconnect and reconnect between screens. Reload them via ToolSearch when they're missing.
- A rare `alreadyEditing` error on add calls is a race condition. Retry that single call.

## Conventions
- Canvas coordinates are normalised 0–1, with the origin at the top left. Times are in timeline seconds.
- Use `getCanvas` for size and fps. Tarot 1 was 1440×2560 and initially 60 fps; set it with `setFrameRate` to match the footage.

## Timing truth
- **`captureFrame` matches the export.** `frameSheet` on the timeline, and on a clip id, can be a few frames off.
- **Measure all critical timing with `captureFrame`**, especially the reveal and when text appears.
- `frameSheet` with a `path` to an exported MP4 is reliable for the final review.

## Cutting and speed
- `splitAt` (timeline times) and `setSpeed`.
- `trimClip` on **video**: on the end side, a positive `delta` shortens the clip and a negative one lengthens it.
- `trimClip` on **text** is unreliable. Delete the text and re-add it with an exact `addText` duration instead.
- `trimClip` on **photo overlays**: on the end side, a positive delta shortens. Overlays default to 3 s.

## Colour
- `setColorGrade`: most sliders run −1…1, but **saturation has 1 = neutral** (0 turns the picture black and white).
- Apply the grade to every clip piece; it carries over when a clip is split.
- Tarot 1 grade:
  - exposure −0.1
  - highlights −0.25
  - shadows −0.05
  - contrast +0.1
  - whites −0.1
  - blacks −0.04
  - temperature +0.06
  - tint +0.03
  - saturation 0.95
  - vibrance +0.08
  - clarity +0.06

## Motion
- `setTransformKeyframes`: every keyframe needs `time` (relative to the clip), `x`, `y` and `scale`.

## Text
- `addText(text, atSeconds, duration)`, `setTextFont` (catalog id), `setTextStyle` (size, colour, alignment), `setTextPosition`, `setTextAnimation`.
- `editText` accepts `\n` for line breaks.
- **Animations stretch across the whole text duration.**
  - Use `none` for hooks.
  - For a short fade, add a 0.4–0.5 s piece with `fadeIn`, followed by an identical piece with `none` for the remaining time.
- **Text box width is limited (Tarot 2).** At size ≈40, a line of about 15 or more characters wraps on its own (e.g. "What's coming next" broke after "coming"). Put explicit `\n` breaks into lines of about 12–14 characters rather than shrinking the font below the hook range.
- **Glow and push-in (Tarot 2).** `card_halo.py` masks follow the source frame, not the transform. If the clip has a push-in, scale each segment's mask by the clip scale at that moment, or the glow drifts off the card edge.
- `applyTextPreset` needs `selectTool("textPresets")` first. "Secret society" adds a hard-shadow effect.
- Useful fonts:
  - `Cormorant-SemiBold`
  - `Manrope-SemiBold`
  - `PlayfairDisplay-Regular`
  - `BodoniModa9pt-Bold`
  - `InstrumentSerif-Regular`
  - `LaLuxesSerifPro-Medium`
  - `DMSans18pt-SemiBold`

## Panels and overlays
- `addShape(x, y, w, h, color, opacity, cornerRadius≈56, startSeconds, duration)` creates a new top layer.
  - Then run `moveToLayer(id, 1)` so the shape sits *behind* the text.
- To fade a panel in, stack 3–4 shapes of rising opacity, each about 0.1 s long.
- `addOverlay(path, startSeconds, x=0.5, y=0.5, scale=1)` places a full-frame 1080×1920 transparent PNG exactly.
- Files must sit inside the app's sandbox: `~/Library/Containers/com.burbn.basel.mac/Data/Documents/…`. The app **cannot read `~/Downloads`**.

## Built-in effects (`applyEffect`, `updateCatalogItem` for intensity)
- **Rejected on Tarot 1:**
  - `video_light_ray` — milky wash, and intensity made no visible difference.
  - `video_exposure_pulse` — blew the card out white.
  - `video_dust` — looked like dirt.
  - `video_sparkle` — not visible.
- Untested so far, but worth a test frame: `video_blur_fade_in`, `video_soft_flicker`, `video_film_grain`, `video_chromatic_pulse`, `video_bling`.
- Effects apply to whole clips. Split first to limit an effect to a moment.
- Subject effects (`applySubjectEffect`, e.g. `video_cutout_outer_glow`) need a CutoutMaskStore. The masks from `trackObject` are **not** accepted.

## Custom magic (proven approach)
- Track the card with `trackObject(id, prompt, sampleEvery, saveMasks=true)`.
  - Use a **specific prompt** (e.g. "illustrated tarot card with a woman holding a sword"), or the outline will include the deck.
  - The result gives `maskDirectory`, holding PNGs named by **source milliseconds** (e.g. `010167.png`) for the whole source file.
  - The masks are already framed like the canvas.
- Generate overlays with `tools/card_halo.py` and `tools/light_motes.py` (see `tools/README.md`), add them with `addOverlay`, then trim each one.
- **Timeline ↔ source:** source = timeline + offset. The offset comes from the clip's `startTime` and `sourceInPoint` (via `getElement`).

## Music and sound effects
- `getMusicTrackList("Trending")` — Edits' own trending tab. It may be regional.
- `listMusicTracks(query, license="any")` — check that a track exists and whether it's licensed.
- `addSongToComposition(track, audioAssetId)`, then `slipClip(id, delta)` to choose the section and `beatMarkers` to read the beat times. Use `setFade` and `setVolume`.
- `licensedMusicStatus` confirms availability.
- Sound effects: `searchSoundEffects`, `seek` to the time, then `addSoundEffect(id)`.
  - **Check that each effect is audible in the export.** "Magic chime" needed volume 0.9 with the music at 0.8 to stay audible without clipping.

## Export
1. `setExportSettings(resolution "1080x1920", resolutionType "HD", frameRate <match>, codec "hevc", quality "high", aspectRatio "nineBySixteen", dynamicRange "sdr")`. HEVC is the only codec offered.
2. `export(path inside the container Documents)`, then `wait` and `exportStatus`. An 11-second Reel takes about 50 s.
3. Convert and deliver:
   ```bash
   avconvert -s "<container>/X_hevc.mp4" -o "<scratch>/X.mp4" -p Preset1920x1080 --replace
   cp "<scratch>/X.mp4" ~/Downloads/<Final name>.mp4
   ```
4. Check that the result is H.264: `xxd -l 4000 file | grep -o avc1`.
5. Verify with `probeMedia`, `loudness` and `frameSheet` on a copy inside the container, since the app can't read Downloads.

# More AE / tooling notes (Universe 01)
- **SAM masks from `trackObject` hold the mask in the red channel only.** Read channel 0; converting to greyscale drops 255 to 76 and breaks thresholds.
- Short, plain prompts track better: "white card with red face painting" worked; a long descriptive prompt returned no objects.
- **Adding an effect invalidates earlier property handles in AE scripts** (e.g. a shape's Size fetched before adding a Drop Shadow). The script then stops silently. Re-fetch properties after `addProperty`.
- Don't remove all Time Remap keys in a loop; just set new keys.
- `aerender` stopped at frame ~57 and left a 0-byte file. Rendering through the open AE app (`renderQueue.render()`, see `ae/universe01/render_gui.jsx`) worked.
- ffmpeg/ffprobe are now installed (`/opt/homebrew/bin`, built without `drawtext`). `swiftc` is still broken.
- AE render through the GUI (`ae/universe02/render_gui.jsx`, set `$.global.OUTNAME` and optionally `$.global.TEMPLATE`, e.g. "High Quality" = ProRes 422) takes ~10–15 min for 14 s with 4K source + PNG sequences. The osascript call times out after ~2 min but the render continues; wait for "done" in `render_log.txt`.
- Final delivery used the AE H.264 picture with the Edits mix muxed in by ffmpeg (`-c copy`), avoiding the HEVC re-encode.
