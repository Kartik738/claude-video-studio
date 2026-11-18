#!/usr/bin/env python3
"""Print a loudness/brightness profile of an audio or video file (0.5 s steps) plus a tempo estimate."""
import subprocess, sys, numpy as np
p = sys.argv[1]; sr = 22050
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.float32)
hop = sr // 2
rows = []
for i in range(0, len(x) - hop, hop):
    s = x[i:i + hop]; rms = 20 * np.log10(np.sqrt((s ** 2).mean()) + 1e-9)
    sp = np.abs(np.fft.rfft(s * np.hanning(len(s)))); fr = np.fft.rfftfreq(len(s), 1 / sr)
    cen = (sp * fr).sum() / (sp.sum() + 1e-9)
    rows.append((i / sr, rms, cen))
print("t     dB     centroidHz  bar")
for t, r, c in rows: print(f"{t:5.1f} {r:6.1f} {c:7.0f}  " + "#" * max(0, int((r + 50) / 1.5)))
# onset envelope tempo (autocorrelation)
fh = 512; n = len(x) // fh
env = np.array([np.sqrt((x[k*fh:(k+1)*fh] ** 2).mean()) for k in range(n)])
d = np.maximum(0, np.diff(np.log(env + 1e-6))); d -= d.mean()
ac = np.correlate(d, d, "full")[len(d) - 1:]
lags = np.arange(len(ac)) * fh / sr
ok = (lags > 60 / 180) & (lags < 60 / 50)
best = lags[ok][np.argmax(ac[ok])]
print("tempo estimate ~ %.1f BPM" % (60 / best))
