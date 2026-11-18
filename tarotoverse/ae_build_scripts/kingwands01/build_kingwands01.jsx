// Tarotoverse — King of Wands 01 (After Effects 2027 build)
// Raw footage: ~/Downloads/IMG_2734.MOV (2160x3840 portrait, 30 fps, 14.0 s) — imported, never modified.
// Card: KING OF WANDS (printed on the card; never altered). Reading angle: money & career — step into your leadership era.
// Edit (reel frames @30, 398 frames = 13.27 s):
//   T 0.000-1.800  src 0.30-3.00  @1.5x  the gold altar (punch-in on the gold bars, whoosh out at T 1.0-1.5)
//   T 1.800-4.933  src 3.00-8.00  @1.6x  the deck is spread and one card chosen
//   T 4.933-5.433  src 8.00-8.50  @1.0x  the pull
//   T 5.433-13.267 src 8.50-13.98 @0.7x  hold on the King of Wands
//   Card clearly revealed: src 8.500 = T 5.4333 (frame 163) — alarm-bell hit in the music (Pink Floyd "Time")
// Text (Bodoni 72 Bold; gradient key phrases; motion = "crown" — each line descends into place):
//   Is this your / money sign? 0-66 | The deck / already knows 62-160 |
//   Step into your / leadership era + Save this as your sign 170-278 | Read Caption / for your full message + DM 274-end
(function () {
var ROOT = "~/Claude AI/Tarotoverse/ae/kingwands01";
var SRC = "~/Downloads/IMG_2734.MOV";
var W = 1080, H = 1920, FPS = 30, NF = 398, DUR = NF / FPS;
var REVEAL = 163 / FPS;
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
  var L = layer.property("Effects").addProperty("ADBE Lumetri"); L.name = "Lumetri — liquid-gold grade";
  setm(L, "ADBE Lumetri-0007", -8);    // temperature: tame the strong yellow cast of the satin
  setm(L, "ADBE Lumetri-0008", 4);     // tint: a little magenta to keep skin natural
  setm(L, "ADBE Lumetri-0011", -0.15); // exposure
  setm(L, "ADBE Lumetri-0012", 16);    // contrast: richer, more "luxury"
  setm(L, "ADBE Lumetri-0013", -30);   // highlights (satin sheen, card white)
  setm(L, "ADBE Lumetri-0014", -6);    // shadows
  setm(L, "ADBE Lumetri-0015", -12);   // whites
  setm(L, "ADBE Lumetri-0016", -10);   // blacks
  setm(L, "ADBE Lumetri-0020", 90);    // saturation
  setm(L, "ADBE Lumetri-0029", 8);     // sharpen before the downscale
  setm(L, "ADBE Lumetri-0030", 6);     // vibrance
  return L;
}

try {
app.beginSuppressDialogs();
try { if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES); } catch (c) {}
app.newProject();
var proj = app.project;
var foot = proj.importFile(new ImportOptions(new File(SRC)));
var io = new ImportOptions(new File(ROOT + "/fx/embercrown/embercrown_0150.png"));
io.sequence = true; io.forceAlphabetical = true;
var fire = proj.importFile(io); fire.mainSource.conformFrameRate = FPS; fire.mainSource.alphaMode = AlphaMode.STRAIGHT;
log("footage " + foot.width + "x" + foot.height + " " + foot.duration + " | fx seq " + fire.duration);

// ============ SCENE (4K): graded take + ember crown ============
var S = proj.items.addComp("Scene 4K — single take + ember crown", 2160, 3840, 1, DUR, FPS);
var V = S.layers.add(foot); V.name = "IMG_2734 — single take (altar, spread, pull, hold)"; V.audioEnabled = false;
V.timeRemapEnabled = true;
var tr = V.property("ADBE Time Remapping");
keys(tr, [[0, 0.30], [1.8, 3.0], [f(148), 8.0], [REVEAL, 8.5], [DUR, 8.5 + 0.7 * (DUR - REVEAL)]]);
linearAll(tr); V.outPoint = DUR;
log("remap: reveal -> " + tr.valueAtTime(REVEAL, false).toFixed(4) + " | end -> " + tr.valueAtTime(DUR - 0.001, false).toFixed(3));
grade(V);
var FL = S.layers.add(fire); FL.name = "Ember crown — fire rim, rising embers, reveal flare (tracked, off the artwork)";
FL.startTime = f(150); FL.inPoint = f(150); FL.outPoint = DUR;
FL.property("Scale").setValue([200, 200]); FL.property("Position").setValue([1080, 1920]);
FL.blendingMode = BlendingMode.SCREEN;

// ============ REEL ============
var R = proj.items.addComp("Tarotoverse — King of Wands 01", W, H, 1, DUR, FPS);
R.motionBlur = true; R.shutterAngle = 240;
var SL = R.layers.add(S); SL.name = "Camera — punch-in on the gold, whoosh out, drift to the card";
SL.motionBlur = true;
SL.property("Anchor Point").setValue([1037, 2342]);
var sc = SL.property("Scale"), ps = SL.property("Position");
keys(sc, [[0, [67.5, 67.5]], [f(30), [69, 69]], [f(45), [52, 52]], [f(160), [54, 54]], [f(166), [55.6, 55.6]], [f(178), [55, 55]], [DUR, [57, 57]]]);
keys(ps, [[0, [700, 1579]], [f(30), [705, 1600]], [f(45), [518.5, 1171]], [DUR, [518.5, 1171]]]);
easeAll(sc, 45, 45); easeAll(ps, 45, 45);
try { sc.setTemporalEaseAtKey(3, [new KeyframeEase(0, 80), new KeyframeEase(0, 80)], [new KeyframeEase(0, 40), new KeyframeEase(0, 40)]); } catch (ek) {}

var AJ = R.layers.addSolid([0, 0, 0], "Finish — diffusion + vignette", W, H, 1, DUR); AJ.adjustmentLayer = true;
var GL = AJ.property("Effects").addProperty("ADBE Glo2"); GL.name = "Highlight diffusion";
setn(GL, "Glow Threshold", 88); setn(GL, "Glow Radius", 65); setn(GL, "Glow Intensity", 0.12);
var LV = AJ.property("Effects").addProperty("ADBE Lumetri"); LV.name = "Vignette";
setm(LV, "ADBE Lumetri-0052", 40); setm(LV, "ADBE Lumetri-0054", 70);
try { var vg = LV.property("ADBE Lumetri-0051"); keys(vg, [[0, -1.2], [f(140), -1.2], [f(160), -1.8], [REVEAL + 0.7, -1.4], [DUR, -1.4]]); easeAll(vg, 60, 60); } catch (ev) { log("vignette: " + ev.toString()); }

// ---- typography
var SERIF = "BodoniSvtyTwoITCTT-Bold", SERIF_I = "BodoniSvtyTwoITCTT-BookIta", SANS = "AvenirNext-DemiBold";
var IVORY = "FFF8EC", CTA = "F3E3BE", PANEL = "0E1030", HAIR = "E9C26A";
var GOLD  = ["FFE08A", "F2B640", "FFF1C2", "E89A2E"];   // liquid gold
var FIRE  = ["FFB04A", "FF6F3C", "FFD27A", "FF8F5A"];   // wand fire
var EMBER = ["FFD27A", "FF9A4D", "FFE9B8", "F2A34A"];   // embers & gold
var FOIL  = ["F2C35E", "FFEDB8", "E0A040", "FFD98A"];   // gold foil

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
  setn(ds, "Shadow Color", [0.03, 0.03, 0.10]); setn(ds, "Opacity", 180); setn(ds, "Distance", 2); setn(ds, "Softness", 16); setn(ds, "Direction", 180);
  var tv = T.property("Source Text").value; log(name + ": box " + Math.round(r.width) + "x" + Math.round(r.height) + " font " + tv.font + " size " + tv.fontSize);
  T.boxW = r.width; T.boxH = r.height; T.cx = cx; T.cy = cy;
  return T;
}
function irid(T, pal, sweepAt) {
  var M = T.duplicate(); M.name = T.name + " · matte";
  try { M.property("Effects").property("Legibility shadow").remove(); } catch (em) { log("matte fx: " + em.toString()); }
  var G = R.layers.addSolid([1, 1, 1], T.name + " · gradient fill", W, H, 1, DUR);
  G.inPoint = T.inPoint; G.outPoint = T.outPoint;
  var g = G.property("Effects").addProperty("ADBE 4ColorGradient"); g.name = "Gradient";
  var x0 = T.cx - T.boxW / 2, x1 = T.cx + T.boxW / 2, y0 = T.cy - T.boxH / 2, y1 = T.cy + T.boxH / 2;
  setn(g, "Color 1", rgb(pal[0])); setn(g, "Color 2", rgb(pal[1])); setn(g, "Color 3", rgb(pal[2])); setn(g, "Color 4", rgb(pal[3]));
  setn(g, "Blend", 220);
  try {
    var a = T.inPoint, b = T.outPoint, dx = T.boxW * 0.35;
    keys(g.property("Point 1"), [[a, [x0, y0 - 40]], [b, [x0 + dx, y0]]]);
    keys(g.property("Point 2"), [[a, [x1, y0 - 40]], [b, [x1, y0 + T.boxH * 0.5]]]);
    keys(g.property("Point 3"), [[a, [x0, y1 + 40]], [b, [x0, y1 - T.boxH * 0.5]]]);
    keys(g.property("Point 4"), [[a, [x1, y1 + 40]], [b, [x1 - dx, y1]]]);
  } catch (ep) { log("gradient points: " + ep.toString()); }
  if (sweepAt) {
    var sw = G.property("Effects").addProperty("CC Light Sweep"); sw.name = "Shimmer";
    try { keys(sw.property("Center"), [[sweepAt, [x0 - 250, T.cy]], [sweepAt + 0.9, [x1 + 250, T.cy]]]); } catch (es) { log("sweep: " + es.toString()); }
    setn(sw, "Direction", -22); setn(sw, "Width", 70); setn(sw, "Edge Intensity", 0);
    try { keys(sw.property("Sweep Intensity"), [[sweepAt - 0.05, 0], [sweepAt + 0.05, 75], [sweepAt + 0.8, 75], [sweepAt + 0.95, 0]]); } catch (si) { log("sweep int: " + si.toString()); }
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
  rr.property("Size").setValue([w, h]); rr.property("Roundness").setValue(40);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fl.property("Color").setValue(rgb(PANEL)); fl.property("Opacity").setValue(66);
  var st = g.property("Contents").addProperty("ADBE Vector Graphic - Stroke"); st.property("Color").setValue(rgb(HAIR)); st.property("Opacity").setValue(55); st.property("Stroke Width").setValue(2);
  P.property("Position").setValue([cx, cy]);
  P.inPoint = t0; P.outPoint = t1;
  var op = P.property("Opacity");
  if (inF) { keys(op, [[t0, 0], [t0 + f(inF), 100]]); keys(P.property("Scale"), [[t0, [104, 104]], [t0 + f(inF + 3), [100, 100]]]); easeAll(P.property("Scale"), 20, 85); }
  if (outF) { keys(op, [[t1 - f(outF), 100], [t1, 0]]); }
  return P;
}
function hairline(name, y, t0, t1, outF) {
  var L = R.layers.addShape(); L.name = name;
  var g = L.property("Contents").addProperty("ADBE Vector Group");
  var r = g.property("Contents").addProperty("ADBE Vector Shape - Rect"); r.property("Size").setValue([160, 2]);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fl.property("Color").setValue(rgb(HAIR));
  L.property("Position").setValue([W / 2, y]); L.inPoint = t0; L.outPoint = t1;
  keys(L.property("Opacity"), [[t0, 0], [t0 + f(8), 90]]);
  if (outF) keys(L.property("Opacity"), [[t1 - f(outF), 90], [t1, 0]]);
  keys(L.property("Scale"), [[t0, [10, 100]], [t0 + f(14), [100, 100]]]); easeAll(L.property("Scale"), 20, 85);
  return L;
}
// Motion motif for this Reel: each line is "crowned" — it descends gently into place and settles from 106% to 100%.
function enterCrown(T, t0, frames) {
  var p = T.property("Position").value;
  keys(T.property("Position"), [[t0, [p[0], p[1] - 30]], [t0 + f(frames), p]]); easeAll(T.property("Position"), 20, 88);
  keys(T.property("Opacity"), [[t0, 0], [t0 + f(frames - 3), 100]]);
  keys(T.property("Scale"), [[t0, [106, 106]], [t0 + f(frames + 2), [100, 100]]]); easeAll(T.property("Scale"), 20, 85);
}
function exitRise(T, t1, frames) {
  var pr = T.property("Position"); var p = pr.valueAtTime(t1 - f(frames), false);
  keys(pr, [[t1 - f(frames), p], [t1, [p[0], p[1] - 18]]]);
  keys(T.property("Opacity"), [[t1 - f(frames), 100], [t1, 0]]);
}
function line(name, str, font, size, hex, cy, t0, t1, enterF, exitF, pal, sweepAt, tracking) {
  var T = makeText(name, str, font, size, hex, W / 2, cy, t0, t1, tracking);
  if (enterF) enterCrown(T, t0, enterF);
  if (exitF) exitRise(T, t1, exitF);
  if (pal) irid(T, pal, sweepAt);
  return T;
}

// BLOCK 1 — hook (readable on frame 0)
var a1 = line("TEXT 1a — Is this your", "Is this your", SERIF, 104, IVORY, 372, 0, f(66), 0, 6, null);
var b1 = line("TEXT 1b — money sign?", "money sign?", SERIF, 150, IVORY, 506, 0, f(66), 0, 6, GOLD, f(8));
var P1 = panel("Panel — hook", W / 2, 446, Math.max(a1.boxW, b1.boxW) + 130, 350, 0, f(66), 0, 6);

// BLOCK 2 — while the deck is spread
var a2 = line("TEXT 2a — The deck", "The deck", SERIF, 110, IVORY, 382, f(62), f(160), 9, 6, null);
var b2 = line("TEXT 2b — already knows", "already knows", SERIF, 136, IVORY, 512, f(64), f(160), 9, 6, EMBER, f(84));
var P2 = panel("Panel — the deck", W / 2, 450, Math.max(a2.boxW, b2.boxW) + 130, 330, f(62), f(160), 8, 6);

// BLOCK 3 — the message + engagement (after the reveal at frame 163)
var a3 = line("TEXT 3a — Step into your", "Step into your", SERIF, 98, IVORY, 352, f(170), f(278), 9, 6, null);
var b3 = line("TEXT 3b — leadership era", "leadership era", SERIF, 124, IVORY, 474, f(172), f(278), 9, 6, FIRE, f(184));
var h3 = hairline("Hairline — message", 556, f(180), f(278), 6);
var c3 = line("TEXT 3c — Save this as your sign", "Save this as your sign", SANS, 44, "FFD9A0", 600, f(184), f(278), 9, 6, null, null, 30);
var P3 = panel("Panel — message", W / 2, 470, Math.max(a3.boxW, b3.boxW, c3.boxW) + 130, 380, f(168), f(278), 9, 6);

// BLOCK 4 — Read Caption + DM (always, owner rule)
var a4 = line("TEXT 4a — Read Caption", "Read Caption", SERIF, 124, IVORY, 382, f(274), DUR, 9, 0, FOIL, f(288));
var b4 = line("TEXT 4b — for your full message", "for your full message", SERIF_I, 64, "F6EAD2", 482, f(277), DUR, 9, 0, null);
var h4 = hairline("Hairline — closing", 548, f(284), DUR, 0);
var c4 = line("TEXT 4c — DM for Personal Tarot Reading", "DM for Personal Tarot Reading", SANS, 44, CTA, 594, f(286), DUR, 9, 0, null, null, 30);
var P4 = panel("Panel — closing", W / 2, 480, Math.max(a4.boxW, c4.boxW, b4.boxW) + 130, 360, f(272), DUR, 9, 0);

var groups = [[P1, a1], [P2, a2], [P3, a3], [P4, a4]];
for (var q = 0; q < groups.length; q++) groups[q][0].moveAfter(groups[q][1]);
log("text built");

var wm = makeText("Watermark — @tarotoverse", "@tarotoverse", SANS, 28, IVORY, W / 2, 170, 0, DUR, 60);
wm.property("Opacity").setValue(85);
var END = R.layers.addSolid([0, 0, 0], "Ending fade", W, H, 1, DUR);
keys(END.property("Opacity"), [[f(388), 0], [DUR, 100]]);

log("layers: " + R.numLayers);
proj.save(new File(ROOT + "/Tarotoverse_King_of_Wands_01.aep"));
log("saved");
var qc = [0, 20, 38, 50, 100, 155, 163, 175, 200, 260, 300, 380];
var sd = new Folder(ROOT + "/qc"); if (!sd.exists) sd.create();
for (var k = 0; k < qc.length; k++) R.saveFrameToPng(f(qc[k]), new File(ROOT + "/qc/f" + ("00" + qc[k]).slice(-3) + ".png"));
log("stills queued");
} catch (e) { log("ERROR line " + e.line + ": " + e.toString()); }
app.endSuppressDialogs(false);
})();
