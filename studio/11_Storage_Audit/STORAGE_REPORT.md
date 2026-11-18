# Adobe Storage Audit: Before and After (2026-11-15)

## Summary

| | Before | After | Change |
|---|---|---|---|
| Free space on Macintosh HD | **28.7 GB** | **35.5 GB** | **+6.8 GB** |
| Adobe user caches (`~/Library/Caches/Adobe`) | 7.0 GB | 0.7 GB | -6.3 GB |
| After Effects disk cache | 6.3 GB | 0 GB (it refills as you preview) | -6.3 GB |
| Renders backed up to Adobe cloud storage | 0 files | 13 files, 745.7 MB, all checksum-verified | +745.7 MB in the cloud |
| Project files (.aep), linked footage, plugins, presets, preferences | not touched | not touched | none |

Raw numbers are in `before.txt` and `after.txt`. The per-file SHA-256 results are in `cloud_upload_verification.tsv`.

## What I changed

1. **Emptied the After Effects disk cache** (6.3 GB). I checked first that After Effects, Premiere Pro, Photoshop and Media Encoder were all closed. This does the same as AE's **Settings > Media & Disk Cache > Empty Disk Cache**. No project data is stored there. The only effect is that the first RAM preview of each comp will be slower until the cache rebuilds.
2. **Uploaded 13 finished renders** to Creative Cloud Files, in the folder `Mac_Storage_Archive/Tarotoverse_Renders`. I downloaded every file back and compared its SHA-256 with the local file: **13 of 13 match**. The local copies are still on your Mac. I deleted nothing.

## What stays local

| Item | Size | Why it stays |
|---|---|---|
| Adobe apps in `/Applications` (AE, PR, PS, AI, AME) | ~26 GB | The apps must be on the internal drive. |
| `/Library/Application Support/Adobe` | 11 GB | Plugins, Camera Raw, Media Encoder and Premiere support files, license keyfiles. Moving them breaks the apps. |
| `~/Library/Preferences/Adobe`, `~/Documents/Adobe` | ~2 MB | Workspaces, shortcuts, presets and AI Assistant skills. Already backed up in `00_Backups`. |
| All `.aep` projects and Auto-Save folders | ~5 MB | Original projects. Small, and you edit them often. |
| `Tarotoverse/ae/universe01/fx_v2` | 83 MB | **Linked media** in Universe_Love_Message_01.aep |
| `Tarotoverse/ae/universe02/fx` | 163 MB | **Linked media** in Universe_Love_Message_02.aep |
| `~/Downloads/IMG_7061.MOV` | 52 MB | **Linked footage** for both Universe projects |
| `~/Downloads/IMG_8295.MOV` | 52 MB | **Linked footage** for Magical_Reel_02.aep |
| `~/Library/Containers/com.burbn.basel.mac/.../fx/MagicalReel02` | — | **Linked media** for Magical_Reel_02.aep (inside the Edits app's folder) |
| `Tarotoverse/references/approved/*` | 104 MB | Approved reference reels that your Tarotoverse workflow reads. A cloud copy now exists as well. |

> ⚠️ **Risk:** three projects depend on raw footage in **Downloads**. If someone tidies that folder, the projects lose their media. I recommend running AE **File > Dependencies > Collect Files** into each project folder. That relinks media and rewrites the project, so it needs your approval first.

## Waiting for your approval (nothing deleted yet)

**Group A: exact duplicates.** An identical copy (same SHA-256) stays elsewhere on disk *and* in the cloud. **About 462 MB.**

| Delete this copy | Identical copy that stays |
|---|---|
| `~/Downloads/Tarotoverse_Universe_Love_Message_02_Master_ProRes.mov` (250 MB) | `Tarotoverse/ae/universe02/renders/Universe02_Master_HQ.mov` |
| `~/Downloads/Tarotoverse_Universe_Love_Message_02_MusicFree.mp4` (73 MB) | `Tarotoverse/ae/universe02/renders/Universe02_visual_v2.mp4` |
| `~/Downloads/Tarotoverse_Universe_Love_Message_01_MusicFree_Master.mp4` (67 MB) | `Tarotoverse/ae/universe01/renders/Universe01_AE_visual_v2.mp4` |
| `~/Downloads/Tarotoverse_Universe_Love_Message_02_Final.mp4` (72 MB) | `Tarotoverse/references/approved/2026-11-15_Universe_Love_Message_02.mp4` |
| `Tarotoverse/ae/universe01/renders/Universe01_AE_visual_v1.mp4` (0 bytes, a failed render) | none needed |

**Group B: cloud-only.** These renders are the only local copy, but a verified cloud copy exists and no project links to them. **About 641 MB.** `Universe02_Master_HQ.mov` (250 MB), `Universe02_visual_v2.mp4`, `Universe02_visual_v1.mp4`, `Universe01_AE_visual_v2.mp4`, `Universe01_AE_visual_v1b.mp4`, `Reel02_AE_visual.mp4`, and in Downloads `Tarotoverse_Magical_Reel_02_Final.mp4`, `..._AfterEffects.mp4`, `Tarotoverse_Universe_Love_Message_01_Final.mp4`, `Tarotoverse_The_Voice_Note_I_Kept.mp4`.

**Group C: archive candidates, not uploaded yet.** These are QC and review frame dumps that no project links to: `universe01/qc*`, `universe02/qc`, `universe02/review_*`, `universe01/fx` (old v1 frames). **About 450 MB.** If you approve, I can zip each folder, upload it, verify it, and then remove the local copy.

Approving A, B and C frees about **1.5 GB** more.

## Moving caches to an external drive

No external drive is connected. Only the "Edits Installer" disk image is mounted. When you connect an external **SSD** (avoid spinning hard drives, because they slow previews):

- **After Effects:** Settings > Media & Disk Cache > Disk Cache folder → `/Volumes/<SSD>/Adobe Cache/AE`. Also set a cap such as 20 GB.
- **Premiere Pro and Media Encoder:** Settings > Media Cache > Media Cache Files location → `/Volumes/<SSD>/Adobe Cache/Media Cache`. Turn on "Automatically delete cache files older than 30 days".
- **Camera Raw (Photoshop):** Camera Raw Preferences > Performance > cache location and size (currently 433 MB).
- **Leave on the internal drive:** project files you are actively editing, apps, plugins and preferences.

## Other notes

- **Adobe cloud quota:** these tools can't read your storage quota. Check it in the Creative Cloud app: avatar > Storage.
- The "Creative Cloud Files" sync folder isn't set up on this Mac, so the cloud files are not mirrored back to local disk. That suits your goal.
- An empty folder `Mac_Storage_Archive/Tarotoverse_Renders` may also show in the cloud (created before the upload). The files are in the folder the upload created at the same path.
- `~/Library/Caches/Adobe/CCX Welcome` (638 MB) is the Creative Cloud app's Home-screen cache. It is safe to clear while the Creative Cloud app is quit. I left it because the app was running.
- Adobe files are a small part of the 171 GB in use on the Data volume. Most of the space is used outside Adobe.
