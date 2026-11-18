#!/usr/bin/env python3
"""The Red Thread 01 — the animated "world" plate (1080x1920, 30 fps, 534 frames), fully original.

Night sky (indigo -> plum, slow nebula, twinkling stars, drifting stardust), two lights
(rose-gold and moonlight) joined by a glowing red thread:
  0.0-5.6  the lights drift apart; the thread stretches thin and trembles
  5.6-8.6  pulses of light run along the thread; it holds
  10.4     (card reveal happens in After Effects, in front of this plate)
  10.45-11.45 the lights glide back along the thread and meet above the card -> bloom of light
  11.45-   a warm glow rests behind the top of the card
Writes an H.264 (CRF 12) file for After Effects. Timings must match ae/redthread01/build_redthread01.jsx.
Usage: tools/.venv/bin/python -I tools/redthread_world.py <out.mp4> [--frames 0,100,...  (PNG previews instead)]
"""
import math, random, subprocess, sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

out = sys.argv[1]
preview = None
if len(sys.argv) > 3 and sys.argv[2] == "--frames": preview = [int(x) for x in sys.argv[3].split(",")]
W, H, FPS, NF = 1080, 1920, 30, 534
CARD_Y = 1150; MEET = (540.0, 700.0)
REVEAL = 10.4; T_GO, T_MEET = 10.45, 11.45
rnd = random.Random(1114)

def smooth(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def ease_io(x): x = min(max(x, 0.0), 1.0); return 0.5 - 0.5 * math.cos(math.pi * x)
def hexa(h): return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)

# ---------- static sky gradient + nebula fields (low-res, upsampled per frame)
y = np.linspace(0, 1, H)[:, None, None]
sky = hexa("0A0720") * (1 - y) + hexa("2C0F30") * y
sky = np.repeat(sky, W, 1)
def noise_field(seed, gw, gh):
    r = np.random.default_rng(seed)
    a = r.random((gh, gw)).astype(np.float32)
    im = Image.fromarray((a * 255).astype(np.uint8)).resize((270, 480), Image.BICUBIC).filter(ImageFilter.GaussianBlur(14))
    return np.asarray(im, np.float32) / 255.0
N1, N2, N3 = noise_field(1, 6, 10), noise_field(2, 12, 20), noise_field(3, 24, 40)
neb_rose, neb_violet = hexa("B0306A"), hexa("4A2C9E")

stars = [dict(x=rnd.uniform(0, W), y=rnd.uniform(0, H * 0.92), r=rnd.uniform(0.7, 2.0), a=rnd.uniform(0.25, 0.9),
              tw=rnd.uniform(1.0, 3.5), ph=rnd.uniform(0, 6.28)) for _ in range(260)]
dust = [dict(x=rnd.uniform(0, W), y=rnd.uniform(0, H), vx=rnd.uniform(-6, 6), vy=-rnd.uniform(6, 18), r=rnd.uniform(1.0, 2.4),
             a=rnd.uniform(0.2, 0.6), ph=rnd.uniform(0, 6.28)) for _ in range(70)]

_spr = {}
def sprite(R, col, amax):
    key = (int(R), col, int(amax * 50))
    if key not in _spr:
        n = int(R * 2.6); yy, xx = np.mgrid[-n:n + 1, -n:n + 1].astype(np.float32)
        a = np.exp(-(xx * xx + yy * yy) / (R * R)) * amax
        arr = np.zeros(a.shape + (4,), np.uint8); arr[..., 0], arr[..., 1], arr[..., 2] = col
        arr[..., 3] = (np.clip(a, 0, 1) * 255).astype(np.uint8)
        _spr[key] = Image.fromarray(arr, "RGBA")
    return _spr[key]
def blob(layer, x, y, R, col, amax):
    sp = sprite(R, col, amax); layer.alpha_composite(sp, (int(x - sp.width / 2), int(y - sp.height / 2)))

# ---------- story motion
def orb_positions(T):
    bob = lambda k: 10 * math.sin(T * 1.1 + k)
    if T < T_GO:
        u = ease_io(T / 5.6)
        ax = 430 - (430 - 75) * u; bx = 650 + (1005 - 650) * u
        return (ax, CARD_Y + bob(0)), (bx, CARD_Y + bob(2))
    u = ease_io((T - T_GO) / (T_MEET - T_GO))
    def bez(p0, c, p1, t): return ((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
                                  (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1])
    a0 = (75, CARD_Y + 10 * math.sin(T_GO * 1.1)); b0 = (1005, CARD_Y + 10 * math.sin(T_GO * 1.1 + 2))
    if T >= T_MEET: return MEET, MEET
    return bez(a0, (150, 720), MEET, u), bez(b0, (930, 720), MEET, u)

def tension(T):  # 0 = slack, 1 = taut
    return smooth(T / 5.0) if T < T_GO else 1 - smooth((T - T_GO) / 0.8)

def thread_points(A, B, T, n=140):
    k = tension(T)
    sag = 115 * (1 - k) + 18
    pts = []
    for i in range(n):
        t = i / (n - 1)
        x = A[0] + (B[0] - A[0]) * t; yv = A[1] + (B[1] - A[1]) * t + sag * math.sin(math.pi * t)
        shake = (4.0 * smooth((T - 2.6) / 0.6) * (1 - smooth((T - 5.6) / 0.6))) * math.sin(t * 29 + T * 31) * math.sin(math.pi * t)
        pts.append((x, yv + shake))
    return pts

def frame(n):
    T = n / FPS
    # nebula
    nb = 0.55 * N1 + 0.3 * np.roll(N2, int(T * 4), 1) + 0.15 * np.roll(N3, int(-T * 7), 0)
    nb = np.clip((nb - 0.45) * 2.2, 0, 1)
    nbu = np.asarray(Image.fromarray((nb * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32)[..., None] / 255.0
    mix = np.asarray(Image.fromarray((np.roll(N2, 3, 0) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32)[..., None] / 255.0
    img = sky + nbu * 0.30 * (neb_rose * mix + neb_violet * (1 - mix))
    base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    # stars + stardust
    st = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(st)
    for s in stars:
        a = s["a"] * (0.6 + 0.4 * math.sin(T * s["tw"] + s["ph"]))
        r = s["r"]; d.ellipse([s["x"] - r, s["y"] - r, s["x"] + r, s["y"] + r], fill=(255, 244, 230, int(255 * a)))
    for p in dust:
        x = (p["x"] + p["vx"] * T) % W; yy = (p["y"] + p["vy"] * T) % H
        a = p["a"] * (0.6 + 0.4 * math.sin(T * 2 + p["ph"])); r = p["r"]
        d.ellipse([x - r, yy - r, x + r, yy + r], fill=(255, 214, 200, int(255 * a)))
    base.alpha_composite(st.filter(ImageFilter.GaussianBlur(1.6))); base.alpha_composite(st)

    A, B = orb_positions(T)
    light = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dl = ImageDraw.Draw(light)
    soft = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    core = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dc = ImageDraw.Draw(core)

    # the red thread
    thread_fade = 1 - smooth((T - (T_MEET - 0.25)) / 0.3)
    if thread_fade > 0:
        pts = thread_points(A, B, T)
        k = tension(T)
        w = 6.0 - 3.4 * k + (1.2 if 5.6 <= T < T_GO else 0)
        bright = (0.95 - 0.35 * smooth((T - 2.6) / 2.5) + 0.35 * smooth((T - 5.6) / 0.5)) * thread_fade
        dl.line(pts, fill=(255, 60, 95, int(200 * bright)), width=int(w * 5), joint="curve")
        dc.line(pts, fill=(255, 120, 140, int(255 * bright)), width=max(1, int(w)), joint="curve")
        # pulses travelling the thread (5.9 and 7.1 s), A -> B then B -> A
        for t0, rev in [(5.9, False), (7.1, True)]:
            u = (T - t0) / 1.1
            if 0 <= u <= 1:
                idx = int((1 - u if rev else u) * (len(pts) - 1)); px, py = pts[idx]
                dl.ellipse([px - 46, py - 46, px + 46, py + 46], fill=(255, 190, 170, int(170 * math.sin(math.pi * u))))
                dc.ellipse([px - 7, py - 7, px + 7, py + 7], fill=(255, 248, 236, int(255 * math.sin(math.pi * u))))

    # the two lights
    for (P, col, k) in [(A, (255, 190, 150), 0), (B, (214, 226, 255), 2)]:
        pulse = 1 + 0.08 * math.sin(T * 2.4 + k)
        if T >= T_MEET: continue
        blob(soft, P[0], P[1], 95 * pulse, col, 0.42)
        blob(soft, P[0], P[1], 34 * pulse, col, 0.85)
        blob(soft, P[0], P[1], 11, (255, 250, 242), 1.0)

    # reunion bloom + resting glow
    if T >= T_MEET - 0.05:
        u = (T - T_MEET) / 1.2
        if u <= 1:
            for ring_k, ring_c in [(0, (255, 205, 170)), (0.18, (255, 150, 185))]:
                v = u - ring_k
                if 0 <= v <= 1:
                    rr = 30 + 330 * (1 - (1 - v) ** 2.5); a = int(170 * (1 - v) ** 1.3)
                    dl.ellipse([MEET[0] - rr, MEET[1] - rr * 0.82, MEET[0] + rr, MEET[1] + rr * 0.82], outline=ring_c + (a,), width=int(10 + 30 * v))
        k_rest = 1.0 - 0.55 * smooth((T - T_MEET) / 1.0)
        R = 130 * (1 + 0.7 * (1 - smooth((T - T_MEET) / 0.5))) * (1 + 0.05 * math.sin(T * 2.2))
        blob(soft, MEET[0], MEET[1], R, (255, 196, 175), 0.55 * k_rest)
        blob(soft, MEET[0], MEET[1], 40, (255, 225, 205), 0.9 * k_rest)
        blob(soft, MEET[0], MEET[1], 13, (255, 250, 242), 1.0 * k_rest)
        # sparks thrown out by the bloom
        if u <= 1:
            sr = random.Random(77)
            for i in range(46):
                ang = sr.uniform(0, 2 * math.pi); sp = sr.uniform(140, 420); life = sr.uniform(0.7, 1.2)
                v = (T - T_MEET) / life
                if 0 <= v <= 1:
                    dist = sp * (1 - (1 - v) ** 2)
                    x = MEET[0] + math.cos(ang) * dist; yy = MEET[1] + math.sin(ang) * dist * 0.8 - 40 * v
                    a = int(255 * (1 - v)); r = 2.6 * (1 - v) + 1
                    dc.ellipse([x - r, yy - r, x + r, yy + r], fill=(255, 225, 205, a))
                    dl.ellipse([x - r * 5, yy - r * 5, x + r * 5, yy + r * 5], fill=(255, 170, 160, a // 3))

    base.alpha_composite(soft)
    base.alpha_composite(light.filter(ImageFilter.GaussianBlur(26)))
    base.alpha_composite(light.filter(ImageFilter.GaussianBlur(8)))
    base.alpha_composite(core.filter(ImageFilter.GaussianBlur(1.2)))
    base.alpha_composite(core)
    return base.convert("RGB")

if preview:
    os.makedirs(out, exist_ok=True)
    for n in preview: frame(n).save(os.path.join(out, "world_%04d.png" % n))
    print("previews", preview)
else:
    cmd = ["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "pipe:0",
           "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709",
           "-colorspace", "bt709", "-movflags", "+faststart", out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for n in range(NF): p.stdin.write(frame(n).tobytes())
    p.stdin.close()
    if p.wait(): raise SystemExit("encode failed")
    print("world", NF, "frames ->", out)
