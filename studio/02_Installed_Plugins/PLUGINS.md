# 02 — Plugins: what was chosen, installed, and skipped

Last updated 2026-11-14. Everything listed as "Installed" was downloaded from the official vendor and signature-checked. See the Status column.

## Installed

| Plugin | Version | Source (official) | Purpose for you | License / cost | Mac compatibility | Status |
|---|---|---|---|---|---|---|
| **Video Copilot FX Console** | 1.0.7 (2026 build) | videocopilot.net/products/m1 → `FXConsole_1.0.7_Installer_Mac_2026.zip` (3.8 MB) | Press **Ctrl+Space** in After Effects to search and apply any effect by typing. Also has frame snapshots, plus favourites. A huge speed boost. | Free (freeware) | Universal (arm64 + x86_64); notarized "Developer ID: Video Copilot (462FK78NZ8)" | ✅ Installed in `Plug-ins/VideoCopilot/`. Confirm with Ctrl+Space. |
| **Video Copilot Saber** | 1.0.40 (2026 Mac build) | `Saber_1.0.40_Installer_Mac_2026.zip` (0.8 MB) | Energy beams, glowing outlines on text/masks, electric and magical edges. Ideal for tarot-card glow edges and glowing titles. | Free | Universal, notarized | ✅ Installed, loads, render-tested |
| **Video Copilot Color Vibrance** | 1.0.7 | `VCColorVibrance_1.0.7_2022.1.zip` (0.2 MB) | Colourful glow and tint that keeps whites clean. Good for magical colour washes. | Free | Universal, signed by Video Copilot | ✅ Installed, loads |
| **ffmpeg** (command-line tool) | 9.0.2 | Homebrew (`brew install ffmpeg`) | Lets Claude inspect your videos and renders: black frames, loudness, silence, contact sheets. | Free, open source (LGPL/GPL) | Native arm64 | ✅ Installed & working |

SHA-256 of the downloaded zips (for integrity records):
- FX Console: `387c1516408c77946262a0e1a944ed29c0d12300898ed622903a5bc534e9e0fd`
- Saber: `893e29d96c562e914c4583211a0d5522b22f5369ddf38cc00d2468a7b5136027`
- Color Vibrance: `f6ed9d23591ee1a41029e4444e2f8f1d338d978c3b8f3f3831a65c577f56d442`

The installers are kept in `02_Installed_Plugins/downloads/`.

## Recommended, but you must sign in yourself (needs your account)

| Tool | Why it's worth it | Free tier | How to get it |
|---|---|---|---|
| **Mister Horse Animation Composer** (After Effects + Premiere; formerly "Premiere Composer", renamed June 2026) | A drag-and-drop library of transitions, text animations, shapes, and sound FX inside both apps. The best free "preset pack" option. | Free plug-in with 1,000+ free assets. Free tier allows commercial use (per vendor FAQ). A 500-item library limit applies. Paid plan unlocks more. | misterhorse.com → create a free account → download the installer → it runs a signed installer. Claude can't create accounts for you. |
| **AEJuice Pack Manager (free packs)** | Free transitions, SFX, and a few VFX packs | Free packs need an account; many items are paid "Pro". | aejuice.com → free account → Pack Manager. Install only the specific free packs you'll use (disk space!). |

## Evaluated and deliberately NOT installed

| Tool | Reason |
|---|---|
| Video Copilot Orb, VC Reflect | Free and compatible, but niche (planets, reflections) and not useful for your reels. Skipped to avoid clutter. You can add them in 1 minute from the same page. |
| Duik Ángela 17.1.21 (RxLaboratorio, GPL-3) | Character-rigging tool. You don't animate characters. Its site also asks paid freelancers/companies to donate. |
| Motion Tools Classic, Kease, Squash & Stretch Free, Motion Fun | Need aescripts accounts. AE 27's built-in graph editor, keyframe velocity, and FX Console cover what you need. Revisit if you start detailed motion-graphics work. |
| Bodymovin / Lottie | Exports animations for websites and apps, not video. Not relevant. |
| Third-party "After Effects/Premiere MCP" bridges (GitHub) | Unofficial code that needs unsigned panels or developer mode. Claude already controls After Effects through Adobe's own AppleScript scripting (tested), so these add risk without need. |
| Any "free" packs on random blogs / cracked plugins | Unsafe or pirated. Never. |

## Built-in Adobe 2027 features that replace paid plugins
- **Premiere Pro 27:** Speech-to-Text captions, Enhance Speech, Auto Reframe, Scene Edit Detection, AI Assistant with built-in skills (colour grading, audio mixing, masking, media search).
- **After Effects 27:**
  - Roto Brush, Content-Aware Fill (object removal), 3D Camera Tracker
  - Multi-Frame Rendering
  - Advanced 3D with Substance materials
  - CC Particle World, CC Light Sweep, Fractal Noise
  - Lumetri, De-esser (new in 27)
- **Adobe Fonts:** thousands of commercial-use fonts included with your plan. Activate them from the Creative Cloud app › Fonts.
