#!/usr/bin/env python3
"""Awakening 01 (IMG_2707) — "awakening ripple" overlay sequence, SOURCE space (1080x1920 RGBA PNG, 30 fps).

The PNGs live inside the 4K scene comp at 200%, so the camera move in the .jsx applies to them.
  1. Diya sparks — a few slow golden sparks lift off the two diya flames, the whole Reel.
  2. Awakening ripple — two soft golden rings expand outward from the card's edge on the reveal.
  3. Rim — a thin warm glow outside the card's edge, breathing after the reveal.
Nothing is drawn on the card's artwork: everything is cut by the tracked card mask.

Timeline <-> source mapping must match ae/awakening01/build_awakening01.jsx.
"""
import argparse, math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("mask_dir"); ap.add_argument("out_dir")
ap.add_argument("--frames", default="")
a = ap.parse_args()
W, H, FPS = 1080, 1920, 30
NF = 476
REVEAL = 265 / FPS                    # src 12.2333 s
test = [int(x) for x in a.frames.split(",")] if a.frames else None

def src_of(T):
    if T < 6.2: return 0.3 + 1.5 * T
    if T < REVEAL: return 9.6 + (T - 6.2)
    return 12.2333 + 0.8 * (T - REVEAL)

def smooth(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)

# full-card masks only (the early "green card" frames hold just the header band)
full = {}
for fn in os.listdir(a.mask_dir):
    if not (fn.endswith(".png") and fn[:-4].isdigit()): continue
    full[int(fn[:-4])] = fn
keys_full = []
for ms in sorted(full):
    if ms < 12000: continue
    im = Image.open(os.path.join(a.mask_dir, full[ms])).convert("RGB").split()[0]
    if (np.asarray(im.resize((108, 192))) > 127).mean() > 0.18: keys_full.append(ms)
_cache = {}
def card(src_s):
    """(mask 540x960 float, outside-distance field in 1080-space px) for the nearest full-card mask, or None."""
    if not keys_full or src_s < 12.15: return None
    ms = min(keys_full, key=lambda k: abs(k - src_s * 1000))
    if ms not in _cache:
        im = Image.open(os.path.join(a.mask_dir, full[ms])).convert("RGB").split()[0].resize((540, 960), Image.BILINEAR)
        m = np.asarray(im, np.float32) / 255.0
        yy, xx = np.mgrid[-28:29, -28:29]; disk = (xx * xx + yy * yy) <= 28 * 28
        closed = ndimage.binary_closing(np.pad(m > 0.5, 40), structure=disk)[40:-40, 40:-40]   # fill the thumb notch
        d = ndimage.distance_transform_edt(~closed) * 2.0
        _cache.clear(); _cache[ms] = (m, d)
    return _cache[ms]

def up(arr): return np.asarray(Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32) / 255.0

def save_rgba(path, rgb, al):
    al = np.clip(al, 0, 1); out = np.zeros((H, W, 4), np.uint8)
    safe = np.where(al > 1e-4, al, 1)
    out[..., :3] = np.clip(rgb / safe[..., None], 0, 255).astype(np.uint8); out[..., 3] = (al * 255).astype(np.uint8)
    Image.fromarray(out).save(path, compress_level=1)

DIYAS = [(0.092 * W, 0.452 * H), (0.902 * W, 0.441 * H)]   # flame tips in source space
gold, saffron, ember, core = hexrgb("FFD27A"), hexrgb("FFB04D"), hexrgb("FFC56B"), hexrgb("FFF6E0")
rnd = random.Random(2707)
sparks = []
RINGS = [REVEAL - 0.05, REVEAL + 0.40]
out_dir = os.path.join(a.out_dir, "awakening"); os.makedirs(out_dir, exist_ok=True)
acc = 0.0
for n in range(0, NF + 1):
    T = n / FPS
    rgb = np.zeros((H, W, 3), np.float32); al = np.zeros((H, W), np.float32)
    def add(colour, alpha):
        global rgb, al
        alpha = np.clip(alpha, 0, 1)
        rgb = rgb * (1 - alpha[..., None]) + colour * alpha[..., None]
        al = 1 - (1 - al) * (1 - alpha)
    cd = card(src_of(T))
    inside = up(cd[0]) if cd else None

    # 1 — diya sparks (a little livelier after the reveal)
    acc += (1.6 if T < REVEAL else 2.6) / FPS
    while acc >= 1:
        x0, y0 = DIYAS[rnd.randrange(2)]
        sparks.append(dict(t0=T, x=x0 + rnd.uniform(-10, 10), y=y0 + rnd.uniform(-6, 6), vy=-rnd.uniform(55, 95),
                           sw=rnd.uniform(6, 16), f=rnd.uniform(0.6, 1.4), ph=rnd.uniform(0, 6.28),
                           life=rnd.uniform(1.6, 2.8), r=rnd.uniform(1.6, 2.8)))
        acc -= 1
    if sparks:
        g = Image.new("L", (W, H), 0); c = Image.new("L", (W, H), 0)
        dg, dc = ImageDraw.Draw(g), ImageDraw.Draw(c)
        for p in sparks:
            age = T - p["t0"]
            if age < 0 or age > p["life"]: continue
            la = smooth(age / 0.25) * (1 - smooth((age - p["life"] + 0.9) / 0.9)) * (0.7 + 0.3 * math.sin(age * 11 + p["ph"]))
            x = p["x"] + p["sw"] * math.sin(age * p["f"] * 6.28 + p["ph"]); y = p["y"] + p["vy"] * age
            r = p["r"] * (1 - 0.35 * age / p["life"]); G = r * 5
            dg.ellipse([x - G, y - G, x + G, y + G], fill=int(140 * la)); dc.ellipse([x - r, y - r, x + r, y + r], fill=int(255 * la))
        sparks = [p for p in sparks if T - p["t0"] <= p["life"]]
        sg = np.asarray(g.filter(ImageFilter.GaussianBlur(5)), np.float32) / 255.0
        sc = np.asarray(c.filter(ImageFilter.GaussianBlur(0.7)), np.float32) / 255.0
        if inside is not None: sg *= (1 - inside); sc *= (1 - inside)
        add(saffron, sg); add(core, sc)

    # 2 — awakening ripple, 3 — rim
    if cd:
        m, d = cd
        outside = 1 - np.clip(m * 1.6, 0, 1)
        acc_ring = np.zeros_like(m)
        for t0 in RINGS:
            u = (T - t0) / 1.7
            if 0 <= u <= 1:
                rr = 8 + 300 * (1 - (1 - u) ** 2.2)              # ease-out expansion (1080-space px)
                w = 16 + 40 * u
                v = (1 - u) ** 1.4 * smooth(u / 0.06)
                acc_ring = np.maximum(acc_ring, np.exp(-((d - rr) / w) ** 2) * v)
        k = 0.0
        if T >= REVEAL - 0.2:
            k = smooth((T - REVEAL + 0.2) / 0.35) * (0.9 - 0.45 * smooth((T - REVEAL - 0.4) / 1.4))
            if T > REVEAL + 1.8: k = 0.45 + 0.08 * math.sin((T - REVEAL - 1.8) * 2 * math.pi / 3.0)
        rim = np.exp(-d / 10.0) * outside * k
        glow = np.exp(-d / 46.0) * outside * k * 0.55
        add(saffron, up(glow)); add(gold, up(np.clip(acc_ring * 0.62, 0, 1) * outside)); add(core, up(rim * 0.85))

    if test is None or n in test:
        save_rgba(os.path.join(out_dir, "awakening_%04d.png" % n), rgb, al)
print("awakening frames 0", NF, "| full-card masks", len(keys_full))
