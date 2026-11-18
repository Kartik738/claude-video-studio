# 01 — System Audit (taken 2026-11-14, before any changes)

## Hardware
| Item | Value | What it means for editing |
|---|---|---|
| Computer | MacBook Air, Apple M3 (8-core CPU, 8-core GPU, Metal 3) | Apple Silicon. Adobe apps run natively, and hardware H.264/HEVC/ProRes encoding and decoding are available. |
| Memory | **8 GB** unified | **The main bottleneck.** After Effects with 4K footage and particles previews slowly. Running AE, Premiere and Media Encoder together will cause swapping. |
| Disk | 228 GB total, **about 21–22 GB free** | Tight. ProRes files, caches and asset packs can fill this quickly. |
| Display | Built-in Liquid Retina 2560×1664 | Fine for 9:16 work. |
| OS | macOS 15.3.2 (Sequoia) | Meets the AE/Premiere 2027 requirement (macOS 15+). |

## Adobe apps installed
| App | Version |
|---|---|
| After Effects 2027 | 27.0 (build 27.0x78) |
| Premiere Pro 2027 | 27.0 |
| Media Encoder 2027 | 27.0 |
| Photoshop 2027 | 28.0 |
| Illustrator 2027 | 31.0 |
| Creative Cloud desktop | installed |
| Audition, Lightroom, Bridge, Animate | **not installed** |

Also on the Mac: Maxon Cinema 4D 2026 (includes Cineware for AE), OBS, iMovie, and the Instagram **Edits** app (Claude already controls it through the metapilot MCP).

## Plugins, extensions, scripts (before)
- **Third-party AE/Premiere plugins: none.** Only Adobe's own effects plus Maxon Cineware.
- CEP extensions: only Adobe's CC Libraries and Start panels.
- AE scripts: only Adobe's sample scripts.
- Media Encoder user presets: none.

## Caches and settings
- After Effects disk cache: **6.4 GB** at `~/Library/Caches/Adobe/After Effects/27.0`. That's 30 % of your free space.
- Media Cache: about 0 (Premiere barely used yet).
- AE: hardware-accelerated viewer ON, auto-save ON (every 20 min, 5 versions), javascript expression engine, 8-bpc projects. Multi-Frame Rendering is at its default (on).
- AE "Allow scripts to write files and access network": OFF. That's fine: Claude's control path works without it, so this security setting was left unchanged.

## Automation interfaces found (tested where marked)
| Interface | Result |
|---|---|
| After Effects AppleScript `DoScript` → ExtendScript | ✅ **Works.** This is how Claude drives AE. AE can't read scripts from system temp folders, so scripts live in this folder. |
| `aerender` (headless AE renderer) | ✅ present (used successfully in earlier Tarotoverse sessions) |
| After Effects AI Assistant custom skills folder | ✅ exists: `~/Documents/Adobe/Common/Assets/Assistant Skills/After Effects/` |
| Premiere AI Assistant | ✅ present, with 9 built-in Adobe skills (encrypted). There's no documented user-skills folder for Premiere yet. |
| AE built-in "MCP Server" plugin (port 4111) | Present, but it belongs to Adobe's own AI Assistant: token-protected, rotates each launch, undocumented, and tied to generative credits. **Not used** (unsupported for outside tools). |
| Premiere Pro scripting from outside | ❌ No AppleScript/ExtendScript entry point. It needs a UXP panel. |
| Photoshop / Illustrator AppleScript `do javascript` | Scripting dictionaries present. Not tested yet. |
| Media Encoder | No outside scripting. Presets are the automation (custom presets installed). |
| ffmpeg / ffprobe | Not installed at audit time. Now installed (9.0.2). |

## Backups made before any change
`00_Backups/`:
- `Adobe_Preferences_20261114-2115.tgz`: all of `~/Library/Preferences/Adobe` (AE, Premiere, AME, Photoshop, Illustrator prefs, workspaces, shortcuts)
- `Documents_Adobe_20261114-2115.tgz`: `~/Documents/Adobe`
- `Tarotoverse_Universe_Love_Message_01_ondisk_2026-11-13.aep`: your project as it was on disk before Claude saved your open work into it
