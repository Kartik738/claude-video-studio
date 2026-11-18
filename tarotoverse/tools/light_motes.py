#!/usr/bin/env python3
"""Drifting light-mote overlays (soft luminous particles) for Tarotoverse reels.

Writes one full-frame transparent PNG per step. Add each with Edits' addOverlay
at its start time, then trim it to the step length.

Usage:
  light_motes.py OUT_DIR --start 3.4 --end 6.8 [--step 0.2] [--count 8]
                 [--color FFDEA0] [--size 1080x1920] [--seed 7]
                 [--drift up|down|none] [--radius 6] [--strength 0.85]
                 [--avoid 0.20-0.36]  (y band to keep clear, e.g. under a text panel)
Prints a line per frame: name, start time, duration.
"""
import argparse, math, os
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("out_dir")
ap.add_argument("--start", type=float, required=True); ap.add_argument("--end", type=float, required=True)
ap.add_argument("--step", type=float, default=0.2); ap.add_argument("--count", type=int, default=8)
ap.add_argument("--color", default="FFDEA0"); ap.add_argument("--size", default="1080x1920")
ap.add_argument("--seed", type=int, default=7); ap.add_argument("--drift", default="up")
ap.add_argument("--radius", type=float, default=6); ap.add_argument("--strength", type=float, default=0.85)
ap.add_argument("--avoid", default=None, help="y band like 0.20-0.36 kept free of motes")
ap.add_argument("--prefix", default="mote")
a = ap.parse_args()
W, H = map(int, a.size.split("x"))
RGB = tuple(int(a.color[i:i + 2], 16) for i in (0, 2, 4))
rng = np.random.default_rng(a.seed)
lo, hi = (map(float, a.avoid.split("-")) if a.avoid else (None, None))
motes = []
while len(motes) < a.count:
    x, y = rng.uniform(0.08, 0.92), rng.uniform(0.40, 0.85)
    if lo is not None and lo - 0.03 < y < hi + 0.08:
        continue
    motes.append(dict(x=x, y=y, r=a.radius * rng.uniform(0.7, 1.35), v=rng.uniform(0.016, 0.024),
                      sw=rng.uniform(0.007, 0.012), ph=rng.uniform(0, 6.28)))
sign = {"up": -1, "down": 1, "none": 0}[a.drift]
yy, xx = np.ogrid[:H, :W]
os.makedirs(a.out_dir, exist_ok=True)
n = int(round((a.end - a.start) / a.step))
for k in range(n):
    t0 = a.start + k * a.step; tm = t0 + a.step / 2 - a.start; dur = a.end - a.start
    env = min(1, tm / 0.6) * min(1, (dur - tm) / 0.5)
    layer = np.zeros((H, W), np.float32)
    for m in motes:
        cx = (m["x"] + m["sw"] * math.sin(tm * 1.3 + m["ph"])) * W
        cy = (m["y"] + sign * m["v"] * tm) * H
        tw = 0.55 + 0.45 * math.sin(tm * 2.2 + m["ph"] * 1.7)
        d2 = ((xx - cx) ** 2 + (yy - cy) ** 2) / ((m["r"] * 1.6) ** 2)
        layer = np.maximum(layer, (np.exp(-d2 * 1.2) + np.exp(-d2 / 7) * 0.45) * tw)
    rgba = np.zeros((H, W, 4), np.uint8); rgba[..., :3] = RGB
    rgba[..., 3] = (np.clip(layer * a.strength * env, 0, 1) * 255).astype(np.uint8)
    name = "%s_%02d" % (a.prefix, k)
    Image.fromarray(rgba).save(os.path.join(a.out_dir, name + ".png"))
    print(name, round(t0, 4), a.step)
