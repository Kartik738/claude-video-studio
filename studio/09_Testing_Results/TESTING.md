# 09 — Testing Results (14–15 Nov 2026)

All tests ran in a throwaway project: `test_project/TV_Test_Project.aep`. Your Tarotoverse project was only read, and saved once at your request (the old copy is in `00_Backups`).

## What worked (verified)
| Test | Result | Proof |
|---|---|---|
| Claude → After Effects control (AppleScript → ExtendScript) | ✅ | Every script below ran through `bin/ae_run.sh` |
| Read-only preflight on your real project | ✅ | No missing media or fonts. Listed all 6 on-screen texts. |
| New 9:16 reel comp from iPhone 4K footage + safe-zone guide | ✅ | `DEMO 2`, `DEMO 3` comps |
| Lumetri looks (mystic-night, warm-cinematic) | ✅ | frames in `frames/` |
| Magic FX: mist, motes, aura, sweep, stars | ✅ after fixes | `contact_demo2_mystical.jpg` |
| Titles: words, rise, track, typewriter | ✅ | `contact_demo1_typography.jpg` |
| Aspect variants 4:5 and 1:1 | ✅ (works, but see quality note) | `contact_demo3_influencer.jpg` |
| Render queue → H.264 MP4 | ✅ **3 demos, 30 s of 1080×1920 video in 241 s** (about 8× real time) | `renders/` |
| Render QC with ffmpeg (specs, black frames, loudness) | ✅ | All 1080×1920, 30 fps, H.264, no black frames |
| Media Encoder presets (3) | ✅ files valid XML, installed | not yet opened inside Media Encoder |
| Saber plugin | ✅ loads; glow on a title rendered correctly | `saber_test_crop.jpg`; also wired into `add_magic_fx.jsx` (`fx:"saber"`) |
| Color Vibrance plugin | ✅ loads (shows in AE's effects list) | not yet used in a comp |
| FX Console | ⚠ installed in the right folder. Not yet confirmed working: it's a keyboard panel (Ctrl+Space) that scripts can't check. | Please press Ctrl+Space in AE once |
| Claude skills (18) | ✅ Claude lists them as available | type `/raw-to-reel` etc. |
| AE AI Assistant skills (6) | ⚠ installed in Adobe's skills folder. Not run (running them spends Adobe generative credits). | AI Assistant › `/` menu |
| Disk cache purge | ✅ 9.8 GB → 12 MB. Free space 21 GB → 32 GB. | |

## Problems found during testing and fixed
1. **Scripts couldn't be read from temp folders by AE.** Fixed: run files live in `07_Automation_Workflows/.run`.
2. **Particle and star effects failed** (wrong parameter layout and value ranges). Fixed and retested.
3. **Mist looked blotchy.** Fixed: softer, blurred, kept to the lower half of the frame.
4. **Aura plus light sweep blew the tarot card out to pure white.** Fixed: higher glow threshold and lower intensity. The card now stays readable.
5. **Small subtitle unreadable over busy flowers.** Fixed: a drop shadow is now always on for titles.
6. Titles used a plain default font. They now default to Baskerville SemiBold (installed on your Mac).

## Honest quality notes
- The demos are **technical tests**, not finished reels. Demo 2 has no music (no licensed track was supplied). Demo 3's audio is just phone room sound, very quiet (−39 LUFS); the QC correctly flagged it.
- Automatic 4:5 / 1:1 versions use "fit plus blurred background". That's fine as a draft, but for premium posts the framing should be adjusted by eye. The skill says so.
- The "influencer" demo used your tarot clip IMG_8295 as a stand-in, because no influencer footage was available.
- Settings in AE/Premiere preferences were **not** changed by script (no safe documented way). See `08_Performance_Report` for the 2-minute manual list.
- The test project was closed once without saving its last render-queue status. Its comps were saved before rendering.

## Not tested / not possible
- Premiere Pro automation: there's no outside scripting entry point. Covered by guidance and Premiere's own AI Assistant.
- Photoshop/Illustrator scripting: available, but not exercised.
- Saving custom workspace layouts: AE/Premiere have no reliable script for this. Use Window › Workspace › Save as New Workspace (suggested names: "TV Motion", "TV Social", "TV Color").
- Mister Horse / AEJuice: they need your own free account.

## Open items for you
1. Press **Ctrl+Space** in After Effects once to confirm FX Console opens.
2. Do the 2-minute settings in `08_Performance_Report/PERFORMANCE.md`, especially **Max Disk Cache = 10 GB**.
3. Optional: free Mister Horse account → Animation Composer.
