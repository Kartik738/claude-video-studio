"""Generate custom Adobe Media Encoder presets by cloning Adobe's built-in
'H264 Match Source - High bitrate' preset and changing only bitrate + name.
Usage: python3 -I make_ame_presets.py <output_dir>"""
import re, sys, uuid, glob, os
SRC = glob.glob("/Applications/Adobe Media Encoder 2027/**/H264 Match Source - High bitrate.epr", recursive=True)[0]
PRESETS = [
    # name, target Mbps, max Mbps, min Mbps, comment
    ("TV Reels 9x16 - H264 16-24Mbps", 16, 24, 8, "Instagram/Facebook Reels and YouTube Shorts. Matches comp size (use a 1080x1920 comp). VBR 2-pass."),
    ("TV Review Copy - H264 6-8Mbps", 6, 8, 2, "Small file to send for feedback on WhatsApp/email. Matches source size."),
    ("TV Master - H264 40-50Mbps", 40, 50, 20, "High quality master/archive copy. Matches source size."),
]
t = open(SRC, encoding="utf-8").read()
def set_param(text, ident, value):
    def fix(m):
        b = m.group(0)
        if f"<ParamIdentifier>{ident}<" in b:
            b = re.sub(r"<ParamValue>[^<]*</ParamValue>", f"<ParamValue>{value}</ParamValue>", b, count=1)
        return b
    return re.sub(r"<ExporterParam [^>]*>.*?</ExporterParam>", fix, text, flags=re.S)
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
for name, tgt, mx, mn, comment in PRESETS:
    s = t
    s = re.sub(r"<PresetName>.*?</PresetName>", f"<PresetName>{name}</PresetName>", s, count=1)
    s = re.sub(r"<PresetComments>.*?</PresetComments>", f"<PresetComments>{comment}</PresetComments>", s, count=1)
    s = re.sub(r"<PresetID>[^<]*</PresetID>", f"<PresetID>{uuid.uuid4()}</PresetID>", s, count=1)
    s = set_param(s, "ADBEVideoTargetBitrate", f"{tgt}.")
    s = set_param(s, "ADBEVideoMaxBitrate", f"{mx}.")
    s = set_param(s, "ADBEVideoMinBitrate", f"{mn}.")
    open(os.path.join(out, name + ".epr"), "w", encoding="utf-8").write(s)
    print("wrote", name)
