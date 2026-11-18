// Tarotoverse — The Red Thread 01 (After Effects 2027 build) — original, no footage.
// Plates (all original): art/world_v1.mp4 (tools/redthread_world.py), art/card_face.png + art/card_back.png (tools/redthread_card.py)
// 534 frames @30 = 17.80 s
//   0-2.8 hook | 2.7-5.7 "Distance stretched it." | 5.6-8.6 "But it never broke." | 8.6-9.5 card rises | 9.8-10.4 flip
//   REVEAL 10.4 s (frame 312): II · TWO OF CUPS | 10.45-11.45 the two lights meet above the card (in the world plate)
//   10.93-14.2 "Two hearts, one path back" + share prompt | 14.07-17.8 Read Caption + DM (fade 17.47-17.8)
// Type: Cochin Bold + Cochin Bold Italic (iridescent gradients). Motion motif: lines glide in from opposite sides and meet; on exit they drift apart.
(function () {
var ROOT = "~/Claude AI/Tarotoverse/ae/redthread01";
var W = 1080, H = 1920, FPS = 30, NF = 534, DUR = NF / FPS;
var REVEAL = 312 / FPS, CARD_Y = 1150, CARD_S = 53.33;
var logF = new File(ROOT + "/build_log.txt"); logF.open("w"); logF.close();
function log(s) { logF.open("a"); logF.writeln(s); logF.close(); }
function rgb(h) { return [parseInt(h.substr(0,2),16)/255, parseInt(h.substr(2,2),16)/255, parseInt(h.substr(4,2),16)/255]; }
function f(n) { return n / FPS; }
function setn(fx, nm, v) { try { fx.property(nm).setValue(v); } catch (err) { log("  ! " + fx.name + "." + nm + ": " + err.toString()); } }
function setm(fx, mn, v) { try { fx.property(mn).setValue(v); } catch (err) { log("  ! " + mn + ": " + err.toString()); } }
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

try {
app.beginSuppressDialogs();
try { if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES); } catch (c) {}
app.newProject();
var proj = app.project;
var world = proj.importFile(new ImportOptions(new File(ROOT + "/art/world_v1.mp4")));
var face = proj.importFile(new ImportOptions(new File(ROOT + "/art/card_face.png")));
var back = proj.importFile(new ImportOptions(new File(ROOT + "/art/card_back.png")));
log("world " + world.width + "x" + world.height + " " + world.duration + " | card " + face.width + "x" + face.height);

var R = proj.items.addComp("Tarotoverse — The Red Thread 01", W, H, 1, DUR, FPS);

// World plate with a slow, steady drift in
var WL = R.layers.add(world); WL.name = "World — night sky, two lights, the red thread (original)"; WL.audioEnabled = false;
keys(WL.property("Scale"), [[0, [104, 104]], [DUR, [100, 100]]]);

// Card halo (behind the card), blooms on the reveal then breathes
var HL = R.layers.addShape(); HL.name = "Card halo — rose gold";
var hg = HL.property("Contents").addProperty("ADBE Vector Group");
var hr = hg.property("Contents").addProperty("ADBE Vector Shape - Rect"); hr.property("Size").setValue([face.width * CARD_S / 100 + 30, face.height * CARD_S / 100 + 30]); hr.property("Roundness").setValue(40);
var hf = hg.property("Contents").addProperty("ADBE Vector Graphic - Fill"); hf.property("Color").setValue(rgb("FFB59A"));
HL.property("Position").setValue([W / 2, CARD_Y]);
var hb = HL.property("Effects").addProperty("ADBE Gaussian Blur 2"); hb.property(1).setValue(70);
HL.inPoint = f(300);
keys(HL.property("Opacity"), [[f(300), 0], [REVEAL + 0.08, 95], [REVEAL + 1.4, 45]]); easeAll(HL.property("Opacity"), 60, 60);
HL.property("Opacity").expression = "t=time-" + (REVEAL + 1.4).toFixed(3) + "; t>0 ? 45+8*Math.sin(t*2.1) : value";
HL.property("Position").expression = "value + [0, 6*Math.sin(time*1.3)]";

// Card: back rises, flips; face lands on the reveal (3D layers)
function cardLayer(item, name) {
  var L = R.layers.add(item); L.name = name; L.threeDLayer = true;
  L.property("Scale").setValue([CARD_S, CARD_S, CARD_S]);
  return L;
}
var BK = cardLayer(back, "Card — back (gold mandala)");
BK.inPoint = f(258); BK.outPoint = f(303);
keys(BK.property("Position"), [[f(258), [W / 2, 2500, 0]], [f(285), [W / 2, CARD_Y, 0]]]); easeAll(BK.property("Position"), 20, 80);
keys(BK.property("Y Rotation"), [[f(294), 0], [f(303), 90]]); easeAll(BK.property("Y Rotation"), 70, 10);
keys(BK.property("Z Rotation"), [[f(258), -6], [f(285), 0]]); easeAll(BK.property("Z Rotation"), 20, 80);
var FC = cardLayer(face, "Card — face: II · TWO OF CUPS (original art)");
FC.inPoint = f(303); FC.outPoint = DUR;
FC.property("Position").setValue([W / 2, CARD_Y, 0]);
FC.property("Position").expression = "value + [0, 6*Math.sin(time*1.3), 0]";
keys(FC.property("Y Rotation"), [[f(303), -90], [REVEAL, 0]]); easeAll(FC.property("Y Rotation"), 10, 70);
keys(FC.property("Scale"), [[REVEAL, [CARD_S, CARD_S, CARD_S]], [REVEAL + 0.25, [CARD_S * 1.03, CARD_S * 1.03, CARD_S * 1.03]], [REVEAL + 0.7, [CARD_S, CARD_S, CARD_S]]]); easeAll(FC.property("Scale"), 40, 60);
var fg = FC.property("Effects").addProperty("CC Light Sweep"); fg.name = "Foil shimmer on the reveal";
try { keys(fg.property("Center"), [[REVEAL + 0.1, [-400, 0]], [REVEAL + 1.3, [1500, 2200]]]); } catch (es) { log("card sweep: " + es.toString()); }
setn(fg, "Direction", -35); setn(fg, "Width", 90);
try { keys(fg.property("Sweep Intensity"), [[REVEAL, 0], [REVEAL + 0.15, 45], [REVEAL + 1.05, 45], [REVEAL + 1.3, 0]]); } catch (si) { log("sweep intensity: " + si.toString()); } setn(fg, "Edge Intensity", 0); setn(fg, "Light Color", rgb("FFF2DA"));

// Finish: bloom on the lights, vignette, a whisper of grain
var AJ = R.layers.addSolid([0, 0, 0], "Finish — bloom + vignette + grain", W, H, 1, DUR); AJ.adjustmentLayer = true;
var GL = AJ.property("Effects").addProperty("ADBE Glo2"); GL.name = "Bloom";
setn(GL, "Glow Threshold", 72); setn(GL, "Glow Radius", 55); setn(GL, "Glow Intensity", 0.22);
var LV = AJ.property("Effects").addProperty("ADBE Lumetri"); LV.name = "Vignette";
setm(LV, "ADBE Lumetri-0052", 40); setm(LV, "ADBE Lumetri-0054", 75);
try { var vg = LV.property("ADBE Lumetri-0051"); keys(vg, [[0, -1.0], [f(290), -1.0], [f(310), -1.6], [REVEAL + 0.8, -1.2]]); easeAll(vg, 60, 60); } catch (ev) { log("vignette: " + ev.toString()); }
var NZ = AJ.property("Effects").addProperty("ADBE Noise"); NZ.name = "Film grain"; setn(NZ, "Amount of Noise", 1.6);

// ---- typography
var SERIF = "Cochin-Bold", SERIF_I = "Cochin-BoldItalic", SERIF_L = "Cochin-Italic", SANS = "AvenirNext-DemiBold";
var IVORY = "FFF8EC", CTA = "F3E3BE", PANEL = "160B2E", HAIR = "E9A9B6";
var ROSE  = ["FFB3C8", "FFD6B0", "FF8FAE", "FFC9A6"];   // rose gold
var MOON  = ["D6DEFF", "E9D6FF", "B9C8FF", "F2EAFF"];   // moonlight
var EMBER = ["FF6F8E", "FFD27A", "FF9AA8", "FFB86B"];   // red thread + gold
var AURORA= ["FF9EC4", "FFD978", "C9B2FF", "FFB3C8"];   // rose · gold · lavender
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
  setn(ds, "Shadow Color", [0.04, 0.02, 0.10]); setn(ds, "Opacity", 175); setn(ds, "Distance", 2); setn(ds, "Softness", 16); setn(ds, "Direction", 180);
  var tv = T.property("Source Text").value; log(name + ": box " + Math.round(r.width) + "x" + Math.round(r.height) + " font " + tv.font + " size " + tv.fontSize);
  T.boxW = r.width; T.boxH = r.height; T.cx = cx; T.cy = cy;
  return T;
}
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
    keys(g.property("Point 1"), [[a, [x0 - 60, y0]], [b, [x0 + dx, y0]]]);
    keys(g.property("Point 2"), [[a, [x1 + 60, y0]], [b, [x1, y0 + T.boxH * 0.5]]]);
    keys(g.property("Point 3"), [[a, [x0 - 60, y1]], [b, [x0, y1 - T.boxH * 0.5]]]);
    keys(g.property("Point 4"), [[a, [x1 + 60, y1]], [b, [x1 - dx, y1]]]);
  } catch (ep) { log("gradient points: " + ep.toString()); }
  if (sweepAt) {
    var sw = G.property("Effects").addProperty("CC Light Sweep"); sw.name = "Shimmer";
    try { keys(sw.property("Center"), [[sweepAt, [x0 - 300, T.cy]], [sweepAt + 1.0, [x1 + 300, T.cy]]]); } catch (es) { log("sweep: " + es.toString()); }
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
  rr.property("Size").setValue([w, h]); rr.property("Roundness").setValue(52);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fl.property("Color").setValue(rgb(PANEL)); fl.property("Opacity").setValue(48);
  var st = g.property("Contents").addProperty("ADBE Vector Graphic - Stroke"); st.property("Color").setValue(rgb(HAIR)); st.property("Opacity").setValue(32); st.property("Stroke Width").setValue(1.5);
  P.property("Position").setValue([cx, cy]);
  P.inPoint = t0; P.outPoint = t1;
  var op = P.property("Opacity");
  if (inF) { keys(op, [[t0, 0], [t0 + f(inF), 100]]); keys(P.property("Scale"), [[t0, [94, 100]], [t0 + f(inF + 3), [100, 100]]]); easeAll(P.property("Scale"), 20, 85); }
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
// Motion motif: two lines glide in from opposite sides and meet; on exit they drift apart again.
function enterSide(T, t0, frames, side) {
  var p = T.property("Position").value;
  keys(T.property("Position"), [[t0, [p[0] + side * 46, p[1]]], [t0 + f(frames), p]]); easeAll(T.property("Position"), 20, 88);
  keys(T.property("Opacity"), [[t0, 0], [t0 + f(frames - 3), 100]]);
}
function exitSide(T, t1, frames, side) {
  var pr = T.property("Position"); var p = pr.valueAtTime(t1 - f(frames), false);
  keys(pr, [[t1 - f(frames), p], [t1, [p[0] + side * 40, p[1]]]]);
  keys(T.property("Opacity"), [[t1 - f(frames), 100], [t1, 0]]);
}
function line(name, str, font, size, hex, cy, t0, t1, enterF, exitF, side, pal, sweepAt, tracking) {
  var T = makeText(name, str, font, size, hex, W / 2, cy, t0, t1, tracking);
  if (enterF) enterSide(T, t0, enterF, side);
  if (exitF) exitSide(T, t1, exitF, side);
  if (pal) irid(T, pal, sweepAt);
  return T;
}

// BLOCK 1 — hook (readable on frame 0)
var a1 = line("TEXT 1a — Waiting for them", "Waiting for them", SERIF, 104, IVORY, 400, 0, f(84), 0, 7, -1, null);
var b1 = line("TEXT 1b — to come back?", "to come back?", SERIF_I, 132, IVORY, 522, 0, f(84), 0, 7, 1, ROSE, f(12));
var P1 = panel("Panel — hook", W / 2, 462, Math.max(a1.boxW, b1.boxW) + 130, 320, 0, f(84), 0, 7);

// BLOCK 2 — the lights pull apart
var a2 = line("TEXT 2a — Distance", "Distance", SERIF, 118, IVORY, 400, f(80), f(171), 10, 7, -1, null);
var b2 = line("TEXT 2b — stretched it.", "stretched it.", SERIF_I, 132, IVORY, 524, f(82), f(171), 10, 7, 1, MOON, f(100));
var P2 = panel("Panel — distance", W / 2, 464, Math.max(a2.boxW, b2.boxW) + 130, 320, f(80), f(171), 8, 7);

// BLOCK 3 — the thread holds
var a3 = line("TEXT 3a — But it", "But it", SERIF, 118, IVORY, 400, f(167), f(258), 10, 7, -1, null);
var b3 = line("TEXT 3b — never broke.", "never broke.", SERIF_I, 140, IVORY, 526, f(169), f(258), 10, 7, 1, EMBER, f(185));
var P3 = panel("Panel — never broke", W / 2, 464, Math.max(a3.boxW, b3.boxW) + 130, 320, f(167), f(258), 8, 7);

// BLOCK 4 — the message + engagement (after the reveal at frame 312)
var a4 = line("TEXT 4a — Two hearts,", "Two hearts,", SERIF, 104, IVORY, 360, f(328), f(426), 10, 7, -1, null);
var b4 = line("TEXT 4b — one path back", "one path back", SERIF_I, 140, IVORY, 482, f(330), f(426), 10, 7, 1, AURORA, f(342));
var h4 = hairline("Hairline — message", 566, f(338), f(426), 7);
var c4 = line("TEXT 4c — Send this to someone still waiting", "Send this to someone still waiting", SANS, 40, "FFC9DC", 608, f(342), f(426), 10, 7, -1, null, null, 30);
var P4 = panel("Panel — message", W / 2, 478, Math.max(a4.boxW, b4.boxW, c4.boxW) + 130, 380, f(326), f(426), 9, 7);

// BLOCK 5 — Read Caption + DM (always, owner rule)
var a5 = line("TEXT 5a — Read Caption", "Read Caption", SERIF, 124, IVORY, 392, f(422), DUR, 10, 0, -1, FOIL, f(436));
var b5 = line("TEXT 5b — for your full message", "for your full message", SERIF_L, 62, "F2E6FF", 490, f(425), DUR, 10, 0, 1, null);
var h5 = hairline("Hairline — closing", 556, f(432), DUR, 0);
var c5 = line("TEXT 5c — DM for Personal Tarot Reading", "DM for Personal Tarot Reading", SANS, 44, CTA, 602, f(434), DUR, 10, 0, -1, null, null, 30);
var P5 = panel("Panel — closing", W / 2, 488, Math.max(a5.boxW, c5.boxW, b5.boxW) + 130, 360, f(420), DUR, 9, 0);

var groups = [[P1, a1], [P2, a2], [P3, a3], [P4, a4], [P5, a5]];
for (var q = 0; q < groups.length; q++) groups[q][0].moveAfter(groups[q][1]);
log("text built");

var wm = makeText("Watermark — @tarotoverse", "@tarotoverse", SANS, 28, IVORY, W / 2, 170, 0, DUR, 60);
wm.property("Opacity").setValue(82);
var END = R.layers.addSolid([0, 0, 0], "Ending fade", W, H, 1, DUR);
keys(END.property("Opacity"), [[f(524), 0], [DUR, 100]]);

log("layers: " + R.numLayers);
proj.save(new File(ROOT + "/Tarotoverse_Red_Thread_01.aep"));
log("saved");
var qc = [0, 60, 120, 210, 270, 290, 300, 312, 330, 345, 380, 450, 520];
var sd = new Folder(ROOT + "/qc"); if (!sd.exists) sd.create();
for (var k = 0; k < qc.length; k++) R.saveFrameToPng(f(qc[k]), new File(ROOT + "/qc/f" + ("00" + qc[k]).slice(-3) + ".png"));
log("stills queued");
} catch (e) { log("ERROR line " + e.line + ": " + e.toString()); }
app.endSuppressDialogs(false);
})();
