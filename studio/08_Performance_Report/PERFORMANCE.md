# 08 — Performance Report & Settings for an 8 GB M3 MacBook Air

**Honest headline:** no setting turns 8 GB of RAM into 32 GB. These settings stop the Mac from choking and keep the disk from filling. For heavy 4K VFX, the real fix is working at lower preview resolution and pre-rendering.

## Changes Claude made
| Change | Why | Undo |
|---|---|---|
| Emptied After Effects disk cache (6.4 GB) | Your free disk was only about 21 GB | Nothing to undo. The cache rebuilds as you preview. |
| Installed 3 Media Encoder presets | Correct Reels/review/master bitrates | Delete the files in `~/Documents/Adobe/Adobe Media Encoder/27.0/Presets/` |
| No AE/Premiere preference files were edited | Adobe doesn't document safe script access to these. Hand-editing preference files can corrupt them. | – |

## Settings to set once by hand (2 minutes, exact clicks)

### After Effects › Settings (⌘ + ,)
1. **Media & Disk Cache:**
   - Enable Disk Cache ✔
   - **Maximum Disk Cache Size: 10 GB.** The default is much larger and could fill your disk.
   - Click **Empty Disk Cache** whenever space gets tight.
2. **Memory & Performance:**
   - RAM reserved for other applications: **2.5 GB**. That leaves about 5.5 GB for AE; the default reserve is usually too low on 8 GB.
   - **Enable Multi-Frame Rendering ✔**
   - "Performance: Maximum Number of Concurrent Frames": leave on auto.
3. **Display:** Hardware Accelerate Composition, Layer, and Footage Panels ✔ (already on).
4. **Auto-Save:** already on (20 min, 5 versions). AE 27 also recovers after crashes.

### Every AE project (good habits)
- Composition viewer resolution: **Half** for 1080×1920, **Quarter** when using 4K iPhone footage. Turn on **Adaptive Resolution**.
- **Your iPhone footage is 2160×3840 (4K).** For smoother editing, right-click the clip › Create Proxy › Movie, or pre-render graded footage once.
- Pre-render heavy layers (particles, Lumetri on 4K): select the layers, then Layer › Pre-compose, then Composition › Pre-render.
- Close Premiere and Media Encoder while working in AE, and vice versa.

### Premiere Pro › Settings
- **Media Cache:** Automatically delete cache files older than **30 days** ✔. Or set a max size of 10 GB.
- **Memory:** RAM reserved for other apps: **2.5 GB**.
- **Playback:** playback resolution ½ for 4K. Use **proxies** for 4K iPhone footage: Ingest Settings › Create Proxies › "Apple ProRes 422 Proxy".
- **Project › Project Settings › General › Renderer:** Mercury Playback Engine **GPU (Metal)**.
- **Export:** Hardware Encoding for H.264/HEVC (fast and good for social). Use Software Encoding only for the very highest-quality masters.

### Media Encoder
- Settings › General: "Enable parallel encoding" **off** on 8 GB.

## Benchmarks measured on this Mac
See `09_Testing_Results/TESTING.md` for the render times of the three demo reels at 1080×1920.

A before/after benchmark of the settings themselves wasn't possible. The settings above were not applied by script, and AE's previews depend on cache state. The render times are the baseline to compare against later.

## Disk-space plan
- Keep **≥ 15 GB free** at all times.
- Big offenders: AE disk cache, Premiere media cache, ProRes exports, Downloads.
- An external SSD (USB-C) used as the cache and media drive is the single best hardware upgrade for this Mac.
