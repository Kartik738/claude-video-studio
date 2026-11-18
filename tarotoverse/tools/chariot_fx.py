#!/usr/bin/env python3
"""Chariot 01 (IMG_6761) — "light in motion" overlay sequence, SOURCE space (1080x1920 RGBA PNG, 30 fps).

The PNGs live inside the 4K scene comp at 200%, so the camera move in the .jsx applies to them.
  1. Comet streak — a light streak races left->right behind the card as it lands (the chariot passing).
  2. Edge runner — a single spark runs once around the card's outline after the reveal (a turning wheel).
  3. Halo — a soft periwinkle glow outside the card's edge, blooming on the reveal, then breathing.
Nothing is ever drawn on the card's artwork: every layer is cut by the tracked card mask.

Timeline <-> source mapping must match ae/chariot01/build_chariot01.jsx.
"""
import argparse, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("mask_dir"); ap.add_argument("out_dir")
ap.add_argument("--frames", default="")
ap.add_argument("--v2", action="store_true", help="v2 timing: longer hold (0.7x, then an eased glide to a stop) for the Read Caption block")
a = ap.parse_args()
W, H, FPS = 1080, 1920, 30
NF = 534 if a.v2 else 453
REVEAL = 325 / FPS                 # src 16.433 s
F0 = 306                           # first FX frame (T 10.2 s)
test = [int(x) for x in a.frames.split(",")] if a.frames else None

def src_of(T):
    if T < 6.0: return 0.4 + 1.5 * T
    if T < 290 / 30: return 9.4 + 1.6 * (T - 6.0)
    if T < REVEAL: return 15.2667 + (T - 290 / 30)
    if not a.v2: return 16.4333 + 0.8 * (T - REVEAL)
    TA, END = 14.9, NF / FPS                    # keep identical to holdRemap() in build_chariot01_v2.jsx
    if T < TA: return 16.4333 + 0.7 * (T - REVEAL)
    s0 = 16.4333 + 0.7 * (TA - REVEAL); u = min(max((T - TA) / (END - TA), 0.0), 1.0)
    return s0 + (19.85 - s0) * (1 - (1 - u) ** 2)

def smooth(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)

files = sorted(int(f[:-4]) for f in os.listdir(a.mask_dir) if f.endswith(".png") and f[:-4].isdigit())
def mask(src_s):
    ms = src_s * 1000
    m = min(files, key=lambda f: abs(f - ms))
    if abs(m - ms) > 60: return None
    im = Image.open(os.path.join(a.mask_dir, "%06d.png" % m)).convert("RGB").split()[0].resize((W, H), Image.BILINEAR)
    return im

def arr(im): return np.asarray(im, np.float32) / 255.0
def blur(im, r): return im.filter(ImageFilter.GaussianBlur(r))

def save_rgba(path, rgb, al):
    al = np.clip(al, 0, 1)
    out = np.zeros((H, W, 4), np.uint8)
    safe = np.where(al > 1e-4, al, 1)                  # layers accumulate premultiplied; store straight alpha
    out[..., :3] = np.clip(rgb / safe[..., None], 0, 255).astype(np.uint8)
    out[..., 3] = (al * 255).astype(np.uint8)
    Image.fromarray(out).save(path, compress_level=1)

def hull_path(mi):
    """Ordered outline points of the card (convex hull), clockwise from top-centre, plus perimeter length."""
    m = np.asarray(mi) > 127
    ys, xs = np.nonzero(m[::4, ::4]); pts = np.stack([xs * 4, ys * 4], 1).astype(np.float32)
    # monotone-chain convex hull
    P = sorted(map(tuple, pts))
    def cross(o, a_, b): return (a_[0] - o[0]) * (b[1] - o[1]) - (a_[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p in P:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(P):
        while len(up) >= 2 and cross(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    hull = np.array(lo[:-1] + up[:-1], np.float32)
    c = hull.mean(0)
    ang = np.arctan2(hull[:, 1] - c[1], hull[:, 0] - c[0])
    hull = hull[np.argsort(ang)]                       # clockwise in image coords (y down)
    start = np.argmin(np.abs(np.arctan2(hull[:, 1] - c[1], hull[:, 0] - c[0]) + math.pi / 2))
    hull = np.roll(hull, -start, 0)
    dv = hull - c; dn = np.linalg.norm(dv, axis=1, keepdims=True)
    hull = c + dv * (1 + 22.0 / dn)                  # ride 22 px outside the edge, never on the art
    closed = np.vstack([hull, hull[:1]])
    seg = np.linalg.norm(np.diff(closed, axis=0), axis=1)
    cum = np.concatenate([[0], np.cumsum(seg)])
    return closed, cum, c

def point_at(closed, cum, d):
    L = cum[-1]; d = d % L
    i = int(np.searchsorted(cum, d, side="right") - 1); i = min(i, len(closed) - 2)
    t = (d - cum[i]) / max(cum[i + 1] - cum[i], 1e-6)
    return closed[i] * (1 - t) + closed[i + 1] * t

def halo_k(T):
    r = REVEAL
    if T < r - 0.35: return 0.0
    if T < r + 0.2: return 0.95 * smooth((T - (r - 0.35)) / 0.55)
    if T < r + 1.6: return 0.95 - 0.49 * smooth((T - r - 0.2) / 1.4)
    return 0.46 + 0.07 * math.sin((T - r - 1.6) * 2 * math.pi / 3.2)

STREAK_A, STREAK_B = 10.22, 10.86          # head crosses the frame (lands with the card)
ENABLE_RUNNER = False   # tested: invisible against the pale deck and the card's cream border
RUN_A, RUN_B = REVEAL + 0.05, REVEAL + 1.45 # one lap around the card
SUB = "chariotlight_v2" if a.v2 else "chariotlight"
os.makedirs(os.path.join(a.out_dir, SUB), exist_ok=True)
gold, peri, core = hexrgb("FFE2A8"), hexrgb("C9D3FF"), hexrgb("FFF8EC")
head_hist = []
for n in range(F0, NF + 1):
    T = n / FPS
    mi = mask(src_of(T))
    rgb = np.zeros((H, W, 3), np.float32); al = np.zeros((H, W), np.float32)
    def add(colour, alpha):
        global rgb, al
        alpha = np.clip(alpha, 0, 1)
        rgb = rgb * (1 - alpha[..., None]) + colour * alpha[..., None]
        al = 1 - (1 - al) * (1 - alpha)
    if mi is not None:
        m = arr(mi)
        cover = np.clip(arr(blur(mi.filter(ImageFilter.MaxFilter(5)), 3)) * 1.4, 0, 1)   # card + small margin
        outside = 1 - np.clip(arr(blur(mi, 1.2)) * 1.6, 0, 1)
        ys, xs = np.nonzero(m > 0.5); cx, cy = xs.mean(), ys.mean()
    else:
        cover = np.zeros((H, W), np.float32); outside = np.ones((H, W), np.float32); cx, cy = W * 0.6, H * 0.6

    # 1 — comet streak behind the card
    if STREAK_A - 0.05 <= T <= STREAK_B + 0.45:
        u = smooth((T - STREAK_A) / (STREAK_B - STREAK_A))
        hx = -0.18 * W + u * 1.36 * W
        hy = 0.312 * H - 70 * math.sin(u * math.pi)        # along the top of the deck, gentle arc
        if T <= STREAK_B + 0.02: head_hist.append((T, hx, hy))
        g = Image.new("L", (W, H), 0); c = Image.new("L", (W, H), 0)
        dg, dc = ImageDraw.Draw(g), ImageDraw.Draw(c)
        fade = 1 - smooth((T - STREAK_B) / 0.45)
        pts = [(t, x, y) for (t, x, y) in head_hist if T - t <= 0.30]
        for j in range(1, len(pts)):
            (t0, x0, y0), (t1, x1, y1) = pts[j - 1], pts[j]
            age = T - t1; w = max(1.5, 20 * (1 - age / 0.30)); v = (1 - age / 0.30) * fade
            for s in range(6):                               # sub-steps for a continuous ribbon
                q = s / 6; x = x0 + (x1 - x0) * q; y = y0 + (y1 - y0) * q
                dg.ellipse([x - w * 3, y - w * 1.4, x + w * 3, y + w * 1.4], fill=int(150 * v))
                dc.ellipse([x - w * 0.9, y - w * 0.35, x + w * 0.9, y + w * 0.35], fill=int(255 * v))
        if T <= STREAK_B:
            dc.ellipse([hx - 9, hy - 5, hx + 9, hy + 5], fill=255); dg.ellipse([hx - 70, hy - 30, hx + 70, hy + 30], fill=170)
        sg = arr(blur(g, 14)); sc = arr(blur(c, 2.0))
        add(peri, np.clip(sg * 1.5, 0, 1) * (1 - cover)); add(core, sc * (1 - cover))

    # 3 — halo (outside the edge only)
    k = halo_k(T)
    if k > 0 and mi is not None:
        wide = arr(blur(mi, 26)); tight = arr(blur(mi, 4))
        add(peri, np.clip(wide * 1.25, 0, 1) * outside * 0.85 * k)
        add(gold, np.clip(tight * 1.8, 0, 1) * outside * 0.55 * k)

    # 2 — edge runner (one lap, trail behind it)
    if ENABLE_RUNNER and mi is not None and RUN_A <= T <= RUN_B + 0.35:
        closed, cum, cc = hull_path(mi); L = cum[-1]
        u = smooth((T - RUN_A) / (RUN_B - RUN_A))
        fade = 1 - smooth((T - RUN_B) / 0.35)
        g = Image.new("L", (W, H), 0); c = Image.new("L", (W, H), 0)
        dg, dc = ImageDraw.Draw(g), ImageDraw.Draw(c)
        head = u * L; trail = 0.28 * L * min(1, u * 3 + 0.2)
        for s in range(0, 90):
            d = head - trail * s / 90.0
            if d < 0: break
            p = point_at(closed, cum, d)
            v = (1 - s / 90.0) ** 1.6 * fade
            r = 3.6 * (1 - s / 120.0)
            dc.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=int(255 * v))
            dg.ellipse([p[0] - r * 6, p[1] - r * 6, p[0] + r * 6, p[1] + r * 6], fill=int(160 * v))
        p = point_at(closed, cum, head)
        if fade > 0:
            dg.ellipse([p[0] - 34, p[1] - 34, p[0] + 34, p[1] + 34], fill=int(150 * fade))
        rim_zone = 1 - np.clip((arr(blur(mi.filter(ImageFilter.MinFilter(9)), 1.0)) - 0.5) * 3, 0, 1)   # nothing inside the art
        add(gold, arr(blur(g, 9)) * rim_zone)
        add(core, arr(blur(c, 1.0)) * rim_zone)

    if test is None or n in test:
        save_rgba(os.path.join(a.out_dir, SUB, "chariotlight_%04d.png" % n), rgb, al)
print("chariotlight frames", F0, NF)
