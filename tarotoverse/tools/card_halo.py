#!/usr/bin/env python3
"""Card aura overlays for Tarotoverse reels.

Builds full-frame transparent PNGs (default 1080x1920) holding a soft glow
that hugs a tracked card's edges and never tints the card's interior.
The source is the mask folder written by Edits'
trackObject(saveMasks=true): PNGs named by source milliseconds.

Usage:
  card_halo.py MASK_DIR OUT_DIR PLAN.json [--color FFD68C] [--offset 2.5667]
               [--size 1080x1920] [--seed-x 0.5 --seed-y 0.62]

PLAN.json is a list of segments in timeline seconds:
  [{"name": "halo_00", "t0": 6.80, "t1": 6.8667, "i": 0.35, "stars": 0}, ...]
  i     = glow intensity 0..1+
  stars = brightness of two corner starlight glints (0 = none)
source_ms = (timeline_t + offset) * 1000. Masks in [t0, t1) are averaged.
"""
import argparse, json, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("mask_dir"); ap.add_argument("out_dir"); ap.add_argument("plan")
ap.add_argument("--color", default="FFD68C")
ap.add_argument("--offset", type=float, required=True, help="source seconds minus timeline seconds")
ap.add_argument("--size", default="1080x1920")
ap.add_argument("--seed-x", type=float, default=0.5, help="a point inside the card (0-1) to isolate it")
ap.add_argument("--seed-y", type=float, default=0.62)
ap.add_argument("--wide-blur", type=float, default=44); ap.add_argument("--rim-blur", type=float, default=9)
a = ap.parse_args()
W, H = map(int, a.size.split("x"))
RGB = tuple(int(a.color[i:i + 2], 16) for i in (0, 2, 4))
files = sorted(int(f[:-4]) for f in os.listdir(a.mask_dir) if f.endswith(".png") and f[:-4].isdigit())

def load(ms):
    m = min(files, key=lambda f: abs(f - ms))
    return np.array(Image.open(os.path.join(a.mask_dir, "%06d.png" % m)).convert("RGB"))[:, :, 0] > 127

def card_only(mask):
    """Keep only the connected region nearest the seed point (drops deck fragments)."""
    s = mask[::4, ::4]
    ys, xs = np.nonzero(s)
    if len(xs) == 0:
        return mask
    cy, cx = a.seed_y * s.shape[0], a.seed_x * s.shape[1]
    i = ((ys - cy) ** 2 + (xs - cx) ** 2).argmin()
    reg = np.zeros_like(s); reg[ys[i], xs[i]] = True
    while True:
        n = reg.copy(); n[1:] |= reg[:-1]; n[:-1] |= reg[1:]; n[:, 1:] |= reg[:, :-1]; n[:, :-1] |= reg[:, 1:]; n &= s
        if (n == reg).all(): break
        reg = n
    return np.kron(reg, np.ones((4, 4), bool))[: mask.shape[0], : mask.shape[1]] & mask

def star(d, cx, cy, r, amt):
    for k in range(r, 0, -1):
        al = int(amt * 255 * (1 - k / r) ** 1.6)
        d.line([(cx - 2 * k, cy), (cx + 2 * k, cy)], fill=RGB + (al,), width=1)
        d.line([(cx, cy - 2 * k), (cx, cy + 2 * k)], fill=RGB + (al,), width=1)
    d.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=(255, 245, 220, int(min(1, amt) * 255)))

os.makedirs(a.out_dir, exist_ok=True)
for seg in json.load(open(a.plan)):
    s0 = int((seg["t0"] + a.offset) * 1000); s1 = int((seg["t1"] + a.offset) * 1000)
    srcs = list(range(s0, max(s1, s0 + 1), 33)) if seg["t1"] - seg["t0"] < 1 else list(range(s0, s1, 300))
    acc = sum(card_only(load(s)).astype(np.float32) for s in srcs) / len(srcs)
    m = Image.fromarray(((acc > 0.5) * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
    inner = np.asarray(m, np.float32) / 255
    wide = np.asarray(m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(a.wide_blur)), np.float32) / 255
    rim = np.asarray(m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(a.rim_blur)), np.float32) / 255
    alpha = np.clip(np.clip(wide + rim * 0.8, 0, 1) * (1 - inner * 0.97) * seg["i"], 0, 1)
    rgba = np.zeros((H, W, 4), np.uint8); rgba[..., :3] = RGB; rgba[..., 3] = (alpha * 255).astype(np.uint8)
    img = Image.fromarray(rgba)
    if seg.get("stars", 0) > 0:
        ys, xs = np.nonzero(inner > 0.5)
        d = ImageDraw.Draw(img)
        star(d, xs.max() + 4, ys.min() - 4, 14, seg["stars"])
        star(d, xs.min() - 4, ys.max() + 4, 11, seg["stars"] * 0.8)
    img.save(os.path.join(a.out_dir, seg["name"] + ".png"))
    ys, xs = np.nonzero(inner > 0.5)
    print("%s  card x %.3f-%.3f  y %.3f-%.3f" % (seg["name"], xs.min() / W, xs.max() / W, ys.min() / H, ys.max() / H))
