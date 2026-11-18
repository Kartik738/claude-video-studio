// Tarotoverse — Universe Love Message 02 (After Effects 2027 build)
// Raw footage: ~/Downloads/IMG_7061.MOV (2160x3840, 30 fps, 17.93 s) — imported, never modified.
// Edit (reel frames @30, 434 frames = 14.467 s):
//   Shot 1  close-up of the golden lotus diyas: src 0.50-1.57, T 0-1.067 (native 4K pixels, no upscaling)
//   Shot 2  wide, single take: src 3.55 -> 17.83 (dissolve in T 0.85-1.067)
//           T 0.85-2.5 @1.0x (hand enters) | T 2.5-5.833 @1.2x (spreading) | T 5.833-end @1.0x (pick, flip, hold)
//   Card clearly revealed: src 11.500 = T 8.1333 (frame 244)
// Text: Wait!! 0-1.9 | You need to see this 1.83-4.70 | Universe... 4.63-10.6 | Read Caption + DM 10.6-end
(function () {
var ROOT = "~/Claude AI/tarotoverse/ae/universe02";
var SRC = "~/Downloads/IMG_7061.MOV";
var FX = ROOT + "/fx";
var W = 1080, H = 1920, FPS = 30, NF = 434, DUR = NF / FPS;
var REVEAL = 244 / FPS;
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
  var L = layer.property("Effects").addProperty("ADBE Lumetri"); L.name = "Lumetri — correction & candlelit grade";
  setm(L, "ADBE Lumetri-0007", -5);    // temperature: calm the orange cast a little (keep candle warmth)
  setm(L, "ADBE Lumetri-0008", 4);     // tint: hint of rose/plum
  setm(L, "ADBE Lumetri-0011", -0.10); // exposure
  setm(L, "ADBE Lumetri-0012", 10);    // contrast
  setm(L, "ADBE Lumetri-0013", -32);   // highlights (candles, white card border)
  setm(L, "ADBE Lumetri-0014", 6);     // shadows (keep cloth texture)
  setm(L, "ADBE Lumetri-0015", -12);   // whites
  setm(L, "ADBE Lumetri-0016", -6);    // blacks (deep, not crushed)
  setm(L, "ADBE Lumetri-0020", 92);    // saturation (red cloth is near clipping)
  setm(L, "ADBE Lumetri-0029", 12);    // gentle sharpen at 4K, before the downscale
  setm(L, "ADBE Lumetri-0030", 9);     // vibrance
  return L;
}

try {
app.beginSuppressDialogs();
try { if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES); } catch (c) {}
app.newProject();
var proj = app.project;
var foot = proj.importFile(new ImportOptions(new File(SRC)));
log("footage " + foot.width + "x" + foot.height + " fps " + foot.frameRate + " dur " + foot.duration);
function seq(folder, first) {
  var io = new ImportOptions(new File(FX + "/" + folder + "/" + first));
  io.sequence = true; io.forceAlphabetical = true;
  var it = proj.importFile(io); it.mainSource.conformFrameRate = FPS;
  it.mainSource.alphaMode = AlphaMode.STRAIGHT; return it;
}
var cardlight = seq("cardlight", "cardlight_0207.png"), dust = seq("dust", "dust_0000.png");
var scrim = proj.importFile(new ImportOptions(new File(FX + "/scrim.png")));
log("sequences " + cardlight.duration + " / " + dust.duration);

// ============ SCENE (4K source space): graded wide shot + light from the card ============
var S = proj.items.addComp("Scene 4K — wide shot + card light", 2160, 3840, 1, DUR, FPS);
var V = S.layers.add(foot); V.name = "IMG_7061 — wide (time remapped)"; V.audioEnabled = false;
V.timeRemapEnabled = true;
var tr = V.property("ADBE Time Remapping");
keys(tr, [[0, 2.70], [f(75), 5.2], [f(175), 9.2], [DUR, 9.2 + DUR - f(175)]]);
linearAll(tr); V.outPoint = DUR;
log("remap: reveal T" + REVEAL.toFixed(4) + " -> src " + tr.valueAtTime(REVEAL, false));
grade(V);
var CL = S.layers.add(cardlight); CL.name = "Card light — rays, rim, rising motes (tracked)";
CL.startTime = f(207); CL.inPoint = f(207); CL.outPoint = DUR;
CL.property("Scale").setValue([200, 200]); CL.blendingMode = BlendingMode.SCREEN;

// ============ REEL (1080x1920) ============
var R = proj.items.addComp("Tarotoverse — Universe Love Message 02", W, H, 1, DUR, FPS);

// Shot 2 — the wide take; camera moves about the card centre
var SL = R.layers.add(S); SL.name = "Shot 2 — wide take (camera)";
SL.property("Anchor Point").setValue([945, 1918]); SL.property("Position").setValue([472.5, 959]);
var sc = SL.property("Scale");
keys(sc, [[f(25.5), [55, 55]], [f(174), [50, 50]], [REVEAL, [50, 50]], [DUR, [53.25, 53.25]]]);
easeAll(sc, 50, 50);
SL.inPoint = f(25);

// Shot 1 — close-up of the golden lotus diyas (100% of the 4K frame = native pixels)
var C1 = R.layers.add(foot); C1.name = "Shot 1 — lotus diya close-up"; C1.audioEnabled = false;
C1.timeRemapEnabled = true;
var tr1 = C1.property("ADBE Time Remapping"); keys(tr1, [[0, 0.5], [f(40), 0.5 + f(40)]]); linearAll(tr1);
C1.inPoint = 0; C1.outPoint = f(33);
C1.property("Anchor Point").setValue([1080, 1600]); C1.property("Position").setValue([540, 960]);
keys(C1.property("Scale"), [[0, [100, 100]], [f(33), [103.5, 103.5]]]);
keys(C1.property("Opacity"), [[f(25), 100], [f(32), 0]]); easeAll(C1.property("Opacity"), 50, 50);
grade(C1);

// Finishing adjustment: soft highlight diffusion + vignette that deepens into the reveal
var AJ = R.layers.addSolid([0, 0, 0], "Finish — diffusion + vignette", W, H, 1, DUR); AJ.adjustmentLayer = true;
var GL = AJ.property("Effects").addProperty("ADBE Glo2"); GL.name = "Highlight diffusion";
setn(GL, "Glow Threshold", 92); setn(GL, "Glow Radius", 70); setn(GL, "Glow Intensity", 0.12);
var LV = AJ.property("Effects").addProperty("ADBE Lumetri"); LV.name = "Vignette";
setm(LV, "ADBE Lumetri-0052", 45); setm(LV, "ADBE Lumetri-0054", 75);
try { var vg = LV.property("ADBE Lumetri-0051"); keys(vg, [[0, -0.8], [f(200), -0.8], [f(238), -1.5], [REVEAL + 0.5, -1.0], [DUR, -1.0]]); easeAll(vg, 60, 60); } catch (e) { log("vignette: " + e); }

// Atmosphere
var DL = R.layers.add(dust); DL.name = "Celestial stardust (depth)"; DL.blendingMode = BlendingMode.SCREEN; DL.startTime = 0; DL.outPoint = DUR;
var SC = R.layers.add(scrim); SC.name = "Twilight scrim behind the text band"; SC.outPoint = DUR;

// ---- typography
var SERIF_B = "Baskerville-Bold", SERIF = "Baskerville-SemiBold", SERIF_I = "Baskerville-SemiBoldItalic", SANS = "AvenirNext-DemiBold";
var IVORY = "FFF8EC", CHAMP = "F5D9AE", CTA = "F3E3BE";
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
  setn(ds, "Shadow Color", [0.06, 0.02, 0.07]); setn(ds, "Opacity", 185); setn(ds, "Distance", 3); setn(ds, "Softness", 22); setn(ds, "Direction", 180);
  var tv = T.property("Source Text").value; log(name + ": box " + Math.round(r.width) + "x" + Math.round(r.height) + " font " + tv.font + " size " + tv.fontSize);
  return T;
}
function blurIn(T, a, b, amt) {
  var gb = T.property("Effects").addProperty("ADBE Gaussian Blur 2"); gb.name = "Focus";
  var p = gb.property(1); var k = [[a, amt]]; if (b) k.push([b, 0]); keys(p, k);
  return gb;
}
function blurOut(T, a, b) {
  var gb = T.property("Effects").addProperty("ADBE Gaussian Blur 2"); gb.name = "Release";
  keys(gb.property(1), [[a, 0], [b, 12]]);
  return gb;
}
function opac(T, arr) { keys(T.property("Opacity"), arr); }
function sweep(T, a, b, y, width, inten) {
  var sw = T.property("Effects").addProperty("CC Light Sweep"); sw.name = "Light sweep";
  try { keys(sw.property("Center"), [[a, [-300, y]], [b, [1400, y]]]); } catch (e) { log("sweep " + e); }
  setn(sw, "Direction", -24); setn(sw, "Width", width); setn(sw, "Sweep Intensity", inten); setn(sw, "Edge Intensity", 0);
  setn(sw, "Light Color", rgb("FFE9CC")); setn(sw, "Light Reception", 1);
  return sw;
}
var TY = 384;   // centre of the text band (above the card; card top ~ y 550 at the end of the push-in)

// TEXT 1 — Wait!!  (frames 0-57): fully visible on frame 0, soft settle
var t1 = makeText("TEXT 1 — Wait!!", "Wait!!", SERIF_B, 230, IVORY, W / 2, TY, 0, f(58), 20, 0);
keys(t1.property("Scale"), [[0, [104, 104]], [f(8), [100, 100]], [f(52), [100, 100]], [f(58), [103, 103]]]); easeAll(t1.property("Scale"), 20, 80);
opac(t1, [[f(52), 100], [f(58), 0]]);
blurOut(t1, f(52), f(58));

// TEXT 2 — You need to see this (frames 55-141): readable by frame ~59
var t2 = makeText("TEXT 2 — You need to see this", "You need\rto see this", SERIF, 112, IVORY, W / 2, TY, f(55), f(141), 10, 128);
opac(t2, [[f(55), 0], [f(62), 100], [f(135), 100], [f(141), 0]]);
var p2 = t2.property("Position").value; keys(t2.property("Position"), [[f(55), [p2[0], p2[1] + 18]], [f(63), p2]]); easeAll(t2.property("Position"), 20, 85);
blurIn(t2, f(55), f(62), 8); blurOut(t2, f(135), f(141));

// TEXT 3 — the hero message (frames 139-324): whole sentence readable by frame ~153
var L1Y = TY - 52, L2Y = TY + 58;
var t3a = makeText("TEXT 3a — Universe has a message", "Universe has a message", SERIF, 84, IVORY, W / 2, L1Y, f(139), f(324), 12, 0);
var t3b = makeText("TEXT 3b — for your love life", "for your love life", SERIF_I, 104, CHAMP, W / 2, L2Y, f(141), f(324), 6, 0);
opac(t3a, [[f(139), 0], [f(149), 100], [f(318), 100], [f(324), 0]]);
opac(t3b, [[f(141), 0], [f(152), 100], [f(318), 100], [f(324), 0]]);
keys(t3a.property("Scale"), [[f(139), [97, 97]], [f(153), [100, 100]]]); easeAll(t3a.property("Scale"), 20, 85);
keys(t3b.property("Scale"), [[f(141), [97, 97]], [f(156), [100, 100]]]); easeAll(t3b.property("Scale"), 20, 85);
blurIn(t3a, f(139), f(149), 10); blurIn(t3b, f(141), f(152), 10);
// a soft warm halo on "for your love life" that breathes up on the card reveal
var hg = t3b.property("Effects").addProperty("ADBE Glo2"); hg.name = "Champagne halo";
setn(hg, "Glow Threshold", 55); setn(hg, "Glow Radius", 26);
try { keys(hg.property("Glow Intensity"), [[f(150), 0.15], [f(236), 0.15], [f(248), 0.45], [f(290), 0.2]]); easeAll(hg.property("Glow Intensity"), 50, 50); } catch (e) { log("halo " + e); }
sweep(t3a, f(158), f(188), 60, 60, 45);
sweep(t3b, f(240), f(268), 60, 60, 55);   // shimmer across "love life" as the card is revealed
blurOut(t3a, f(318), f(324)); blurOut(t3b, f(318), f(324));

// TEXT 4 — Read Caption (from frame 318) and TEXT 5 — CTA (from frame 323)
var RCY = TY - 34;
var t4 = makeText("TEXT 4 — Read Caption", "Read Caption", SERIF, 124, IVORY, W / 2, RCY, f(318), DUR, 8, 0);
opac(t4, [[f(318), 0], [f(326), 100]]);
keys(t4.property("Scale"), [[f(318), [96, 96]], [f(332), [100, 100]]]); easeAll(t4.property("Scale"), 20, 85);
blurIn(t4, f(318), f(326), 8);
sweep(t4, f(336), f(364), 60, 55, 45);

var RULE = R.layers.addShape(); RULE.name = "Champagne hairline";
var rg = RULE.property("Contents").addProperty("ADBE Vector Group");
var rr = rg.property("Contents").addProperty("ADBE Vector Shape - Rect"); rr.property("Size").setValue([150, 2]);
var rf = rg.property("Contents").addProperty("ADBE Vector Graphic - Fill"); rf.property("Color").setValue(rgb("E9C99A"));
RULE.property("Position").setValue([W / 2, TY + 44]); RULE.inPoint = f(321); RULE.outPoint = DUR;
keys(RULE.property("Opacity"), [[f(321), 0], [f(331), 75]]);
keys(RULE.property("Scale"), [[f(321), [20, 100]], [f(336), [100, 100]]]); easeAll(RULE.property("Scale"), 20, 85);

var t5 = makeText("TEXT 5 — DM for Personal Tarot Reading", "DM for Personal Tarot Reading", SANS, 46, CTA, W / 2, TY + 96, f(323), DUR, 30, 0);
opac(t5, [[f(323), 0], [f(333), 100]]);
var p5 = t5.property("Position").value; keys(t5.property("Position"), [[f(323), [p5[0], p5[1] + 12]], [f(334), p5]]); easeAll(t5.property("Position"), 20, 85);

// BRANDING — @tarotoverse, discreet, the whole Reel
var wm = makeText("Watermark — @tarotoverse", "@tarotoverse", SANS, 30, IVORY, W / 2, 186, 0, DUR, 60, 0);
wm.property("Opacity").setValue(80);

// Ending — a short fade to black (last 12 frames)
var END = R.layers.addSolid([0, 0, 0], "Ending fade", W, H, 1, DUR);
keys(END.property("Opacity"), [[f(422), 0], [DUR, 100]]);

log("layers: " + R.numLayers);
proj.save(new File(ROOT + "/Tarotoverse_Universe_Love_Message_02.aep"));
log("saved");

var qc = [0, 5, 20, 29, 33, 45, 57, 60, 75, 100, 140, 150, 160, 200, 230, 244, 250, 270, 300, 318, 326, 340, 380, 420, 433];
var sd = new Folder(ROOT + "/qc"); if (!sd.exists) sd.create();
for (var q = 0; q < qc.length; q++) R.saveFrameToPng(f(qc[q]), new File(ROOT + "/qc/f" + ("00" + qc[q]).slice(-3) + ".png"));
log("stills queued");
} catch (e) { log("ERROR line " + e.line + ": " + e); }
app.endSuppressDialogs(false);
})();
