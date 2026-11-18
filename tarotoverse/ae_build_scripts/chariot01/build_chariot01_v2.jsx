// Tarotoverse — Chariot 01 · v2 (After Effects 2027 build)
// Owner feedback on v1: "add Read Caption for the full message (always)", "add a smooth engagement CTA (double tap / share)",
// "make the fonts more beautiful and colourful" — the edit, music and everything else stay.
// Raw footage: ~/Downloads/IMG_6761.MOV (2160x3840 portrait, 30 fps, 19.9 s) — imported, never modified.
// Edit (reel frames @30, 534 frames = 17.80 s):
//   T 0.000-6.000   src 0.40-9.40   @1.5x  sage cleansing
//   T 6.000-9.667   src 9.40-15.27  @1.6x  choosing
//   T 9.667-10.833  src 15.27-16.43 @1.0x  pull + flip
//   T 10.833-14.900 src 16.43-19.28 @0.7x  hold on The Chariot
//   T 14.900-17.800 src 19.28-19.85        eased glide to a stop (Read Caption block)
//   Card clearly revealed: src 16.433 = T 10.8333 (frame 325)
// Text: Feeling / stuck? 0-70 | Let's clear / the old energy 66-178 | Your next move / is in this card 175-322
//       Momentum / is on your side + Double tap to claim it 336-437 | Read Caption / for your full message + DM 432-end
(function () {
var ROOT = "~/Claude AI/Tarotoverse/ae/chariot01";
var SRC = "~/Downloads/IMG_6761.MOV";
var W = 1080, H = 1920, FPS = 30, NF = 534, DUR = NF / FPS;
var REVEAL = 325 / FPS, TA = 14.9;
var logF = new File(ROOT + "/build_log_v2.txt"); logF.open("w"); logF.close();
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
// identical to src_of() in tools/chariot_fx.py --v2
function holdSrc(T) {
  if (T < TA) return 16.4333 + 0.7 * (T - REVEAL);
  var s0 = 16.4333 + 0.7 * (TA - REVEAL); var u = Math.min(Math.max((T - TA) / (DUR - TA), 0), 1);
  return s0 + (19.85 - s0) * (1 - (1 - u) * (1 - u));
}

function grade(layer) {
  var L = layer.property("Effects").addProperty("ADBE Lumetri"); L.name = "Lumetri — midnight-velvet grade";
  setm(L, "ADBE Lumetri-0007", -3); setm(L, "ADBE Lumetri-0008", 2); setm(L, "ADBE Lumetri-0011", -0.15);
  setm(L, "ADBE Lumetri-0012", 14); setm(L, "ADBE Lumetri-0013", -36); setm(L, "ADBE Lumetri-0014", -4);
  setm(L, "ADBE Lumetri-0015", -10); setm(L, "ADBE Lumetri-0016", -10); setm(L, "ADBE Lumetri-0020", 96);
  setm(L, "ADBE Lumetri-0029", 10); setm(L, "ADBE Lumetri-0030", 10);
  return L;
}

try {
app.beginSuppressDialogs();
try { if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES); } catch (c) {}
app.newProject();
var proj = app.project;
var foot = proj.importFile(new ImportOptions(new File(SRC)));
var io = new ImportOptions(new File(ROOT + "/fx/chariotlight_v2/chariotlight_0306.png"));
io.sequence = true; io.forceAlphabetical = true;
var light = proj.importFile(io); light.mainSource.conformFrameRate = FPS; light.mainSource.alphaMode = AlphaMode.STRAIGHT;
log("footage " + foot.duration + " | light seq " + light.duration);

// ============ SCENE (4K): graded take + light in motion ============
var S = proj.items.addComp("Scene 4K — single take + Chariot light", 2160, 3840, 1, DUR, FPS);
var V = S.layers.add(foot); V.name = "IMG_6761 — single take (momentum ramp + glide)"; V.audioEnabled = false;
V.timeRemapEnabled = true;
var tr = V.property("ADBE Time Remapping");
var rk = [[0, 0.40], [f(180), 9.40], [f(290), 15.2667], [REVEAL, 16.4333]];
for (var n = 330; n <= NF; n += 3) rk.push([f(n), holdSrc(f(n))]);   // dense keys = exact match with the FX script
keys(tr, rk); linearAll(tr); V.outPoint = DUR;
log("remap: reveal -> " + tr.valueAtTime(REVEAL, false).toFixed(4) + " | T14.9 -> " + tr.valueAtTime(TA, false).toFixed(3) + " | end -> " + tr.valueAtTime(DUR - 0.001, false).toFixed(3));
grade(V);
var LL = S.layers.add(light); LL.name = "Chariot light — comet streak + halo (tracked, off the artwork)";
LL.startTime = f(306); LL.inPoint = f(306); LL.outPoint = DUR;
LL.property("Scale").setValue([200, 200]); LL.property("Position").setValue([1080, 1920]);
LL.blendingMode = BlendingMode.SCREEN;

// ============ REEL ============
var R = proj.items.addComp("Tarotoverse — Chariot 01 v2", W, H, 1, DUR, FPS);
var SL = R.layers.add(S); SL.name = "Camera — drift in, surge on the flip";
SL.property("Anchor Point").setValue([1015, 2074]); SL.property("Position").setValue([507.5, 1037]);
var sc = SL.property("Scale");
keys(sc, [[0, [50.5, 50.5]], [f(290), [53, 53]], [f(298), [53.2, 53.2]], [f(328), [55.5, 55.5]], [DUR, [56.6, 56.6]]]);
easeAll(sc, 40, 40);

var AJ = R.layers.addSolid([0, 0, 0], "Finish — diffusion + vignette", W, H, 1, DUR); AJ.adjustmentLayer = true;
var GL = AJ.property("Effects").addProperty("ADBE Glo2"); GL.name = "Highlight diffusion";
setn(GL, "Glow Threshold", 90); setn(GL, "Glow Radius", 60); setn(GL, "Glow Intensity", 0.10);
var LV = AJ.property("Effects").addProperty("ADBE Lumetri"); LV.name = "Vignette";
setm(LV, "ADBE Lumetri-0052", 45); setm(LV, "ADBE Lumetri-0054", 70);
try { var vg = LV.property("ADBE Lumetri-0051"); keys(vg, [[0, -0.9], [f(290), -0.9], [f(322), -1.6], [REVEAL + 0.6, -1.1], [DUR, -1.1]]); easeAll(vg, 60, 60); } catch (ev) { log("vignette: " + ev.toString()); }

// ---- typography: Didot Bold (ivory) + Didot Italic in iridescent gradients from the card's palette
var DIDOT = "Didot-Bold", DIDOT_I = "Didot-Italic", SANS = "AvenirNext-DemiBold";
var IVORY = "FFF8EC", CTA = "F3E3BE", NAVY = "0B1233", SILVER = "C9D3FF";
// palettes (4 colours, light enough for contrast on navy)
var DAWN  = ["FFB3C8", "FFD99A", "D9B3FF", "FFC7A8"];   // rose · champagne · lavender · peach
var SMOKE = ["C7B8FF", "AFC6FF", "B8F0DA", "E8C2FF"];   // lavender · periwinkle · mint · lilac
var FOIL  = ["F2C35E", "FFEDB8", "E0A040", "FFD98A"];   // gold foil · pale champagne · deep gold · honey
var STAR  = ["FFD27A", "B9C8FF", "FFB8CF", "FFE9B0"];   // gold · periwinkle · rose · ivory

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
  setn(ds, "Shadow Color", [0.02, 0.03, 0.10]); setn(ds, "Opacity", 170); setn(ds, "Distance", 2); setn(ds, "Softness", 16); setn(ds, "Direction", 180);
  var tv = T.property("Source Text").value; log(name + ": box " + Math.round(r.width) + "x" + Math.round(r.height) + " font " + tv.font + " size " + tv.fontSize);
  T.boxW = r.width; T.boxH = r.height; T.cx = cx; T.cy = cy;
  return T;
}
// Iridescent fill: a 4-colour gradient solid, alpha-matted by a clean copy of the text, drifting slowly + one light sweep.
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
  G.moveAfter(T); G.moveBefore(T);     // directly above the base text
  M.moveBefore(G);                     // matte directly above the gradient
  G.trackMatteType = TrackMatteType.ALPHA;
  return G;
}
function panel(name, cx, cy, w, h, t0, t1, inF, outF) {
  var P = R.layers.addShape(); P.name = name;
  var g = P.property("Contents").addProperty("ADBE Vector Group");
  var rr = g.property("Contents").addProperty("ADBE Vector Shape - Rect");
  rr.property("Size").setValue([w, h]); rr.property("Roundness").setValue(44);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fl.property("Color").setValue(rgb(NAVY)); fl.property("Opacity").setValue(62);
  var st = g.property("Contents").addProperty("ADBE Vector Graphic - Stroke"); st.property("Color").setValue(rgb(SILVER)); st.property("Opacity").setValue(30); st.property("Stroke Width").setValue(1.5);
  P.property("Position").setValue([cx, cy]);
  P.inPoint = t0; P.outPoint = t1;
  var op = P.property("Opacity");
  if (inF) { keys(op, [[t0, 0], [t0 + f(inF), 100]]); keys(P.property("Scale"), [[t0, [94, 100]], [t0 + f(inF + 2), [100, 100]]]); easeAll(P.property("Scale"), 20, 85); }
  if (outF) { keys(op, [[t1 - f(outF), 100], [t1, 0]]); }
  return P;
}
function hairline(name, y, t0, t1) {
  var L = R.layers.addShape(); L.name = name;
  var g = L.property("Contents").addProperty("ADBE Vector Group");
  var r = g.property("Contents").addProperty("ADBE Vector Shape - Rect"); r.property("Size").setValue([140, 2]);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fl.property("Color").setValue(rgb("E9C99A"));
  L.property("Position").setValue([W / 2, y]); L.inPoint = t0; L.outPoint = t1;
  keys(L.property("Opacity"), [[t0, 0], [t0 + f(8), 80]]);
  keys(L.property("Scale"), [[t0, [10, 100]], [t0 + f(14), [100, 100]]]); easeAll(L.property("Scale"), 20, 85);
  return L;
}
// Motion motif: arrive from the left, leave to the right.
function enterFromLeft(T, t0, frames) {
  var p = T.property("Position").value;
  keys(T.property("Position"), [[t0, [p[0] - 36, p[1]]], [t0 + f(frames), p]]); easeAll(T.property("Position"), 20, 85);
  keys(T.property("Opacity"), [[t0, 0], [t0 + f(frames - 3), 100]]);
}
function exitRight(T, t1, frames) {
  var pr = T.property("Position"); var p = pr.valueAtTime(t1 - f(frames), false);
  keys(pr, [[t1 - f(frames), p], [t1, [p[0] + 36, p[1]]]]);
  keys(T.property("Opacity"), [[t1 - f(frames), 100], [t1, 0]]);
}
function line(name, str, font, size, hex, cy, t0, t1, enterF, exitF, pal, sweepAt, tracking) {
  var T = makeText(name, str, font, size, hex, W / 2, cy, t0, t1, tracking);
  if (enterF) enterFromLeft(T, t0, enterF);
  if (exitF) exitRight(T, t1, exitF);
  if (pal) irid(T, pal, sweepAt);
  return T;
}

// BLOCK 1 — hook (readable on frame 0)
var a1 = line("TEXT 1a — Feeling", "Feeling", DIDOT, 158, IVORY, 318, 0, f(70), 0, 6, null);
var b1 = line("TEXT 1b — stuck?", "stuck?", DIDOT_I, 196, IVORY, 476, 0, f(70), 0, 6, DAWN, f(8));
keys(a1.property("Scale"), [[0, [103, 103]], [f(10), [100, 100]]]); easeAll(a1.property("Scale"), 20, 80);
var P1 = panel("Panel — hook", W / 2, 402, Math.max(a1.boxW, b1.boxW) + 130, 392, 0, f(70), 0, 6);

// BLOCK 2 — during the cleansing
var a2 = line("TEXT 2a — Let's clear", "Let’s clear", DIDOT, 110, IVORY, 342, f(66), f(178), 10, 6, null);
var b2 = line("TEXT 2b — the old energy", "the old energy", DIDOT_I, 122, IVORY, 458, f(68), f(178), 10, 6, SMOKE, f(90));
var P2 = panel("Panel — clearing", W / 2, 400, Math.max(a2.boxW, b2.boxW) + 120, 290, f(66), f(178), 8, 6);

// BLOCK 3 — while the hand chooses
var a3 = line("TEXT 3a — Your next move", "Your next move", DIDOT_I, 120, IVORY, 342, f(175), f(322), 10, 6, FOIL, f(200));
var b3 = line("TEXT 3b — is in this card", "is in this card", DIDOT, 100, IVORY, 456, f(177), f(322), 10, 6, null);
var P3 = panel("Panel — next move", W / 2, 400, Math.max(a3.boxW, b3.boxW) + 120, 290, f(175), f(322), 8, 6);

// BLOCK 4 — the message + engagement (after the reveal at frame 325)
var a4 = line("TEXT 4a — Momentum", "Momentum", DIDOT_I, 150, IVORY, 280, f(336), f(437), 10, 6, STAR, f(352));
var b4 = line("TEXT 4b — is on your side", "is on your side", DIDOT, 92, IVORY, 410, f(338), f(437), 10, 6, null);
var h4 = hairline("Hairline — message", 470, f(346), f(437)); exitRight(h4, f(437), 6);
var c4 = line("TEXT 4c — Double tap to claim it", "Double tap to claim it", SANS, 46, "F9C6D6", 516, f(350), f(437), 10, 6, null, null, 40);
var P4 = panel("Panel — message", W / 2, 390, Math.max(a4.boxW, b4.boxW, c4.boxW) + 130, 362, f(334), f(437), 9, 6);

// BLOCK 5 — Read Caption + DM (always, owner rule)
var a5 = line("TEXT 5a — Read Caption", "Read Caption", DIDOT, 126, IVORY, 318, f(432), DUR, 10, 0, FOIL, f(450));
var b5 = line("TEXT 5b — for your full message", "for your full message", DIDOT_I, 60, "F2E6FF", 412, f(436), DUR, 10, 0, null);
var h5 = hairline("Hairline — closing", 466, f(442), DUR);
var c5 = line("TEXT 5c — DM for Personal Tarot Reading", "DM for Personal Tarot Reading", SANS, 44, CTA, 512, f(444), DUR, 10, 0, null, null, 30);
var P5 = panel("Panel — closing", W / 2, 388, Math.max(a5.boxW, c5.boxW, b5.boxW) + 130, 352, f(430), DUR, 9, 0);

// panels go under everything they back (below the lowest layer of each block)
var groups = [[P1, a1], [P2, a2], [P3, a3], [P4, a4], [P5, a5]];
for (var q = 0; q < groups.length; q++) groups[q][0].moveAfter(groups[q][1]);
log("text built");

var wm = makeText("Watermark — @tarotoverse", "@tarotoverse", SANS, 28, IVORY, W / 2, 164, 0, DUR, 60);
wm.property("Opacity").setValue(80);
var END = R.layers.addSolid([0, 0, 0], "Ending fade", W, H, 1, DUR);
keys(END.property("Opacity"), [[f(524), 0], [DUR, 100]]);

log("layers: " + R.numLayers);
proj.save(new File(ROOT + "/Tarotoverse_Chariot_01_v2.aep"));
log("saved");
var qc = [0, 40, 120, 250, 330, 352, 380, 425, 440, 455, 480, 520];
var sd = new Folder(ROOT + "/qc_v2"); if (!sd.exists) sd.create();
for (var k = 0; k < qc.length; k++) R.saveFrameToPng(f(qc[k]), new File(ROOT + "/qc_v2/f" + ("00" + qc[k]).slice(-3) + ".png"));
log("stills queued");
} catch (e) { log("ERROR line " + e.line + ": " + e.toString()); }
app.endSuppressDialogs(false);
})();
