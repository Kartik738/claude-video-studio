# Your Editing Studio: Master Guide

Plain-language guide to everything that was set up. The short version:
**drop your footage in a folder, tell Claude what you want, and say which skill to use** (or just describe it).

---

## 1. How to ask Claude for a video

In the Claude app (Code tab), in the "Claude AI" folder, type for example:

> /raw-to-reel — footage is in Downloads/IMG_9001.MOV and IMG_9002.MOV. Instagram Reel, 15 seconds, dreamy and warm. Hook: "Your next 7 days in love". CTA: DM for Personal Tarot Reading. Use soft music from Edits.

Claude will:
1. look at the footage
2. show you a rough version
3. polish it
4. check it
5. export it

Twice along the way it stops and asks for your OK.

### Your Claude skills (type the name with a slash)
| Skill | Use it for |
|---|---|
| `/raw-to-reel` | **Start here.** Footage plus your brief gives you a finished reel. |
| `/tarotoverse-mystical-reel` | Any @tarotoverse tarot reel (follows your brand rules and reel history) |
| `/social-reel-pro` | Any Instagram/Facebook Reel or YouTube Short |
| `/influencer-cinematic-edit` | Lifestyle, fashion, travel or "personality" clips of a person |
| `/cinematic-edit` | Film-like storytelling edit |
| `/magical-vfx` | Glow, light dust, aura, mist, light sweeps, sparkles |
| `/kinetic-typography` | Elegant animated titles and text |
| `/auto-caption-studio` | Subtitles/captions of what's said |
| `/beat-sync-edit` | Cut the video to the music's beat |
| `/sound-design` | Music levels, voice clean-up, whooshes and chimes |
| `/professional-color-grade` | Colour correction and cinematic looks |
| `/video-enhancement` | Fix dark, noisy, shaky or soft footage |
| `/auto-shorts` | Turn a long video into several short clips |
| `/multi-format-export` | Make 4:5, 1:1 and 16:9 versions of a reel |
| `/render-master` | Export with the right settings |
| `/project-preflight` | "Is it ready?" check before posting |
| `/project-cleanup` | Tidy a messy project (never deletes anything) |
| `/creative-director` | Honest, specific feedback on any video |

These skills live in `04_Claude_Skills/` and are linked into Claude, so they work in any folder.

---

## 2. Where things appear inside Adobe

### After Effects
| Tool | Where | What it does |
|---|---|---|
| **FX Console** | Press **Ctrl + Space** anywhere in AE | Type an effect name to apply it. Also has frame snapshots. |
| **Saber** | Effect › Video Copilot › Saber | Glowing energy edges on text, masks, or the tarot card |
| **Color Vibrance** | Effect › Video Copilot › VC Color Vibrance | Colourful glow and tint |
| **AI Assistant custom skills** | AI Assistant panel › type `/` | `/tv-reel-setup`, `/tv-kinetic-type`, `/tv-magical-vfx`, `/tv-color-grade`, `/tv-preflight`, `/tv-tarotoverse-style`. The assistant uses Adobe generative credits (your plan includes a small monthly amount). |
| Layers Claude creates | Timeline | Named `FX …`, `Title: …`, `Grade: …`, plus a red `SAFE ZONE` guide (never shows in the export) |

### Media Encoder (and Premiere's Export screen)
Preset Browser › **User Presets**:
- `TV Reels 9x16 - H264 16-24Mbps`: Instagram/Facebook Reels, Shorts
- `TV Review Copy - H264 6-8Mbps`: small file for WhatsApp feedback
- `TV Master - H264 40-50Mbps`: high-quality keep-forever copy

### Premiere Pro
- Captions: Window › Text › Transcribe
- Enhance Speech: Essential Sound › Dialogue
- Auto Reframe: Sequence › Auto Reframe Sequence
- Premiere's AI Assistant has Adobe's built-in skills (colour grading, audio mixing, masking, finding media).
- Claude can't click inside Premiere by itself (Adobe gives no outside scripting door). For Premiere jobs Claude either builds in After Effects or Edits, or gives you an exact click-list.

---

## 3. Which tool for which job
| Job | Best tool |
|---|---|
| Fast reel with trending-style captions and music | **Edits app** (Claude drives it) |
| Premium titles, magic effects, compositing | **After Effects** (Claude drives it) |
| Long video, interviews, many clips, captions file | **Premiere Pro** (you drive it, Claude guides) |
| Exporting many versions | **Media Encoder** presets |
| Thumbnails / cover images | Photoshop |

---

## 4. Shortcuts worth learning (After Effects)
| Keys | Action |
|---|---|
| Ctrl + Space | FX Console: search effects |
| Space | Play / stop |
| ⌘ + J / ⌘ + K | Open a comp / Comp settings |
| ⌘ + D | Duplicate layer |
| ⌘ + Shift + D | Split layer at playhead |
| [ / ] | Move layer start / end to playhead |
| Alt + [ / Alt + ] | Trim layer start / end to playhead |
| U | Show animated properties |
| F9 | Easy-ease selected keyframes |
| ⌘ + M | Add to Media Encoder queue |
| ⌘ + Shift + H | Hide layer handles (cleaner preview) |
| ⌘ + Z | Undo (every Claude action is one undo step) |

---

## 5. Keeping things healthy
- **Disk space:** keep 15 GB free. AE › Settings › Media & Disk Cache › **Empty Disk Cache** when low.
- **Adding plugins safely:** only from the vendor's own site or Adobe Exchange. Ask Claude to check the signature before installing. Avoid "free download" blogs.
- **Updating Adobe apps:** wait 1–2 weeks after a major release, check that FX Console and Saber are listed as compatible on videocopilot.net, then update. After updating, ask Claude: "run status and preflight in After Effects" to confirm the bridge still works.
- **Before big changes:** ask Claude to back up preferences (the backup command is in section 6).

## 6. Restoring previous settings
All original settings are in `00_Backups/`. To restore After Effects/Premiere preferences exactly as they were on 14 Nov 2026:
1. Quit all Adobe apps.
2. Ask Claude: "Restore my Adobe preferences from the 14 Nov backup."

   Or do it in Terminal:
   ```bash
   tar xzf "$HOME/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/00_Backups/Adobe_Preferences_20261114-2115.tgz" -C "$HOME/Library/Preferences"
   ```
3. To remove the custom export presets, delete the three `TV …epr` files in `~/Documents/Adobe/Adobe Media Encoder/27.0/Presets/`.
4. To remove the plugins, delete `FXConsole.plugin`, `Saber.plugin`, `Vibrance.plugin` from the After Effects Plug-ins folder (`/Applications/Adobe After Effects 2027/Plug-ins/`; the installers may use a `VideoCopilot` subfolder).

## 7. What still needs you (one-time)
See the "Open items" at the end of `09_Testing_Results/TESTING.md`.
