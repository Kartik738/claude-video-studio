#!/usr/bin/env python3
"""Rough musical character of an audio file: onset rate, percussiveness (HF transients), dynamics."""
import subprocess, sys, numpy as np
for p in sys.argv[1:]:
    sr = 22050
    x = np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",p,"-ac","1","-ar",str(sr),"-f","f32le","-"],capture_output=True).stdout, np.float32)
    x = x[int(1.6*sr):]  # skip silent lead-in
    n = 1024; h = 512; fr = np.fft.rfftfreq(n, 1/sr)
    frames = np.lib.stride_tricks.sliding_window_view(x, n)[::h] * np.hanning(n)
    S = np.abs(np.fft.rfft(frames, axis=1))
    flux = np.maximum(0, np.diff(np.log1p(S*10), axis=0)).sum(1)
    hf = np.maximum(0, np.diff(np.log1p(S[:, fr > 4000]*10), axis=0)).sum(1)
    thr = np.median(flux) + 1.5*flux.std()
    pk = [i for i in range(1, len(flux)-1) if flux[i] > thr and flux[i] >= flux[i-1] and flux[i] >= flux[i+1]]
    dur = len(x)/sr
    hfr = np.percentile(hf, 99) / (np.median(hf) + 1e-6)
    rms = np.sqrt((frames**2).mean(1)); db = 20*np.log10(rms+1e-9)
    print(f"{p.split('/')[-1]:32s} onsets/s {len(pk)/dur:4.2f}  HF-transient ratio {hfr:5.1f}  dyn-range(p95-p10) {np.percentile(db,95)-np.percentile(db,10):4.1f} dB  loud(p95) {np.percentile(db,95):5.1f}")
