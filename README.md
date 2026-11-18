# Claude Video Studio

This is a complete AI-driven video-editing studio for **Claude Code on macOS**. It contains:
- 18 editing skills;
- automation that lets Claude drive **Adobe After Effects**;
- skills for Adobe's built-in AE AI Assistant;
- Media Encoder export presets;
- a production system for the **@tarotoverse** Instagram Reels, built on the **Instagram Edits** Mac app.

You describe a video in plain language. Claude analyses the footage, edits, grades, adds text, effects and music, checks the export, and delivers the finished file.

---

## What's inside

| Folder | What it is |
|---|---|
| `studio/04_Claude_Skills/` | **18 Claude Code skills** — `/raw-to-reel`, `/social-reel-pro`, `/cinematic-edit`, `/influencer-cinematic-edit`, `/kinetic-typography`, `/magical-vfx`, `/professional-color-grade`, `/sound-design`, `/beat-sync-edit`, `/auto-caption-studio`, `/auto-shorts`, `/multi-format-export`, `/render-master`, `/video-enhancement`, `/project-preflight`, `/project-cleanup`, `/creative-director`, `/tarotoverse-mystical-reel` |
| `studio/03_Adobe_Skills/After Effects/` | 6 skills for Adobe's own **AE AI Assistant** (`tv-…`) |
| `studio/07_Automation_Workflows/` | `bin/ae_run.sh`, which runs ExtendScript inside After Effects from Claude, plus 15 AE scripts (new reel comp, grade, kinetic titles, magic FX, preflight, render queue…). Start with `TOOLKIT.md`. |
| `studio/05_Presets_and_Templates/` | Media Encoder presets for Reels, a master export and a review copy (H.264) |
| `studio/06_Editing_Asset_Library/` | A licence register plus two self-made overlays (film grain, gold light leak) |
| `studio/10_Master_Guide/MASTER_GUIDE.md` | **The plain-language guide to everything.** Read this first. |
| `studio/01, 02, 08, 09, 11` | System audit, plugin list, performance notes, test results (contact sheets), storage report |
| `tarotoverse/` | The @tarotoverse Reel system: brand rules (`CLAUDE.md`), the `/tarotoverse-reel` skill with field notes for the Instagram Edits app, brand guide, quality checklist, reel history, Python effect tools (card glow, light motes, audio analysis) and the AE build scripts of past reels |
| `STUDIO_BRIEF.md` | The standing creative brief Claude follows for all production work |

## Requirements

- macOS on Apple Silicon. Built and tested on an M3 with 8 GB of RAM.
- [Claude Code](https://claude.com/claude-code): the desktop app or the CLI.
- **Adobe After Effects 2027**, with Creative Cloud, for the AE automation and the Adobe skills.
- **ffmpeg**: `brew install ffmpeg`.
- **Python 3**, for the Tarotoverse effect tools.
- Optional: the **Instagram Edits** Mac app with "Connect an AI client" switched on, for the Edits-based reel workflow.
- Optional free plugins: Video Copilot **FX Console**, **Saber** and **Color Vibrance**. Download them from [videocopilot.net](https://www.videocopilot.net). The installers are *not* included here; see `studio/02_Installed_Plugins/PLUGINS.md`.

## Install

```bash
git clone https://github.com/<your-account>/claude-video-studio.git
cd claude-video-studio
./install.sh
```

`install.sh` does four things:
1. Links the 18 skills into `~/.claude/skills/`. It never overwrites an existing skill of the same name.
2. Copies the 6 AE Assistant skills into `~/Documents/Adobe/Common/Assets/Assistant Skills/After Effects/`.
3. Makes `ae_run.sh` executable.
4. Sets up the Python environment for the Tarotoverse tools.

Then restart Claude Code. Type `/raw-to-reel` and describe your video.

## Using the AE automation

```bash
studio/07_Automation_Workflows/bin/ae_run.sh studio/07_Automation_Workflows/ae_scripts/status.jsx
```

- After Effects must be open.
- AE can't read scripts from system temp folders, so keep `.jsx` files inside your project folders.
- See `studio/07_Automation_Workflows/TOOLKIT.md` for every script and its arguments.

## Notes

- **Paths.** Docs and scripts refer to `~/Claude AI/…`, where the studio originally lived. Adjust them if you put the folders somewhere else. For example, the Tarotoverse AE build scripts expect footage and renders under `~/Claude AI/Tarotoverse/ae/`.
- **Not included:** footage, renders, After Effects project files, backups, plugin installers, the Tarotoverse daily Telegram system and the voiceover production kit. These are personal, large, or not redistributable.
- **Music:** songs from the Instagram Edits library are licensed for Instagram/Facebook only, and no audio is stored here. See `studio/06_Editing_Asset_Library/LICENSES.md`.
- **No secrets** are stored in this repo. Connection keys (such as the Edits AI-client key) stay in your local Claude config.
