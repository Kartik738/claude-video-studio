#!/usr/bin/env python3
"""Universe Love Message 02 — custom overlay sequences (1080x1920 RGBA PNG, 30 fps).

  cardlight/  SOURCE space (lives inside the 4K scene comp at 200%, so the camera move applies):
              soft volumetric light rays radiating from behind the card's outer edge (never on the
              artwork) + a warm rim + motes that lift off the card edge at the reveal.
  dust/       REEL space: slow celestial stardust with depth (far glints, mid motes, near bokeh).
              Thinned over the text band and kept off the card's artwork.
  scrim.png   REEL space: twilight graduated darkening behind the text band (static).

Timeline <-> source mapping and camera must match ae/universe02/build_universe02.jsx.
"""
import argparse, math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("mask_dir"); ap.add_argument("out_dir")
ap.add_argument("--only", default="scrim,cardlight,dust")
ap.add_argument("--frames", default="")  # optional comma list for tests
a = ap.parse_args()
W, H, FPS = 1080, 1920, 30
NF = 434
REVEAL = 8.1333           # src 11.5 s
LIGHT_START = 6.9
only = set(a.only.split(","))
test_frames = [int(x) for x in a.frames.split(",")] if a.frames else None

# ------------------------------------------------------------- timeline maps (keep in sync with the .jsx)
def src_of(T):
    if T < 2.5: return 3.7 + (T - 1.0)
    if T < 5.8333: return 5.2 + (T - 2.5) * 1.2
    return 9.2 + (T - 5.8333)

def smooth(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def ease_io(x): x = min(max(x, 0.0), 1.0); return 0.5 - 0.5 * math.cos(math.pi * x)

PX, PY = 472.5, 959.0     # card centre (1080-space) = camera anchor
def cam_scale(T):
    if T < 0.85: return 1.10
    if T < 5.8: return 1.10 - 0.10 * ease_io((T - 0.85) / (5.8 - 0.85))
    if T < REVEAL: return 1.0
    return 1.0 + 0.065 * ease_io((T - REVEAL) / (NF / FPS - REVEAL))

files = sorted(int(f[:-4]) for f in os.listdir(a.mask_dir) if f.endswith(".png") and f[:-4].isdigit())
_mcache = {}
def mask_small(src_s):
    """card mask at 432x768 (float 0..1); SAM masks keep the mask in the RED channel."""
    ms = src_s * 1000
    m = min(files, key=lambda f: abs(f - ms))
    if m not in _mcache:
        im = Image.open(os.path.join(a.mask_dir, "%06d.png" % m)).convert("RGB").split()[0].resize((432, 768), Image.BILINEAR)
        _mcache[m] = np.asarray(im, np.float32) / 255.0
    return _mcache[m]

def blurf(arr, r):
    im = Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))
    return np.asarray(im, np.float32) / 255.0

def up(arr, size=(W, H)):
    return np.asarray(Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8)).resize(size, Image.BICUBIC), np.float32) / 255.0

def save_rgba(path, rgb, al):
    al = np.clip(al, 0, 1)
    out = np.zeros((H, W, 4), np.uint8)
    safe = np.where(al > 1e-4, al, 1)
    out[..., :3] = np.clip(rgb / safe[..., None], 0, 255).astype(np.uint8)
    out[..., 3] = (al * 255).astype(np.uint8)
    Image.fromarray(out).save(path, compress_level=1)

def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)

# ------------------------------------------------------------- scrim
if "scrim" in only:
    y = (np.arange(H, dtype=np.float32) / H)[:, None]
    x = (np.arange(W, dtype=np.float32) / W)[None, :]
    top = np.clip(1 - y / 0.42, 0, 1) ** 1.1 * 0.60                       # graduated "twilight" filter
    ell = np.exp(-(((x - 0.5) / 0.62) ** 2 + ((y - 0.200) / 0.090) ** 2) * 1.0) * 0.40   # local pool behind text
    al = 1 - (1 - top) * (1 - ell)
    al = np.repeat(al, 1, 1) if al.shape[1] == W else np.broadcast_to(al, (H, W))
    al = np.broadcast_to(al, (H, W))
    col = np.zeros((H, W, 3), np.float32)
    c_top, c_low = hexrgb("120A24"), hexrgb("1E0B1A")                     # indigo night -> plum
    mix = np.clip(y / 0.42, 0, 1)
    col[:] = (c_top[None, None] * (1 - mix[..., None]) + c_low[None, None] * mix[..., None])
    save_rgba(os.path.join(a.out_dir, "scrim.png"), col * al[..., None], al)
    print("scrim ok")

# ------------------------------------------------------------- card light
def light_k(T):
    r = REVEAL
    if T < LIGHT_START: return 0.0
    if T < r: return 0.45 * smooth((T - LIGHT_START) / (r - LIGHT_START))
    if T < r + 0.25: return 0.45 + 0.55 * smooth((T - r) / 0.25)
    if T < r + 1.6: return 1.0 - 0.66 * smooth((T - r - 0.25) / 1.35)
    return 0.34 + 0.06 * math.sin((T - r - 1.6) * 2 * math.pi / 3.6)

def edge_points(m, n, rnd):
    e = (blurf(m, 2) > 0.5).astype(np.float32)
    inner = (blurf(e, 3) > 0.92).astype(np.float32)
    ring = np.argwhere((e - inner) > 0.5)
    if len(ring) == 0: return []
    idx = [rnd.randrange(len(ring)) for _ in range(n)]
    return [(ring[i][1] * W / 432.0, ring[i][0] * H / 768.0) for i in idx]

if "cardlight" in only:
    d = os.path.join(a.out_dir, "cardlight"); os.makedirs(d, exist_ok=True)
    warm, violet, rimc = hexrgb("FFD9A6"), hexrgb("D9BFFF"), hexrgb("FFF0DC")
    rnd = random.Random(70612)
    motes = []
    n0, n1 = int(round(LIGHT_START * FPS)), NF
    yy, xx = np.mgrid[0:768, 0:432].astype(np.float32)
    for n in range(n0, n1 + 1):
        T = n / FPS
        k = light_k(T)
        m = mask_small(src_of(T))
        if m.sum() < 50:
            continue
        ys, xs = np.nonzero(m > 0.5)
        cx, cy = xs.mean(), ys.mean()
        inside = np.clip((blurf(m, 1.5) - 0.3) * 3, 0, 1)
        outside = 1 - np.clip(blurf(inside, 2.5) * 1.6, 0, 1)
        edge = np.clip(blurf(m, 5) * (1 - m) * 2.2, 0, 1)
        ang = np.arctan2(yy - cy, xx - cx)
        pat = (0.45 + 0.55 * (0.5 + 0.5 * np.sin(7 * ang + T * 0.35))) * (0.55 + 0.45 * (0.5 + 0.5 * np.sin(17 * ang - T * 0.22 + 1.3)))
        srcl = Image.fromarray(np.clip(edge * pat * 255, 0, 255).astype(np.uint8))
        near = np.zeros((768, 432), np.float32); far = np.zeros((768, 432), np.float32)
        for j in range(26):
            s = 1 + 0.028 * j
            # zoom about (cx, cy): output(x) = input(c + (x - c)/s)
            im = srcl.transform((432, 768), Image.AFFINE, (1 / s, 0, cx - cx / s, 0, 1 / s, cy - cy / s), Image.BILINEAR)
            v = np.asarray(im, np.float32) / 255.0 * (0.91 ** j)
            if j < 9: near += v
            else: far += v
        up_w = 0.22 + 0.78 * np.clip(-np.sin(ang) * 1.2 + 0.3, 0, 1)
        near = blurf(near / 5.0, 2.5) * outside * up_w; far = blurf(far / 4.0, 5) * outside * up_w
        rim = np.clip(blurf(m, 2.2) * (1 - m) * 3.0, 0, 1) * outside
        aN, aF, aR = up(near), up(far), up(rim)
        a_n = np.clip(aN * 2.6 * k, 0, 0.75); a_f = np.clip(aF * 1.3 * k, 0, 0.4); a_r = np.clip(aR * 0.6 * k, 0, 1)
        al = 1 - (1 - a_n) * (1 - a_f) * (1 - a_r)
        rgb = warm * a_n[..., None] + violet * a_f[..., None] + rimc * a_r[..., None]
        # motes lifting off the card edge: a soft burst at the reveal, then a gentle trickle
        if abs(T - REVEAL) < 0.5 / FPS:
            for (px, py) in edge_points(m, 26, rnd):
                motes.append(dict(t0=T, x=px, y=py, vx=(px - cx * W / 432) * rnd.uniform(0.06, 0.16), vy=-rnd.uniform(30, 70),
                                  life=rnd.uniform(1.6, 3.2), r=rnd.uniform(1.6, 3.4), ph=rnd.uniform(0, 6.28)))
        elif T > REVEAL and rnd.random() < 4.0 / FPS:
            for (px, py) in edge_points(m, 1, rnd):
                motes.append(dict(t0=T, x=px, y=py, vx=(px - cx * W / 432) * rnd.uniform(0.03, 0.08), vy=-rnd.uniform(18, 40),
                                  life=rnd.uniform(1.8, 3.0), r=rnd.uniform(1.4, 2.8), ph=rnd.uniform(0, 6.28)))
        if motes:
            g = Image.new("L", (W, H), 0); c = Image.new("L", (W, H), 0)
            dg, dc = ImageDraw.Draw(g), ImageDraw.Draw(c)
            for p in motes:
                age = T - p["t0"]
                if age < 0 or age > p["life"]: continue
                la = smooth(age / 0.3) * (1 - smooth((age - p["life"] + 0.8) / 0.8)) * (0.75 + 0.25 * math.sin(age * 9 + p["ph"]))
                x = p["x"] + p["vx"] * age + 6 * math.sin(age * 2 + p["ph"]); y = p["y"] + p["vy"] * age
                r = p["r"]; G = r * 4
                dg.ellipse([x - G, y - G, x + G, y + G], fill=int(110 * la)); dc.ellipse([x - r, y - r, x + r, y + r], fill=int(255 * la))
            motes = [p for p in motes if T - p["t0"] <= p["life"]]
            mg = np.asarray(g.filter(ImageFilter.GaussianBlur(6)), np.float32) / 255.0
            mc = np.asarray(c.filter(ImageFilter.GaussianBlur(0.8)), np.float32) / 255.0
            insideF = up(inside)
            mg *= (1 - insideF); mc *= (1 - insideF)          # never over the artwork
            rgb = rgb * (1 - mg[..., None]) + hexrgb("FFDDB0") * mg[..., None]; al = 1 - (1 - al) * (1 - mg)
            rgb = rgb * (1 - mc[..., None]) + hexrgb("FFF6E8") * mc[..., None]; al = 1 - (1 - al) * (1 - mc)
        if test_frames is None or n in test_frames:
            save_rgba(os.path.join(d, "cardlight_%04d.png" % n), rgb, al)
    print("cardlight frames", n0, n1)

# ------------------------------------------------------------- stardust (reel space)
def dust_level(T):
    base = 0.55 + 0.25 * smooth((T - 4.3) / 0.8)          # lifts with the main message
    return base * (1 - 0.35 * smooth((T - 12.8) / 1.2))   # thins out under the CTA

if "dust" in only:
    d = os.path.join(a.out_dir, "dust"); os.makedirs(d, exist_ok=True)
    rnd = random.Random(7061)
    def spawn(t, pre=False):
        kind = rnd.choices(["far", "mid", "near"], [0.55, 0.35, 0.10])[0]
        sp = {"far": 0.45, "mid": 0.75, "near": 1.2}[kind]
        return dict(t0=t, kind=kind, life=rnd.uniform(3.5, 6.5), x=rnd.uniform(-40, W + 40), y=rnd.uniform(0.05, 0.95) * H,
                    vx=rnd.uniform(6, 16) * sp, vy=-rnd.uniform(10, 24) * sp, sw=rnd.uniform(6, 18), f=rnd.uniform(0.15, 0.4),
                    ph=rnd.uniform(0, 6.28), tw=rnd.uniform(2.5, 6.5),
                    r={"far": rnd.uniform(0.9, 1.6), "mid": rnd.uniform(1.8, 2.8), "near": rnd.uniform(9, 16)}[kind],
                    amp={"far": rnd.uniform(0.5, 0.9), "mid": rnd.uniform(0.55, 0.95), "near": rnd.uniform(0.10, 0.18)}[kind],
                    c=rnd.choice([(255, 226, 180), (255, 236, 205), (226, 206, 255), (255, 214, 196)]))
    parts = [spawn(-rnd.uniform(0, 5)) for _ in range(60)]
    y = (np.arange(H, dtype=np.float32) / H)[:, None]
    band = 1 - 0.75 * np.exp(-((y - 0.200) / 0.095) ** 4)    # thin the stardust over the text band
    band = np.broadcast_to(band, (H, W))
    acc = 0.0
    for n in range(0, NF + 1):
        T = n / FPS
        acc += 11.0 / FPS
        while acc >= 1: parts.append(spawn(T)); acc -= 1
        lvl = dust_level(T)
        g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); c = Image.new("RGBA", (W, H), (0, 0, 0, 0)); b = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        dg, dc, db = ImageDraw.Draw(g), ImageDraw.Draw(c), ImageDraw.Draw(b)
        for p in parts:
            age = T - p["t0"]
            if age < 0 or age > p["life"]: continue
            la = smooth(age / 0.8) * (1 - smooth((age - p["life"] + 1.2) / 1.2))
            tw = 0.65 + 0.35 * math.sin(age * p["tw"] + p["ph"])
            al = min(1.0, p["amp"] * la * tw * lvl * 1.4)
            x = p["x"] + p["vx"] * age + p["sw"] * math.sin(age * p["f"] * 6.28 + p["ph"]); yy = p["y"] + p["vy"] * age
            r = p["r"]
            if p["kind"] == "near":
                db.ellipse([x - r, yy - r, x + r, yy + r], fill=p["c"] + (int(255 * al),))
            else:
                G = r * 5
                dg.ellipse([x - G, yy - G, x + G, yy + G], fill=p["c"] + (int(120 * al),))
                dc.ellipse([x - r, yy - r, x + r, yy + r], fill=(255, 248, 236, int(255 * al)))
        out = Image.alpha_composite(b.filter(ImageFilter.GaussianBlur(7)), g.filter(ImageFilter.GaussianBlur(5)))
        out = Image.alpha_composite(out, c.filter(ImageFilter.GaussianBlur(0.6)))
        arr = np.asarray(out, np.float32)
        keep = band.copy()
        if T >= 6.6:                                         # keep off the card's artwork (camera-transformed mask)
            m = mask_small(src_of(T))
            if m.sum() > 50:
                s = cam_scale(T)
                mi = Image.fromarray((m * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
                mi = mi.transform((W, H), Image.AFFINE, (1 / s, 0, PX - PX / s, 0, 1 / s, PY - PY / s), Image.BILINEAR)
                cm = np.asarray(mi.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(10)), np.float32) / 255.0
                keep = keep * (1 - np.clip(cm * 1.3, 0, 1))
        arr[..., 3] *= keep
        parts = [p for p in parts if T - p["t0"] <= p["life"]]
        if test_frames is None or n in test_frames:
            Image.fromarray(arr.astype(np.uint8)).save(os.path.join(d, "dust_%04d.png" % n), compress_level=1)
    print("dust frames 0", NF)
