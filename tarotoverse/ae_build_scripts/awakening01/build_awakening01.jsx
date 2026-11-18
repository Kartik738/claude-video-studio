// Tarotoverse — Awakening 01 (After Effects 2027 build)
// Raw footage: ~/Downloads/IMG_2707.MOV (2160x3840 portrait, 30 fps, 17.87 s) — imported, never modified.
// Oracle card: AWAKENING (Krishna deck) — "Oh my Lord, wake me from life as a spiritual sheep.
//              May I hear You through my own instincts and common sense." (printed on the card; never altered)
// Edit (reel frames @30, 476 frames = 15.87 s):
//   T 0.000-6.200   src 0.30-9.60   @1.5x  shuffling
//   T 6.200-8.833   src 9.60-12.23  @1.0x  pull + rise
//   T 8.833-15.867  src 12.23-17.86 @0.8x  hold on AWAKENING
//   Card clearly revealed (upright, sharp, still): src 12.233 = T 8.8333 (frame 265)
// Camera: "opening eyes" — starts 112% on the hands, eases out to 100% on the reveal, then a slow 100->103.6% push.
// Text (Hoefler Text Black + Black Italic in iridescent gradients from the card's own palette; motion = rise & bloom):
//   This is your / wake-up call 0-72 | Stop living / on autopilot 68-160 | One card, / one message 156-262
//   Trust your / inner voice + Comment "I'm awake" to claim it 277-374 | Read Caption / for your full message + DM 370-end
(function () {
var ROOT = "~/Claude AI/Tarotoverse/ae/awakening01";
var SRC = "~/Downloads/IMG_2707.MOV";
var W = 1080, H = 1920, FPS = 30, NF = 476, DUR = NF / FPS;
var REVEAL = 265 / FPS;
var logF = new File(ROOT + "/build_log.txt"); logF.open("w"); logF.close();
function log(s) { logF.open("a"); logF.writeln(s); logF.close(); }
function rgb(h) { return [parseInt(h.substr(0,2),16)/255, parseInt(h.substr(2,2),16)/255, parseInt(h.substr(4,2),16)/255]; }
function f(n) { return n / FPS; }
function setm(fx, mn, v) { try { fx.property(mn).setValue(v); } catch (err) { log("  ! " + mn + ": " + err.toString()); } }
function setn(fx, nm, v) { try { fx.property(nm).setValue(v); } catch (err) { log("  ! " + fx.name + "." + nm + ": " + err.toString()); } }
function keys(prop, arr) { for (var i = 0; i < arr.length; i++) prop.setValueAtTime(arr[i][0], arr[i][1]); }
function easeAll(prop, inf, outf) {
  for (var k = 1; k <= prop.numKeys; k++) {
    try {
      var dim = 1; var v = prop.keyValue(k);
      if (v instanceof Array && prop.propertyValueType != PropertyValueType.TwoD_SPATIAL && prop.propertyValueType != PropertyValueType.ThreeD_SPATIAL) dim = v.length;
      var ei = [], eo = []; for (var d = 0; d < dim; d++) { ei.push(new KeyframeEase(0, inf || 75)); eo.push(new KeyframeEase(0, outf || 75)); }
      prop.setTemporalEaseAtKey(k, ei, eo);
    } catch (x) { log("  ease " + prop.name + " k" + k + ": " + x.toString()); }
  }
}
function linearAll(prop) { for (var k = 1; k <= prop.numKeys; k++) prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR); }

function grade(layer) {
  var L = layer.property("Effects").addProperty("ADBE Lumetri"); L.name = "Lumetri — temple-dawn grade";
  setm(L, "ADBE Lumetri-0007", -2);    // temperature: tame the orange cast, keep the candle warmth
  setm(L, "ADBE Lumetri-0008", 3);     // tint: a rosy dawn
  setm(L, "ADBE Lumetri-0011", -0.22); // exposure: the cream cloth was bright
  setm(L, "ADBE Lumetri-0012", 12);    // contrast
  setm(L, "ADBE Lumetri-0013", -40);   // highlights (diyas, cloth, card white)
  setm(L, "ADBE Lumetri-0014", 2);     // shadows
  setm(L, "ADBE Lumetri-0015", -14);   // whites
  setm(L, "ADBE Lumetri-0016", -8);    // blacks
  setm(L, "ADBE Lumetri-0020", 94);    // saturation (marigolds sit near clipping)
  setm(L, "ADBE Lumetri-0029", 8);     // sharpen before the downscale
  setm(L, "ADBE Lumetri-0030", 8);     // vibrance
  return L;
}

try {
app.beginSuppressDialogs();
try { if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES); } catch (c) {}
app.newProject();
var proj = app.project;
var foot = proj.importFile(new ImportOptions(new File(SRC)));
var io = new ImportOptions(new File(ROOT + "/fx/awakening/awakening_0000.png"));
io.sequence = true; io.forceAlphabetical = true;
var light = proj.importFile(io); light.mainSource.conformFrameRate = FPS; light.mainSource.alphaMode = AlphaMode.STRAIGHT;
log("footage " + foot.width + "x" + foot.height + " " + foot.duration + " | fx seq " + light.duration);

// ============ SCENE (4K): graded take + awakening light ============
var S = proj.items.addComp("Scene 4K — single take + awakening light", 2160, 3840, 1, DUR, FPS);
var V = S.layers.add(foot); V.name = "IMG_2707 — single take (shuffle ramp, real-speed pull, slow hold)"; V.audioEnabled = false;
V.timeRemapEnabled = true;
var tr = V.property("ADBE Time Remapping");
keys(tr, [[0, 0.30], [6.2, 9.60], [REVEAL, 12.2333], [DUR, 12.2333 + 0.8 * (DUR - REVEAL)]]);
linearAll(tr); V.outPoint = DUR;
log("remap: reveal -> " + tr.valueAtTime(REVEAL, false).toFixed(4) + " | end -> " + tr.valueAtTime(DUR - 0.001, false).toFixed(3));
grade(V);
var LL = S.layers.add(light); LL.name = "Awakening light — diya sparks, ripple, rim (tracked, off the artwork)";
LL.startTime = 0; LL.outPoint = DUR;
LL.property("Scale").setValue([200, 200]); LL.property("Position").setValue([1080, 1920]);
LL.blendingMode = BlendingMode.SCREEN;

// ============ REEL ============
var R = proj.items.addComp("Tarotoverse — Awakening 01", W, H, 1, DUR, FPS);
var SL = R.layers.add(S); SL.name = "Camera — opening eyes (pull out to the reveal), then a slow push";
SL.property("Anchor Point").setValue([1102, 2523]); SL.property("Position").setValue([551, 1261.5]);
var sc = SL.property("Scale");
keys(sc, [[0, [56, 56]], [REVEAL, [50, 50]], [DUR, [51.8, 51.8]]]);
easeAll(sc, 55, 55);

var AJ = R.layers.addSolid([0, 0, 0], "Finish — warm diffusion + vignette", W, H, 1, DUR); AJ.adjustmentLayer = true;
var GL = AJ.property("Effects").addProperty("ADBE Glo2"); GL.name = "Highlight diffusion";
setn(GL, "Glow Threshold", 88); setn(GL, "Glow Radius", 70); setn(GL, "Glow Intensity", 0.12);
var LV = AJ.property("Effects").addProperty("ADBE Lumetri"); LV.name = "Vignette";
setm(LV, "ADBE Lumetri-0052", 40); setm(LV, "ADBE Lumetri-0054", 70);
try { var vg = LV.property("ADBE Lumetri-0051"); keys(vg, [[0, -1.3], [f(240), -1.3], [f(262), -1.9], [REVEAL + 0.7, -1.45], [DUR, -1.45]]); easeAll(vg, 60, 60); } catch (ev) { log("vignette: " + ev.toString()); }

// ---- typography
var SERIF = "HoeflerText-Black", SERIF_I = "HoeflerText-BlackItalic", SERIF_L = "HoeflerText-Italic", SANS = "AvenirNext-DemiBold";
var IVORY = "FFF8EC", CTA = "F3E3BE", PANEL = "1A0F33", HAIR = "E9B44C";
var SAFFRON = ["FFC94D", "FF9F45", "FFE08A", "FFB36B"];   // marigold
var PEACOCK = ["8FD8FF", "B3A6FF", "8FF0D8", "7FB8FF"];   // Krishna blue · violet · teal
var LOTUS   = ["FF8FB8", "FFC2D9", "FFB36B", "E9A0FF"];   // lotus pink · blush · saffron · orchid
var AURORA  = ["FF9EC4", "FFD978", "9FE3FF", "C9B2FF"];   // lotus · gold · sky · lavender
var FOIL    = ["F2C35E", "FFEDB8", "E0A040", "FFD98A"];   // gold foil

function makeText(name, str, font, size, hex, cx, cy, t0, t1, tracking) {
  var T = R.layers.addText(str); T.name = name;
  var sp = T.property("Source Text"); var td = sp.value;
  td.resetCharStyle(); td.font = font; td.fontSize = size; td.fillColor = rgb(hex); td.applyFill = true; td.applyStroke = false;
  td.justification = ParagraphJustification.CENTER_JUSTIFY; td.tracking = tracking || 0;
  sp.setValue(td);
  T.inPoint = t0; T.outPoint = t1;
  var r = T.sourceRectAtTime(t0 + 0.5 / FPS, false);
  T.property("Anchor Point").setValue([r.left + r.width / 2, r.top + r.height / 2]);
  T.property("Position").setValue([cx, cy]);
  var ds = T.property("Effects").addProperty("ADBE Drop Shadow"); ds.name = "Legibility shadow";
  setn(ds, "Shadow Color", [0.06, 0.02, 0.10]); setn(ds, "Opacity", 175); setn(ds, "Distance", 2); setn(ds, "Softness", 16); setn(ds, "Direction", 180);
  var tv = T.property("Source Text").value; log(name + ": box " + Math.round(r.width) + "x" + Math.round(r.height) + " font " + tv.font + " size " + tv.fontSize);
  T.boxW = r.width; T.boxH = r.height; T.cx = cx; T.cy = cy;
  return T;
}
// Iridescent fill: a 4-colour gradient solid alpha-matted by a clean copy of the text, drifting slowly + one light sweep.
function irid(T, pal, sweepAt) {
  var M = T.duplicate(); M.name = T.name + " · matte";
  try { M.property("Effects").property("Legibility shadow").remove(); } catch (em) { log("matte fx: " + em.toString()); }
  var G = R.layers.addSolid([1, 1, 1], T.name + " · iridescent fill", W, H, 1, DUR);
  G.inPoint = T.inPoint; G.outPoint = T.outPoint;
  var g = G.property("Effects").addProperty("ADBE 4ColorGradient"); g.name = "Iridescence";
  var x0 = T.cx - T.boxW / 2, x1 = T.cx + T.boxW / 2, y0 = T.cy - T.boxH / 2, y1 = T.cy + T.boxH / 2;
  setn(g, "Color 1", rgb(pal[0])); setn(g, "Color 2", rgb(pal[1])); setn(g, "Color 3", rgb(pal[2])); setn(g, "Color 4", rgb(pal[3]));
  setn(g, "Blend", 220);
  try {
    var a = T.inPoint, b = T.outPoint, dx = T.boxW * 0.35;
    keys(g.property("Point 1"), [[a, [x0, y0]], [b, [x0 + dx, y0]]]);
    keys(g.property("Point 2"), [[a, [x1, y0]], [b, [x1, y0 + T.boxH * 0.5]]]);
    keys(g.property("Point 3"), [[a, [x0, y1]], [b, [x0, y1 - T.boxH * 0.5]]]);
    keys(g.property("Point 4"), [[a, [x1, y1]], [b, [x1 - dx, y1]]]);
  } catch (ep) { log("gradient points: " + ep.toString()); }
  if (sweepAt) {
    var sw = G.property("Effects").addProperty("CC Light Sweep"); sw.name = "Shimmer";
    try { keys(sw.property("Center"), [[sweepAt, [x0 - 200, T.cy]], [sweepAt + 1.0, [x1 + 200, T.cy]]]); } catch (es) { log("sweep: " + es.toString()); }
    setn(sw, "Direction", -22); setn(sw, "Width", 70); setn(sw, "Sweep Intensity", 70); setn(sw, "Edge Intensity", 0);
    setn(sw, "Light Color", rgb("FFFFFF")); setn(sw, "Light Reception", 1);
  }
  G.moveBefore(T); M.moveBefore(G);
  G.trackMatteType = TrackMatteType.ALPHA;
  return G;
}
function panel(name, cx, cy, w, h, t0, t1, inF, outF) {
  var P = R.layers.addShape(); P.name = name;
  var g = P.property("Contents").addProperty("ADBE Vector Group");
  var rr = g.property("Contents").addProperty("ADBE Vector Shape - Rect");
  rr.property("Size").setValue([w, h]); rr.property("Roundness").setValue(48);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fl.property("Color").setValue(rgb(PANEL)); fl.property("Opacity").setValue(64);
  var st = g.property("Contents").addProperty("ADBE Vector Graphic - Stroke"); st.property("Color").setValue(rgb(HAIR)); st.property("Opacity").setValue(40); st.property("Stroke Width").setValue(1.5);
  P.property("Position").setValue([cx, cy]);
  P.inPoint = t0; P.outPoint = t1;
  var op = P.property("Opacity");
  if (inF) { keys(op, [[t0, 0], [t0 + f(inF), 100]]); keys(P.property("Scale"), [[t0, [96, 96]], [t0 + f(inF + 3), [100, 100]]]); easeAll(P.property("Scale"), 20, 85); }
  if (outF) { keys(op, [[t1 - f(outF), 100], [t1, 0]]); }
  return P;
}
function hairline(name, y, t0, t1, outF) {
  var L = R.layers.addShape(); L.name = name;
  var g = L.property("Contents").addProperty("ADBE Vector Group");
  var r = g.property("Contents").addProperty("ADBE Vector Shape - Rect"); r.property("Size").setValue([150, 2]);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fl.property("Color").setValue(rgb(HAIR));
  L.property("Position").setValue([W / 2, y]); L.inPoint = t0; L.outPoint = t1;
  keys(L.property("Opacity"), [[t0, 0], [t0 + f(8), 85]]);
  if (outF) keys(L.property("Opacity"), [[t1 - f(outF), 85], [t1, 0]]);
  keys(L.property("Scale"), [[t0, [10, 100]], [t0 + f(14), [100, 100]]]); easeAll(L.property("Scale"), 20, 85);
  return L;
}
// Motion motif for this Reel: everything rises and blooms into focus, then lifts away (awakening).
function enterRise(T, t0, frames) {
  var p = T.property("Position").value;
  keys(T.property("Position"), [[t0, [p[0], p[1] + 28]], [t0 + f(frames), p]]); easeAll(T.property("Position"), 20, 85);
  keys(T.property("Opacity"), [[t0, 0], [t0 + f(frames - 3), 100]]);
  keys(T.property("Scale"), [[t0, [96, 96]], [t0 + f(frames + 2), [100, 100]]]); easeAll(T.property("Scale"), 20, 85);
}
function exitLift(T, t1, frames) {
  var pr = T.property("Position"); var p = pr.valueAtTime(t1 - f(frames), false);
  keys(pr, [[t1 - f(frames), p], [t1, [p[0], p[1] - 22]]]);
  keys(T.property("Opacity"), [[t1 - f(frames), 100], [t1, 0]]);
}
function line(name, str, font, size, hex, cy, t0, t1, enterF, exitF, pal, sweepAt, tracking) {
  var T = makeText(name, str, font, size, hex, W / 2, cy, t0, t1, tracking);
  if (enterF) enterRise(T, t0, enterF);
  if (exitF) exitLift(T, t1, exitF);
  if (pal) irid(T, pal, sweepAt);
  return T;
}

// BLOCK 1 — hook (readable on frame 0)
var a1 = line("TEXT 1a — This is your", "This is your", SERIF, 108, IVORY, 392, 0, f(72), 0, 6, null);
var b1 = line("TEXT 1b — wake-up call", "wake-up call", SERIF_I, 134, IVORY, 518, 0, f(72), 0, 6, SAFFRON, f(10));
var P1 = panel("Panel — hook", W / 2, 462, Math.max(a1.boxW, b1.boxW) + 130, 340, 0, f(72), 0, 6);

// BLOCK 2 — while the deck is shuffled
var a2 = line("TEXT 2a — Stop living", "Stop living", SERIF, 112, IVORY, 400, f(68), f(160), 9, 6, null);
var b2 = line("TEXT 2b — on autopilot", "on autopilot", SERIF_I, 136, IVORY, 524, f(70), f(160), 9, 6, PEACOCK, f(90));
var P2 = panel("Panel — autopilot", W / 2, 466, Math.max(a2.boxW, b2.boxW) + 130, 330, f(68), f(160), 8, 6);

// BLOCK 3 — as the card is pulled
var a3 = line("TEXT 3a — One card,", "One card,", SERIF, 112, IVORY, 400, f(156), f(262), 9, 6, null);
var b3 = line("TEXT 3b — one message", "one message", SERIF_I, 142, IVORY, 526, f(158), f(262), 9, 6, LOTUS, f(185));
var P3 = panel("Panel — one message", W / 2, 466, Math.max(a3.boxW, b3.boxW) + 130, 330, f(156), f(262), 8, 6);

// BLOCK 4 — the message + engagement (after the reveal at frame 265)
var a4 = line("TEXT 4a — Trust your", "Trust your", SERIF, 104, IVORY, 372, f(277), f(374), 9, 6, null);
var b4 = line("TEXT 4b — inner voice", "inner voice", SERIF_I, 156, IVORY, 500, f(279), f(374), 9, 6, AURORA, f(292));
var h4 = hairline("Hairline — message", 590, f(287), f(374), 6);
var c4 = line("TEXT 4c — Comment I'm awake to claim it", "Comment “I’m awake” to claim it", SANS, 42, "FFC9DC", 634, f(291), f(374), 9, 6, null, null, 30);
var P4 = panel("Panel — message", W / 2, 498, Math.max(a4.boxW, b4.boxW, c4.boxW) + 130, 410, f(275), f(374), 9, 6);

// BLOCK 5 — Read Caption + DM (always, owner rule)
var a5 = line("TEXT 5a — Read Caption", "Read Caption", SERIF, 120, IVORY, 412, f(370), DUR, 9, 0, FOIL, f(384));
var b5 = line("TEXT 5b — for your full message", "for your full message", SERIF_L, 62, "F2E6FF", 512, f(373), DUR, 9, 0, null);
var h5 = hairline("Hairline — closing", 578, f(380), DUR, 0);
var c5 = line("TEXT 5c — DM for Personal Tarot Reading", "DM for Personal Tarot Reading", SANS, 44, CTA, 624, f(382), DUR, 9, 0, null, null, 30);
var P5 = panel("Panel — closing", W / 2, 506, Math.max(a5.boxW, c5.boxW, b5.boxW) + 130, 380, f(368), DUR, 9, 0);

var groups = [[P1, a1], [P2, a2], [P3, a3], [P4, a4], [P5, a5]];
for (var q = 0; q < groups.length; q++) groups[q][0].moveAfter(groups[q][1]);
log("text built");

var wm = makeText("Watermark — @tarotoverse", "@tarotoverse", SANS, 28, IVORY, W / 2, 170, 0, DUR, 60);
wm.property("Opacity").setValue(82);
var END = R.layers.addSolid([0, 0, 0], "Ending fade", W, H, 1, DUR);
keys(END.property("Opacity"), [[f(466), 0], [DUR, 100]]);

log("layers: " + R.numLayers);
proj.save(new File(ROOT + "/Tarotoverse_Awakening_01.aep"));
log("saved");
var qc = [0, 40, 110, 200, 258, 265, 275, 300, 340, 372, 400, 460];
var sd = new Folder(ROOT + "/qc"); if (!sd.exists) sd.create();
for (var k = 0; k < qc.length; k++) R.saveFrameToPng(f(qc[k]), new File(ROOT + "/qc/f" + ("00" + qc[k]).slice(-3) + ".png"));
log("stills queued");
} catch (e) { log("ERROR line " + e.line + ": " + e.toString()); }
app.endSuppressDialogs(false);
})();
