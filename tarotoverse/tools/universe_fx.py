#!/usr/bin/env python3
"""Universe Love Message 01 — custom overlay sequences (1080x1920 RGBA PNG, 30 fps).

Three effects, each its own numbered sequence so After Effects imports them as footage:
  embers/  rising candle-embers with depth (timeline 0 .. EMB_END)
  aura/    rose-gold glow that hugs the card's OUTSIDE edge only (never on the artwork)
  ripple/  a card-shaped ring of light that expands outward at the reveal

Usage:
  universe_fx.py MASK_DIR OUT_DIR --offset 4.3667 --reveal 7.1333 --end 13.2333
source_seconds = timeline_seconds + offset (for the real-speed section that holds the card).
"""
import argparse, math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("mask_dir"); ap.add_argument("out_dir")
ap.add_argument("--offset", type=float, required=True)
ap.add_argument("--reveal", type=float, required=True)
ap.add_argument("--end", type=float, required=True)
ap.add_argument("--aura-start", type=float, default=6.55)
ap.add_argument("--emb-end", type=float, default=7.0)
ap.add_argument("--only", default="embers,aura,ripple")
a = ap.parse_args()
W, H, FPS = 1080, 1920, 30
only = set(a.only.split(","))
files = sorted(int(f[:-4]) for f in os.listdir(a.mask_dir) if f.endswith(".png") and f[:-4].isdigit())

def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)

def mask_at(src_s):
    ms = src_s * 1000
    m = min(files, key=lambda f: abs(f - ms))
    # Edits/SAM masks keep the mask in the RED channel only (G = B = 0), so don't convert to luma.
    im = Image.open(os.path.join(a.mask_dir, "%06d.png" % m)).convert("RGB").split()[0].resize((W, H), Image.BILINEAR)
    return im

def blur(im, r): return im.filter(ImageFilter.GaussianBlur(r))

def save_rgba(path, rgb_premul_alpha):
    rgb, al = rgb_premul_alpha
    al = np.clip(al, 0, 1)
    out = np.zeros((H, W, 4), np.uint8)
    safe = np.where(al > 1e-4, al, 1)
    out[..., :3] = np.clip(rgb / safe[..., None], 0, 255).astype(np.uint8)
    out[..., 3] = (al * 255).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(path, compress_level=1)

def smooth(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)

# ---------------------------------------------------------------- aura
def aura_intensity(t):
    r = a.reveal
    if t < a.aura_start: return 0.0
    if t < r: return 0.55 * smooth((t - a.aura_start) / (r - a.aura_start))      # rise with the card
    if t < r + 0.18: return 0.55 + 0.45 * smooth((t - r) / 0.18)                   # peak on the reveal
    if t < r + 1.4: return 1.0 - 0.62 * smooth((t - r - 0.18) / 1.22)              # settle
    return 0.38 + 0.07 * math.sin((t - r - 1.4) * 2 * math.pi / 3.2)              # slow breathing

if "aura" in only:
    d = os.path.join(a.out_dir, "aura"); os.makedirs(d, exist_ok=True)
    wide_c, rim_c = hexrgb("F7B79A"), hexrgb("FFE6CF")   # rose-gold, warm ivory rim
    n0 = int(round(a.aura_start * FPS)); n1 = int(round(a.end * FPS))
    for n in range(n0, n1 + 1):
        t = n / FPS; k = aura_intensity(t)
        m = mask_at(t + a.offset)
        inside = np.asarray(blur(m, 2), np.float32) / 255.0
        inside = np.clip((inside - 0.35) * 4, 0, 1)                                  # slightly dilated card
        outside = 1 - inside
        wide = np.asarray(blur(m, 46), np.float32) / 255.0
        rim = np.asarray(blur(m, 9), np.float32) / 255.0
        a_w = np.clip(wide * 1.25, 0, 1) * outside * 0.34 * k
        a_r = np.clip(rim * 1.6, 0, 1) * outside * 0.6 * k
        al = 1 - (1 - a_w) * (1 - a_r)
        rgb = wide_c[None, None] * a_w[..., None] + rim_c[None, None] * a_r[..., None]
        save_rgba(os.path.join(d, "aura_%04d.png" % n), (rgb, al))
    print("aura frames", n0, n1)

# ---------------------------------------------------------------- ripple
if "ripple" in only:
    d = os.path.join(a.out_dir, "ripple"); os.makedirs(d, exist_ok=True)
    col = (255, 226, 196)
    n0 = int(round(a.reveal * FPS)); dur = 1.1
    for n in range(n0, int(round((a.reveal + dur) * FPS)) + 1):
        t = n / FPS
        m = np.asarray(mask_at(t + a.offset)) > 127
        ys, xs = np.nonzero(m)
        x0, x1, y0, y1 = np.percentile(xs, 1), np.percentile(xs, 99), np.percentile(ys, 1), np.percentile(ys, 99)
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(layer)
        for delay, amp in ((0.0, 0.6),):
            p = (t - a.reveal - delay) / (dur - delay)
            if p < 0 or p > 1: continue
            e = 1 - (1 - p) ** 3                       # ease-out expansion
            r = 4 + 210 * e
            alpha = amp * (1 - p) ** 1.6
            wdt = max(2, int(round(5 * (1 - p) + 2)))
            dr.rounded_rectangle([x0 - r, y0 - r, x1 + r, y1 + r], radius=int(34 + r * 0.6),
                                 outline=col + (int(255 * alpha),), width=wdt)
        halo = blur(layer, 14); soft = blur(layer, 6)
        out = Image.alpha_composite(halo, soft)
        out.save(os.path.join(d, "ripple_%04d.png" % n), compress_level=1)
    print("ripple frames", n0)

# ---------------------------------------------------------------- embers
if "embers" in only:
    d = os.path.join(a.out_dir, "embers"); os.makedirs(d, exist_ok=True)
    rnd = random.Random(7061)
    parts = []
    def spawn(t):
        bokeh = rnd.random() < 0.18
        return dict(t0=t, life=rnd.uniform(2.2, 4.2), x=rnd.uniform(60, W - 60), y=rnd.uniform(0.30, 0.56) * H,
                    vy=rnd.uniform(38, 85) * (0.7 if bokeh else 1), sway=rnd.uniform(8, 26), f=rnd.uniform(0.25, 0.6),
                    ph=rnd.uniform(0, 6.28), r=rnd.uniform(10, 18) if bokeh else rnd.uniform(2.0, 4.4),
                    amp=rnd.uniform(0.18, 0.3) if bokeh else rnd.uniform(0.65, 1.0), bokeh=bokeh,
                    fl=rnd.uniform(5, 11), c=rnd.choice([(255, 178, 94), (255, 200, 130), (255, 222, 170)]))
    # pre-populate so the very first frame already has atmosphere
    for i in range(26):
        p = spawn(-rnd.uniform(0, 3.5)); parts.append(p)
    n1 = int(round(a.emb_end * FPS))
    acc = 0.0
    for n in range(0, n1 + 1):
        t = n / FPS
        acc += 7.0 / FPS
        while acc >= 1: parts.append(spawn(t)); acc -= 1
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); core = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bok = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        dg, dc, db = ImageDraw.Draw(glow), ImageDraw.Draw(core), ImageDraw.Draw(bok)
        master = 1.0 - smooth((t - (a.emb_end - 0.5)) / 0.5)        # all embers fade before the flip
        for p in parts:
            age = t - p["t0"]
            if age < 0 or age > p["life"]: continue
            life_a = smooth(age / 0.5) * (1 - smooth((age - p["life"] + 0.9) / 0.9))
            flick = 0.78 + 0.22 * math.sin(age * p["fl"] + p["ph"])
            al = p["amp"] * life_a * flick * master
            x = p["x"] + p["sway"] * math.sin(age * p["f"] * 6.28 + p["ph"])
            y = p["y"] - p["vy"] * age
            r = p["r"] * (1 - 0.35 * age / p["life"])
            if p["bokeh"]:
                db.ellipse([x - r, y - r, x + r, y + r], fill=p["c"] + (int(255 * al),))
            else:
                g = r * 4.5
                dg.ellipse([x - g, y - g, x + g, y + g], fill=p["c"] + (int(150 * al),))
                dc.ellipse([x - r, y - r, x + r, y + r], fill=(255, 240, 215, int(255 * al)))
        out = Image.alpha_composite(blur(bok, 6), blur(glow, 7))
        out = Image.alpha_composite(out, blur(core, 0.8))
        out.save(os.path.join(d, "embers_%04d.png" % n), compress_level=1)
        parts = [p for p in parts if t - p["t0"] <= p["life"]]
    print("embers frames 0", n1)
