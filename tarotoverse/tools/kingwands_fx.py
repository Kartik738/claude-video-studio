#!/usr/bin/env python3
"""King of Wands 01 (IMG_2734) — "ember crown" overlay sequence, SOURCE space (1080x1920 RGBA PNG, 30 fps).

The PNGs live inside the 4K scene comp at 200%, so the camera move in the .jsx applies to them.
  1. Fire rim — a thin, flickering orange-gold glow just outside the card's edge, flaring on the reveal.
  2. Ember crown — embers lift off the card's top edge and upper sides and rise like a crown of fire
     (a burst on the reveal, synced to the alarm bells, then a steady trickle).
  3. Reveal flare — one quick warm bloom around (never over) the card.
Nothing is drawn on the card's artwork.
Timeline <-> source mapping must match ae/kingwands01/build_kingwands01.jsx.
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
NF = 398
REVEAL = 163 / FPS          # src 8.50 s
F0 = 150
test = [int(x) for x in a.frames.split(",")] if a.frames else None

def src_of(T):
    if T < 1.8: return 0.3 + 1.5 * T
    if T < 148 / FPS: return 3.0 + (T - 1.8) * (5.0 / (148 / FPS - 1.8))
    if T < REVEAL: return 8.0 + (T - 148 / FPS)
    return 8.5 + 0.7 * (T - REVEAL)

def smooth(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)

full = {}
for fn in os.listdir(a.mask_dir):
    if fn.endswith(".png") and fn[:-4].isdigit(): full[int(fn[:-4])] = fn
good = []
for ms in sorted(full):
    if ms < 8400: continue
    im = Image.open(os.path.join(a.mask_dir, full[ms])).convert("RGB").split()[0]
    if (np.asarray(im.resize((108, 192))) > 127).mean() > 0.12: good.append(ms)
_cache = {}
def card(src_s):
    if not good: return None
    ms = min(good, key=lambda k: abs(k - src_s * 1000))
    if ms not in _cache:
        im = Image.open(os.path.join(a.mask_dir, full[ms])).convert("RGB").split()[0].resize((540, 960), Image.BILINEAR)
        m = np.asarray(im, np.float32) / 255.0
        d = ndimage.distance_transform_edt(m < 0.5) * 2.0
        ys, xs = np.nonzero(m > 0.5)
        top = ys.min()
        edge = np.argwhere((m > 0.5) & ~ndimage.binary_erosion(m > 0.5, iterations=2))
        upper = edge[edge[:, 0] < top + (ys.max() - top) * 0.35]     # top edge + upper third of the sides
        _cache.clear(); _cache[ms] = (m, d, upper * 2.0, (xs.mean() * 2, ys.mean() * 2))
    return _cache[ms]

def up(arr): return np.asarray(Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32) / 255.0
def save_rgba(path, rgb, al):
    al = np.clip(al, 0, 1); out = np.zeros((H, W, 4), np.uint8)
    safe = np.where(al > 1e-4, al, 1)
    out[..., :3] = np.clip(rgb / safe[..., None], 0, 255).astype(np.uint8); out[..., 3] = (al * 255).astype(np.uint8)
    Image.fromarray(out).save(path, compress_level=1)

orange, gold, core, ember_c = hexrgb("FF8A2E"), hexrgb("FFC65A"), hexrgb("FFF8EA"), hexrgb("FF6A1E")
rnd = random.Random(2734)
embers = []
out_dir = os.path.join(a.out_dir, "embercrown"); os.makedirs(out_dir, exist_ok=True)
for n in range(F0, NF + 1):
    T = n / FPS
    rgb = np.zeros((H, W, 3), np.float32); al = np.zeros((H, W), np.float32)
    def add(colour, alpha):
        global rgb, al
        alpha = np.clip(alpha, 0, 1)
        rgb = rgb * (1 - alpha[..., None]) + colour * alpha[..., None]
        al = 1 - (1 - al) * (1 - alpha)
    cd = card(src_of(T)) if T >= REVEAL - 0.3 else None
    if cd:
        m, d, upper, (cx, cy) = cd
        outside = 1 - np.clip(m * 1.6, 0, 1)
        # flame-like flicker: two sines + a little randomness, flaring on the reveal
        flick = 0.82 + 0.10 * math.sin(T * 17.0) + 0.06 * math.sin(T * 29.0 + 1.3) + rnd.uniform(-0.04, 0.04)
        if T < REVEAL: k = 0.5 * smooth((T - REVEAL + 0.3) / 0.3)
        elif T < REVEAL + 0.25: k = 0.5 + 0.5 * smooth((T - REVEAL) / 0.25)
        else: k = 1.0 - 0.48 * smooth((T - REVEAL - 0.25) / 1.3)
        k *= flick
        rim = np.exp(-d / 9.0) * outside * k
        glow = np.exp(-d / 40.0) * outside * k * 0.6
        # flames lick upward: stronger above the card's centre line
        yy = np.arange(960, dtype=np.float32)[:, None] * 2.0
        upw = np.clip(1.15 - (yy - (cy - 300)) / 900.0, 0.35, 1.15)
        add(orange, up(glow * upw)); add(gold, up(rim * 0.9))
        flare = math.exp(-((T - REVEAL - 0.08) / 0.22) ** 2)
        if flare > 0.02: add(gold, up(np.exp(-d / 120.0) * outside * 0.55 * flare))
        # embers
        rate = 46 if abs(T - REVEAL - 0.05) < 0.5 / FPS else (11.0 / FPS if T > REVEAL else 0)
        cnt = int(rate) + (1 if rnd.random() < rate - int(rate) else 0)
        for _ in range(cnt):
            if len(upper) == 0: break
            py, px = upper[rnd.randrange(len(upper))]
            burst = abs(T - REVEAL - 0.05) < 0.5 / FPS
            embers.append(dict(t0=T, x=px, y=py, vx=(px - cx) * rnd.uniform(0.05, 0.18) + rnd.uniform(-20, 20),
                               vy=-rnd.uniform(90, 190) * (1.3 if burst else 1.0), life=rnd.uniform(1.0, 2.0),
                               r=rnd.uniform(2.6, 5.0), ph=rnd.uniform(0, 6.28), f=rnd.uniform(1.5, 3.5)))
    if embers:
        g = Image.new("L", (W, H), 0); c = Image.new("L", (W, H), 0)
        dg, dc = ImageDraw.Draw(g), ImageDraw.Draw(c)
        for p in embers:
            age = T - p["t0"]
            if age < 0 or age > p["life"]: continue
            la = smooth(age / 0.12) * (1 - smooth((age - p["life"] + 0.6) / 0.6)) * (0.65 + 0.35 * math.sin(age * 14 + p["ph"]))
            x = p["x"] + p["vx"] * age + 14 * math.sin(age * p["f"] * 6.28 + p["ph"]); y = p["y"] + p["vy"] * age - 25 * age * age
            r = p["r"] * (1 - 0.5 * age / p["life"]); G = r * 5
            dg.ellipse([x - G, y - G, x + G, y + G], fill=int(220 * la)); dc.ellipse([x - r, y - r, x + r, y + r], fill=int(255 * la))
        embers = [p for p in embers if T - p["t0"] <= p["life"]]
        sg = np.asarray(g.filter(ImageFilter.GaussianBlur(5)), np.float32) / 255.0
        sc = np.asarray(c.filter(ImageFilter.GaussianBlur(0.8)), np.float32) / 255.0
        if cd:
            inside = up(cd[0]); sg *= (1 - inside); sc *= (1 - inside)
        add(ember_c, np.clip(sg * 1.4, 0, 1)); add(core, sc)
    if test is None or n in test:
        save_rgba(os.path.join(out_dir, "embercrown_%04d.png" % n), rgb, al)
print("embercrown frames", F0, NF, "| full-card masks", len(good))
