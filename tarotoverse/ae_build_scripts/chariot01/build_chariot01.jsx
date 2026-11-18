// Tarotoverse — Chariot 01 (After Effects 2027 build)
// Raw footage: ~/Downloads/IMG_6761.MOV (2160x3840 portrait, 30 fps, 19.9 s) — imported, never modified.
// Edit (reel frames @30, 453 frames = 15.10 s), one continuous take with a "momentum" speed ramp:
//   T 0.000-6.000  src 0.40-9.40   @1.5x  sage cleansing over the spread
//   T 6.000-9.667  src 9.40-15.27  @1.6x  the hand chooses
//   T 9.667-10.833 src 15.27-16.43 @1.0x  pull and flip (real speed)
//   T 10.833-15.10 src 16.43-19.85 @0.8x  hold on The Chariot
//   Card clearly revealed: src 16.433 = T 10.8333 (frame 325)
// Text: Feeling stuck? 0-70 | Let's clear the old energy 66-178 | Your next move is in this card 175-322
//       Momentum is on your side 336-end | DM for Personal Tarot Reading 348-end
(function () {
var ROOT = "~/Claude AI/Tarotoverse/ae/chariot01";
var SRC = "~/Downloads/IMG_6761.MOV";
var W = 1080, H = 1920, FPS = 30, NF = 453, DUR = NF / FPS;
var REVEAL = 325 / FPS;
var logF = new File(ROOT + "/build_log.txt"); logF.open("w"); logF.close();
function log(s) { logF.open("a"); logF.writeln(s); logF.close(); }
function rgb(h) { return [parseInt(h.substr(0,2),16)/255, parseInt(h.substr(2,2),16)/255, parseInt(h.substr(4,2),16)/255]; }
function f(n) { return n / FPS; }
function setm(fx, mn, v) { try { fx.property(mn).setValue(v); } catch (e) { log("  ! " + mn + ": " + e); } }
function setn(fx, nm, v) { try { fx.property(nm).setValue(v); } catch (e) { log("  ! " + fx.name + "." + nm + ": " + e); } }
function keys(prop, arr) { for (var i = 0; i < arr.length; i++) prop.setValueAtTime(arr[i][0], arr[i][1]); }
function easeAll(prop, inf, outf) {
  for (var k = 1; k <= prop.numKeys; k++) {
    try {
      var dim = 1; var v = prop.keyValue(k);
      if (v instanceof Array && prop.propertyValueType != PropertyValueType.TwoD_SPATIAL && prop.propertyValueType != PropertyValueType.ThreeD_SPATIAL) dim = v.length;
      var ei = [], eo = []; for (var d = 0; d < dim; d++) { ei.push(new KeyframeEase(0, inf || 75)); eo.push(new KeyframeEase(0, outf || 75)); }
      prop.setTemporalEaseAtKey(k, ei, eo);
    } catch (x) { log("  ease " + prop.name + " k" + k + ": " + x); }
  }
}
function linearAll(prop) { for (var k = 1; k <= prop.numKeys; k++) prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR); }

function grade(layer) {
  var L = layer.property("Effects").addProperty("ADBE Lumetri"); L.name = "Lumetri — midnight-velvet grade";
  setm(L, "ADBE Lumetri-0007", -3);    // temperature: a touch cooler, keeps skin natural
  setm(L, "ADBE Lumetri-0008", 2);     // tint
  setm(L, "ADBE Lumetri-0011", -0.15); // exposure: daylight footage was bright
  setm(L, "ADBE Lumetri-0012", 14);    // contrast
  setm(L, "ADBE Lumetri-0013", -36);   // highlights (white card, pale deck)
  setm(L, "ADBE Lumetri-0014", -4);    // shadows
  setm(L, "ADBE Lumetri-0015", -10);   // whites
  setm(L, "ADBE Lumetri-0016", -10);   // blacks: deeper navy velvet, not crushed
  setm(L, "ADBE Lumetri-0020", 96);    // saturation
  setm(L, "ADBE Lumetri-0029", 10);    // gentle sharpen before the downscale
  setm(L, "ADBE Lumetri-0030", 10);    // vibrance
  return L;
}

try {
app.beginSuppressDialogs();
try { if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES); } catch (c) {}
app.newProject();
var proj = app.project;
var foot = proj.importFile(new ImportOptions(new File(SRC)));
log("footage " + foot.width + "x" + foot.height + " fps " + foot.frameRate + " dur " + foot.duration);
var io = new ImportOptions(new File(ROOT + "/fx/chariotlight/chariotlight_0306.png"));
io.sequence = true; io.forceAlphabetical = true;
var light = proj.importFile(io); light.mainSource.conformFrameRate = FPS; light.mainSource.alphaMode = AlphaMode.STRAIGHT;
log("light seq " + light.duration);

// ============ SCENE (4K source space): graded take + light in motion ============
var S = proj.items.addComp("Scene 4K — single take + Chariot light", 2160, 3840, 1, DUR, FPS);
var V = S.layers.add(foot); V.name = "IMG_6761 — single take (momentum ramp)"; V.audioEnabled = false;
V.timeRemapEnabled = true;
var tr = V.property("ADBE Time Remapping");
keys(tr, [[0, 0.40], [f(180), 9.40], [f(290), 15.2667], [REVEAL, 16.4333], [DUR, 16.4333 + 0.8 * (DUR - REVEAL)]]);
linearAll(tr); V.outPoint = DUR;
log("remap: reveal T" + REVEAL.toFixed(4) + " -> src " + tr.valueAtTime(REVEAL, false).toFixed(4) + " | end src " + tr.valueAtTime(DUR - 0.001, false).toFixed(3));
grade(V);
var LL = S.layers.add(light); LL.name = "Chariot light — comet streak + halo (tracked, off the artwork)";
LL.startTime = f(306); LL.inPoint = f(306); LL.outPoint = DUR;
LL.property("Scale").setValue([200, 200]); LL.property("Position").setValue([1080, 1920]);
LL.blendingMode = BlendingMode.SCREEN;

// ============ REEL (1080x1920) ============
var R = proj.items.addComp("Tarotoverse — Chariot 01", W, H, 1, DUR, FPS);
var SL = R.layers.add(S); SL.name = "Camera — drift in, surge on the flip";
SL.property("Anchor Point").setValue([1015, 2074]); SL.property("Position").setValue([507.5, 1037]);
var sc = SL.property("Scale");
keys(sc, [[0, [50.5, 50.5]], [f(290), [53, 53]], [f(298), [53.2, 53.2]], [f(328), [55.5, 55.5]], [DUR, [56.2, 56.2]]]);
easeAll(sc, 40, 40);

// Finishing: soft highlight diffusion + vignette that deepens into the reveal
var AJ = R.layers.addSolid([0, 0, 0], "Finish — diffusion + vignette", W, H, 1, DUR); AJ.adjustmentLayer = true;
var GL = AJ.property("Effects").addProperty("ADBE Glo2"); GL.name = "Highlight diffusion";
setn(GL, "Glow Threshold", 90); setn(GL, "Glow Radius", 60); setn(GL, "Glow Intensity", 0.10);
var LV = AJ.property("Effects").addProperty("ADBE Lumetri"); LV.name = "Vignette";
setm(LV, "ADBE Lumetri-0052", 45); setm(LV, "ADBE Lumetri-0054", 70);
try { var vg = LV.property("ADBE Lumetri-0051"); keys(vg, [[0, -0.9], [f(290), -0.9], [f(322), -1.6], [REVEAL + 0.6, -1.1], [DUR, -1.1]]); easeAll(vg, 60, 60); } catch (e) { log("vignette: " + e); }

// ---- typography: Didot (regal, high-contrast) + Avenir Next on navy glass panels
var DIDOT = "Didot-Bold", SANS = "AvenirNext-DemiBold";
var IVORY = "FFF8EC", CHAMP = "F5D9AE", CTA = "F3E3BE", NAVY = "0B1233", SILVER = "C9D3FF";
function makeText(name, str, font, size, hex, cx, cy, t0, t1, tracking, lead) {
  var T = R.layers.addText(str); T.name = name;
  var sp = T.property("Source Text"); var td = sp.value;
  td.resetCharStyle(); td.font = font; td.fontSize = size; td.fillColor = rgb(hex); td.applyFill = true; td.applyStroke = false;
  td.justification = ParagraphJustification.CENTER_JUSTIFY; td.tracking = tracking || 0;
  if (lead) { td.autoLeading = false; td.leading = lead; }
  sp.setValue(td);
  T.inPoint = t0; T.outPoint = t1;
  var r = T.sourceRectAtTime(t0 + 0.5 / FPS, false);
  T.property("Anchor Point").setValue([r.left + r.width / 2, r.top + r.height / 2]);
  T.property("Position").setValue([cx, cy]);
  var ds = T.property("Effects").addProperty("ADBE Drop Shadow"); ds.name = "Legibility shadow";
  setn(ds, "Shadow Color", [0.02, 0.03, 0.10]); setn(ds, "Opacity", 160); setn(ds, "Distance", 2); setn(ds, "Softness", 16); setn(ds, "Direction", 180);
  var tv = T.property("Source Text").value; log(name + ": box " + Math.round(r.width) + "x" + Math.round(r.height) + " font " + tv.font + " size " + tv.fontSize);
  T.boxW = r.width; T.boxH = r.height;
  return T;
}
// Navy glass panel (brand backing) with a fine moonlight hairline, sized to its content
function panel(name, cx, cy, w, h, t0, t1, inF, outF) {
  var P = R.layers.addShape(); P.name = name;
  var g = P.property("Contents").addProperty("ADBE Vector Group");
  var rr = g.property("Contents").addProperty("ADBE Vector Shape - Rect");
  rr.property("Size").setValue([w, h]); rr.property("Roundness").setValue(44);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fl.property("Color").setValue(rgb(NAVY)); fl.property("Opacity").setValue(60);
  var st = g.property("Contents").addProperty("ADBE Vector Graphic - Stroke"); st.property("Color").setValue(rgb(SILVER)); st.property("Opacity").setValue(28); st.property("Stroke Width").setValue(1.5);
  P.property("Position").setValue([cx, cy]);
  P.inPoint = t0; P.outPoint = t1;
  var op = P.property("Opacity");
  if (inF) { keys(op, [[t0, 0], [t0 + f(inF), 100]]); keys(P.property("Scale"), [[t0, [94, 100]], [t0 + f(inF + 2), [100, 100]]]); easeAll(P.property("Scale"), 20, 85); }
  if (outF) { keys(op, [[t1 - f(outF), 100], [t1, 0]]); }
  return P;
}
// Motion motif: everything arrives from the left and leaves to the right — forward movement.
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

var TY = 395;   // hook band: above the deck, over the crystals (panel keeps it readable)

// TEXT 1 — hook, fully readable on frame 0
var t1 = makeText("TEXT 1 — Feeling stuck?", "Feeling\rstuck?", DIDOT, 168, IVORY, W / 2, TY, 0, f(70), 0, 172);
keys(t1.property("Scale"), [[0, [103, 103]], [f(10), [100, 100]]]); easeAll(t1.property("Scale"), 20, 80);
exitRight(t1, f(70), 6);
var p1 = panel("Panel — hook", W / 2, TY, t1.boxW + 120, t1.boxH + 84, 0, f(70), 0, 6);

// TEXT 2 — during the sage cleansing
var t2 = makeText("TEXT 2 — Let's clear the old energy", "Let’s clear\rthe old energy", DIDOT, 112, IVORY, W / 2, TY, f(66), f(178), 0, 120);
enterFromLeft(t2, f(66), 10); exitRight(t2, f(178), 6);
var p2 = panel("Panel — clearing", W / 2, TY, t2.boxW + 110, t2.boxH + 78, f(66), f(178), 8, 6);

// TEXT 3 — while the hand chooses
var t3 = makeText("TEXT 3 — Your next move is in this card", "Your next move\ris in this card", DIDOT, 108, IVORY, W / 2, TY, f(175), f(322), 0, 118);
enterFromLeft(t3, f(175), 10); exitRight(t3, f(322), 6);
var p3 = panel("Panel — next move", W / 2, TY, t3.boxW + 110, t3.boxH + 78, f(175), f(322), 8, 6);

// REVEAL BLOCK — after the card lands (frame 325)
var BY = 352;
var t5 = makeText("TEXT 5 — Momentum is on your side", "Momentum is\ron your side", DIDOT, 104, IVORY, W / 2, BY, f(336), DUR, 0, 108);
var RULE = R.layers.addShape(); RULE.name = "Moonlight hairline";
var rg = RULE.property("Contents").addProperty("ADBE Vector Group");
var rr = rg.property("Contents").addProperty("ADBE Vector Shape - Rect"); rr.property("Size").setValue([140, 2]);
var rf = rg.property("Contents").addProperty("ADBE Vector Graphic - Fill"); rf.property("Color").setValue(rgb("E9C99A"));
RULE.property("Position").setValue([W / 2, 480]); RULE.inPoint = f(344); RULE.outPoint = DUR;
keys(RULE.property("Opacity"), [[f(344), 0], [f(352), 80]]);
keys(RULE.property("Scale"), [[f(344), [10, 100]], [f(358), [100, 100]]]); easeAll(RULE.property("Scale"), 20, 85);
var t6 = makeText("TEXT 6 — DM for Personal Tarot Reading", "DM for Personal Tarot Reading", SANS, 44, CTA, W / 2, 520, f(348), DUR, 30, 0);
enterFromLeft(t5, f(336), 10); enterFromLeft(t6, f(348), 10);
log('A enter ok');
var blockW = Math.max(t5.boxW, t6.boxW) + 120;
var p4 = panel("Panel — reveal block", W / 2, 378, blockW, 330, f(331), DUR, 9, 0);
log('B panel4 ok');
// (text glow removed: AE threw on Glow Color A; the halo around the card already carries the reveal)
log('C glow ok');
// panels sit behind their text
var pairs = [[p1, t1], [p2, t2], [p3, t3]];
for (var q = 0; q < pairs.length; q++) pairs[q][0].moveAfter(pairs[q][1]);
p4.moveAfter(t5);   // t5 is the lowest layer of the reveal block, so the panel sits under all of it

log('D order ok');
// BRANDING — @tarotoverse, discreet, top centre, the whole Reel
var wm = makeText("Watermark — @tarotoverse", "@tarotoverse", SANS, 28, IVORY, W / 2, 164, 0, DUR, 60, 0);
wm.property("Opacity").setValue(80);

// Ending — short fade to black (last 10 frames)
var END = R.layers.addSolid([0, 0, 0], "Ending fade", W, H, 1, DUR);
keys(END.property("Opacity"), [[f(443), 0], [DUR, 100]]);

log("layers: " + R.numLayers);
proj.save(new File(ROOT + "/Tarotoverse_Chariot_01.aep"));
log("saved");

var qc = [0, 30, 69, 75, 120, 177, 185, 250, 300, 316, 322, 325, 330, 340, 352, 380, 420, 445];
var sd = new Folder(ROOT + "/qc"); if (!sd.exists) sd.create();
for (var k = 0; k < qc.length; k++) R.saveFrameToPng(f(qc[k]), new File(ROOT + "/qc/f" + ("00" + qc[k]).slice(-3) + ".png"));
log("stills queued");
} catch (e) { log("ERROR line " + e.line + ": " + e); }
app.endSuppressDialogs(false);
})();
