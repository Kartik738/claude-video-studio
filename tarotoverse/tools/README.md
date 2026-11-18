# Tarotoverse effect tools

These scripts build custom magical overlays as transparent PNGs. Edits adds them to a Reel with `addOverlay`.
They produce effects Edits can't do natively without washing out the footage.

## Setup (once per machine)

```bash
bash "tools/setup.sh"
```

This creates `tools/.venv` with Pillow and NumPy. Run the scripts with `tools/.venv/bin/python -I tools/<script>.py …`.

## Where the images must live

The Edits app can only read files inside its sandbox. Write the images to:

`~/Library/Containers/com.burbn.basel.mac/Data/Documents/fx/<project>/`

Use one folder per Reel, so the PNGs of earlier Reels are never overwritten.

## card_halo.py — glow that hugs the card

1. In Edits, run `trackObject(clipId, "<specific description of the card>", 0.5, saveMasks=true)`. Note the `maskDirectory`.
2. Compute the offset as `source_seconds - timeline_seconds` for that clip (from `getElement`: `sourceInPoint - startTime`, at speed 1).
3. Write a plan JSON. Use short segments while the card moves and one long segment once it is still. Intensity can peak on a music beat.
4. Run:
   ```bash
   tools/.venv/bin/python -I tools/card_halo.py "<maskDirectory>" "<fx dir>" plan.json --offset <offset> --color FFD68C
   ```
5. Add each PNG at its `t0` with `addOverlay(path, t0, 0.5, 0.5, 1)`, then `trimClip(end, delta = 3 - (t1 - t0))`.
6. Check with `captureFrame` that the glow sits on the card's edge.

**Varying it per Reel:**
- **Colour:** gold `FFD68C`, moonlight silver `D8E4FF`, rose `FFC6D4`, ember `FFB27A`.
- **Shape:** a softer, wider glow (`--wide-blur 60`) or a tight rim (`--wide-blur 25`).
- **Timing:** a pulse versus a slow bloom.
- **Glints:** stars on or off.

## light_motes.py — drifting luminous particles

```bash
tools/.venv/bin/python -I tools/light_motes.py "<fx dir>" --start 3.4 --end 6.8 --step 0.2 --count 8 --color FFDEA0 --drift up --avoid 0.20-0.36
```

Add each frame at its printed start time, then trim it to `step`.

**Varying it per Reel:**
- **Colour:** silver dust, rose, warm embers.
- **Drift:** `--drift down` for falling dust, `none` for a hovering shimmer.
- **Density and size:** `--count`, `--radius`.
- **Placement:** `--avoid` keeps a band, such as a text panel, clear.

## universe_fx2.py — card light rays, stardust, text scrim (Universe 02)

`tools/.venv/bin/python -I tools/universe_fx2.py "<maskDirectory>" "<out dir>" [--only scrim,cardlight,dust] [--frames 244,300]`
Timeline mapping, reveal time and camera are hard-coded to match `ae/universe02/build_universe02.jsx`; copy and edit both together for a new Reel. Use `--frames` for quick test frames before the full render (~5 min).

## audio_profile.py / audio_character.py — judge songs you can't hear

Run on an exported audition MP4: a 0.5 s level/brightness curve with a tempo estimate, and a percussiveness score (high = a beat; avoid for gentle readings).
