#!/usr/bin/env python3
"""The Red Thread 01 — original card art (no stock, no AI): II · TWO OF CUPS face + matching back.

Writes RGBA PNGs at 900x1540 (drawn at 2x and downsampled for clean edges):
  card_face.png, card_back.png
Usage: tools/.venv/bin/python -I tools/redthread_card.py <out_dir>
"""
import math, os, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
S = 2
CW, CH = 900 * S, 1540 * S
RAD = 54 * S
COCHIN = "/System/Library/Fonts/Supplemental/Cochin.ttc"

def hexc(h, a=255): return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
def vgrad(w, h, top, bot):
    t = np.linspace(0, 1, h)[:, None, None]
    a = np.array(hexc(top)[:3], np.float32); b = np.array(hexc(bot)[:3], np.float32)
    arr = (a * (1 - t) + b * t).repeat(w, 1)
    return Image.fromarray(arr.astype(np.uint8), "RGB").convert("RGBA")
def fill_with(base, mask, tex):
    base.alpha_composite(Image.composite(tex, Image.new("RGBA", base.size, (0, 0, 0, 0)), mask))
def gold_tex(size, light="FFEDB8", mid="F2C35E", dark="B87A2A"):
    w, h = size
    t = np.linspace(0, 1, h)[:, None]
    stops = [(0, hexc(light)[:3]), (0.45, hexc(mid)[:3]), (1, hexc(dark)[:3])]
    out = np.zeros((h, 3), np.float32)
    for i in range(3):
        out[:, i] = np.interp(t[:, 0], [s[0] for s in stops], [s[1][i] for s in stops])
    sheen = 18 * np.sin(np.linspace(0, 6 * math.pi, w))[None, :, None]
    arr = np.clip(out[:, None, :] + sheen, 0, 255)
    return Image.fromarray(arr.astype(np.uint8), "RGB").convert("RGBA")
def glow(layer, r, strength=1.0):
    g = layer.filter(ImageFilter.GaussianBlur(r))
    if strength != 1.0:
        a = np.asarray(g, np.float32); a[..., 3] = np.clip(a[..., 3] * strength, 0, 255)
        g = Image.fromarray(a.astype(np.uint8), "RGBA")
    return g
def rounded_mask(w, h, r, inset=0):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle([inset, inset, w - 1 - inset, h - 1 - inset], r, fill=255)
    return m
def sparkle(d, x, y, r, col):
    d.polygon([(x, y - r), (x + r * 0.18, y - r * 0.18), (x + r, y), (x + r * 0.18, y + r * 0.18),
               (x, y + r), (x - r * 0.18, y + r * 0.18), (x - r, y), (x - r * 0.18, y - r * 0.18)], fill=col)

def base_card(seed):
    rnd = random.Random(seed)
    card = vgrad(CW, CH, "120A2E", "3A1238")
    # a rose glow in the centre
    yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
    g = np.exp(-(((xx - CW / 2) / (CW * 0.55)) ** 2 + ((yy - CH * 0.42) / (CH * 0.38)) ** 2))
    rose = np.zeros((CH, CW, 4), np.uint8); rose[..., 0] = 255; rose[..., 1] = 120; rose[..., 2] = 170
    rose[..., 3] = (g * 70).astype(np.uint8)
    card.alpha_composite(Image.fromarray(rose, "RGBA"))
    st = Image.new("RGBA", card.size, (0, 0, 0, 0)); d = ImageDraw.Draw(st)
    for _ in range(170):
        x, y = rnd.uniform(60, CW - 60), rnd.uniform(60, CH * 0.8)
        r = rnd.uniform(1.2, 3.2) * S; a = rnd.randint(90, 230)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 240, 220, a))
    for _ in range(9):
        sparkle(d, rnd.uniform(90, CW - 90), rnd.uniform(110, CH * 0.6), rnd.uniform(9, 16) * S, (255, 236, 200, 230))
    card.alpha_composite(glow(st, 3 * S, 1.4)); card.alpha_composite(st)
    return card

def border(card):
    lay = Image.new("RGBA", card.size, (0, 0, 0, 0))
    m = Image.new("L", card.size, 0); dm = ImageDraw.Draw(m)
    dm.rounded_rectangle([14 * S, 14 * S, CW - 14 * S, CH - 14 * S], RAD - 12 * S, outline=255, width=7 * S)
    dm.rounded_rectangle([34 * S, 34 * S, CW - 34 * S, CH - 34 * S], RAD - 28 * S, outline=255, width=2 * S)
    for (cx, cy) in [(34 * S, 34 * S), (CW - 34 * S, 34 * S), (34 * S, CH - 34 * S), (CW - 34 * S, CH - 34 * S)]:
        sparkle(dm, cx, cy, 20 * S, 255)
    fill_with(lay, m, gold_tex(card.size))
    card.alpha_composite(glow(lay, 6 * S, 0.8)); card.alpha_composite(lay)

def chalice(size, flip=False):
    """A gold chalice drawn in its own box, returned as RGBA (mouth at the top)."""
    w, h = size
    m = Image.new("L", size, 0); d = ImageDraw.Draw(m)
    cx = w / 2
    bowl = []
    for i in range(41):                       # bowl outline: wide lip, rounded bottom
        t = i / 40
        x = cx + (w * 0.46) * math.cos(math.pi * t) * (1 - 0.15 * t * (1 - t))
        y = h * 0.04 + (h * 0.44) * math.sin(math.pi * t) ** 0.85 if 0 < t < 1 else h * 0.04
        bowl.append((x, y))
    d.polygon(bowl, fill=255)
    d.ellipse([cx - w * 0.46, h * 0.0, cx + w * 0.46, h * 0.09], fill=255)
    d.rectangle([cx - w * 0.055, h * 0.44, cx + w * 0.055, h * 0.86], fill=255)       # stem
    d.ellipse([cx - w * 0.13, h * 0.58, cx + w * 0.13, h * 0.66], fill=255)          # knot
    d.polygon([(cx - w * 0.06, h * 0.84), (cx + w * 0.06, h * 0.84), (cx + w * 0.34, h * 0.96), (cx - w * 0.34, h * 0.96)], fill=255)
    d.ellipse([cx - w * 0.36, h * 0.93, cx + w * 0.36, h * 1.0 - 1], fill=255)       # foot
    lay = Image.new("RGBA", size, (0, 0, 0, 0)); fill_with(lay, m, gold_tex(size))
    # inner lip shadow + a rose jewel on the bowl
    dd = ImageDraw.Draw(lay)
    dd.ellipse([cx - w * 0.40, h * 0.018, cx + w * 0.40, h * 0.072], fill=hexc("6B2A3A", 220))
    dd.ellipse([cx - w * 0.07, h * 0.24, cx + w * 0.07, h * 0.31], fill=hexc("E8557E"))
    dd.ellipse([cx - w * 0.035, h * 0.255, cx + w * 0.0, h * 0.28], fill=hexc("FFC2D4"))
    return lay.transpose(Image.FLIP_LEFT_RIGHT) if flip else lay

def heart_points(cx, cy, s, n=200):
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * s, cy - y * s))
    return pts

def face():
    card = base_card(22)
    W2, H2 = CW, CH
    # crescent moon
    mo = Image.new("L", card.size, 0); dm = ImageDraw.Draw(mo)
    mx, my, mr = W2 / 2, 210 * S, 62 * S
    dm.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill=255)
    dm.ellipse([mx - mr + 30 * S, my - mr - 10 * S, mx + mr + 30 * S, my + mr - 10 * S], fill=0)
    moon = Image.new("RGBA", card.size, (0, 0, 0, 0)); fill_with(moon, mo, gold_tex(card.size, "FFF6DC", "FFE2A0", "E0B060"))
    card.alpha_composite(glow(moon, 18 * S, 1.2)); card.alpha_composite(moon)
    # streams of light from each cup meeting under the heart
    st = Image.new("RGBA", card.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(st)
    for side in (-1, 1):
        # quadratic curve: from the cup's lip, swinging outward and up into the point of the heart
        x0, y0 = W2 / 2 + side * 215 * S, 790 * S
        cx_, cy_ = W2 / 2 + side * 330 * S, 560 * S
        x1, y1 = W2 / 2, 650 * S
        pts = []
        for i in range(80):
            t = i / 79
            x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx_ + t * t * x1
            y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy_ + t * t * y1
            pts.append((x, y))
        ds.line(pts, fill=hexc("FFB3CB", 235), width=7 * S, joint="curve")
    card.alpha_composite(glow(st, 14 * S, 1.6)); card.alpha_composite(st)
    # winged heart
    wl = Image.new("RGBA", card.size, (0, 0, 0, 0)); dw = ImageDraw.Draw(wl)
    hx, hy = W2 / 2, 560 * S
    for side in (-1, 1):
        for k in range(6):
            L = (170 - k * 18) * S; ang = math.radians(18 + k * 13)
            fx = hx + side * (60 * S + math.cos(ang) * L * 0.55); fy = hy - 10 * S - math.sin(ang) * L * 0.55
            fw, fh = L * 0.62, 26 * S
            fe = Image.new("RGBA", (int(fw * 2), int(fh * 2)), (0, 0, 0, 0))
            ImageDraw.Draw(fe).ellipse([0, fh * 0.5, fw * 2 - 1, fh * 1.5], fill=hexc("FFF1D6", 235 - k * 12))
            fe = fe.rotate(side * math.degrees(ang), resample=Image.BICUBIC, expand=True)
            wl.alpha_composite(fe, (int(fx - fe.width / 2), int(fy - fe.height / 2)))
    card.alpha_composite(glow(wl, 8 * S, 0.9)); card.alpha_composite(wl)
    hm = Image.new("L", card.size, 0); ImageDraw.Draw(hm).polygon(heart_points(hx, hy, 6.2 * S), fill=255)
    heart = Image.new("RGBA", card.size, (0, 0, 0, 0)); fill_with(heart, hm, vgrad(CW, CH, "FFB0C8", "D9365F"))
    ho = Image.new("L", card.size, 0); ImageDraw.Draw(ho).line(heart_points(hx, hy, 6.2 * S) + [heart_points(hx, hy, 6.2 * S)[0]], fill=255, width=5 * S)
    fill_with(heart, ho, gold_tex(card.size))
    card.alpha_composite(glow(heart, 22 * S, 1.3)); card.alpha_composite(heart)
    # the two cups, leaning toward each other
    cw_, ch_ = 300 * S, 470 * S
    for side in (-1, 1):
        c = chalice((cw_, ch_), flip=side > 0).rotate(-side * 8, resample=Image.BICUBIC, expand=True)
        x = int(W2 / 2 + side * 205 * S - c.width / 2); y = int(760 * S)
        sh = Image.new("RGBA", c.size, (0, 0, 0, 0)); sh.putalpha(c.getchannel("A").point(lambda v: v * 0.6))
        card.alpha_composite(glow(Image.merge("RGBA", (*Image.new("RGB", c.size, (255, 200, 120)).split(), c.getchannel("A"))), 16 * S, 0.7), (x, y))
        card.alpha_composite(c, (x, y))
    # red thread: an infinity knot tying the two stems together
    th = Image.new("RGBA", card.size, (0, 0, 0, 0)); dt = ImageDraw.Draw(th)
    pts = []
    for i in range(240):
        t = 2 * math.pi * i / 239
        den = 1 + math.sin(t) ** 2
        pts.append((W2 / 2 + 205 * S * math.cos(t) / den, 1085 * S + 70 * S * math.sin(t) * math.cos(t) / den))
    dt.line(pts, fill=hexc("E8264E", 255), width=6 * S, joint="curve")
    card.alpha_composite(glow(th, 10 * S, 1.5)); card.alpha_composite(th)
    # title band
    band = Image.new("RGBA", card.size, (0, 0, 0, 0)); db = ImageDraw.Draw(band)
    db.rounded_rectangle([80 * S, 1300 * S, W2 - 80 * S, 1450 * S], 26 * S, fill=hexc("0E0824", 215))
    card.alpha_composite(band)
    tx = Image.new("L", card.size, 0); dtx = ImageDraw.Draw(tx)
    f1 = ImageFont.truetype(COCHIN, 40 * S, index=1); f2 = ImageFont.truetype(COCHIN, 66 * S, index=1)
    dtx.text((W2 / 2, 1338 * S), "II", font=f1, fill=255, anchor="mm")
    title = "TWO OF CUPS"; sp = 9 * S
    widths = [dtx.textlength(ch, font=f2) for ch in title]; total = sum(widths) + sp * (len(title) - 1)
    x = W2 / 2 - total / 2
    for ch, wch in zip(title, widths):
        dtx.text((x, 1404 * S), ch, font=f2, fill=255, anchor="lm"); x += wch + sp
    tl = Image.new("RGBA", card.size, (0, 0, 0, 0)); fill_with(tl, tx, gold_tex(card.size))
    card.alpha_composite(glow(tl, 6 * S, 0.8)); card.alpha_composite(tl)
    border(card)
    return card

def back():
    card = base_card(77)
    lay = Image.new("RGBA", card.size, (0, 0, 0, 0)); m = Image.new("L", card.size, 0); d = ImageDraw.Draw(m)
    cx, cy = CW / 2, CH / 2
    for r, wdt in [(330, 4), (300, 2), (205, 3), (120, 2)]:
        d.ellipse([cx - r * S, cy - r * S, cx + r * S, cy + r * S], outline=255, width=wdt * S)
    for k in range(16):
        a = 2 * math.pi * k / 16
        d.line([(cx + math.cos(a) * 120 * S, cy + math.sin(a) * 120 * S), (cx + math.cos(a) * 300 * S, cy + math.sin(a) * 300 * S)], fill=255, width=2 * S)
    star = []
    for k in range(16):
        a = 2 * math.pi * k / 16 - math.pi / 2; r = (205 if k % 2 == 0 else 95) * S
        star.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    d.polygon(star, outline=255, width=3 * S)
    for k in range(36):
        a = 2 * math.pi * k / 36; r = 316 * S
        d.ellipse([cx + math.cos(a) * r - 5 * S, cy + math.sin(a) * r - 5 * S, cx + math.cos(a) * r + 5 * S, cy + math.sin(a) * r + 5 * S], fill=255)
    d.polygon(heart_points(cx, cy + 6 * S, 3.4 * S), outline=255, width=4 * S)
    for (y, s) in [(260, 1), (CH / S - 260, -1)]:
        sparkle(d, cx, y * S, 34 * S, 255)
    fill_with(lay, m, gold_tex(card.size))
    card.alpha_composite(glow(lay, 10 * S, 1.0)); card.alpha_composite(lay)
    border(card)
    return card

for name, img in [("card_face.png", face()), ("card_back.png", back())]:
    a = img.getchannel("A"); a = ImageChops.multiply(a, rounded_mask(CW, CH, RAD)); img.putalpha(a)
    img.resize((CW // S, CH // S), Image.LANCZOS).save(os.path.join(OUT, name))
    print("wrote", name)
