// Tarotoverse — Universe Love Message 01 (After Effects 2027 build)
// Raw footage: ~/Downloads/IMG_7061.MOV (2160x3840, 30 fps, 17.93 s) — imported, never modified.
// Timeline (frames @30): A src 0.6-4.2 @2.0x -> T 0-54 | B src 4.2-9.4 @1.608x -> T 54-151 | C src 9.4-17.6 @1x -> T 151-397
// Card clearly revealed at src 11.500 s = T 7.1333 s (frame 214). "Read Caption" at frame 274 = T 9.1333 s (+2.000 s).
(function () {
var ROOT = "~/Claude AI/tarotoverse/ae/universe01";
var SRC = "~/Downloads/IMG_7061.MOV";
var FX = ROOT + "/fx_v2";
var W = 1080, H = 1920, FPS = 30, NF = 397, DUR = NF / FPS;
var REVEAL = 214 / FPS, READ = 274 / FPS;
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
var aura = seq("aura", "aura_0196.png"), ripple = seq("ripple", "ripple_0214.png"), embers = seq("embers", "embers_0000.png");
log("sequences " + aura.duration + " / " + ripple.duration + " / " + embers.duration);

// ============ SCENE (full 4K resolution) ============
log("A");
var S = proj.items.addComp("Scene 4K — graded footage + card magic", 2160, 3840, 1, DUR, FPS);
log("B");
var V = S.layers.add(foot); V.name = "IMG_7061 — time remapped"; V.audioEnabled = false;
V.timeRemapEnabled = true; log("C");
var tr = V.property("ADBE Time Remapping");
keys(tr, [[0, 0.6], [f(54), 4.2], [f(151), 9.4], [DUR, 17.6]]);
log("D"); linearAll(tr);
V.outPoint = DUR;
log("remap: T7.1333 -> " + tr.valueAtTime(REVEAL, false) + "  T9.1333 -> " + tr.valueAtTime(READ, false));

// Enhancement + grade (Lumetri) on the footage itself
var L = V.property("Effects").addProperty("ADBE Lumetri"); L.name = "Lumetri — correction & grade";
setm(L, "ADBE Lumetri-0007", -6);   // temperature: tame the orange cast a touch
setm(L, "ADBE Lumetri-0008", 3);    // tint: hint of plum
setm(L, "ADBE Lumetri-0011", -0.12);// exposure
setm(L, "ADBE Lumetri-0012", 12);   // contrast
setm(L, "ADBE Lumetri-0013", -34);  // highlights (candles, card border)
setm(L, "ADBE Lumetri-0014", 8);    // shadows (lift detail in the cloth)
setm(L, "ADBE Lumetri-0015", -14);  // whites
setm(L, "ADBE Lumetri-0016", -8);   // blacks
setm(L, "ADBE Lumetri-0020", 95);   // saturation (the red cloth is close to clipping)
setm(L, "ADBE Lumetri-0029", 14);   // sharpen at 4K, before the 50% downscale
setm(L, "ADBE Lumetri-0030", 10);   // vibrance
setm(L, "ADBE Lumetri-0052", 42);   // vignette midpoint
setm(L, "ADBE Lumetri-0054", 70);   // vignette feather
try {
  var vg = L.property("ADBE Lumetri-0051");
  keys(vg, [[0, -0.9], [f(165), -0.9], [f(205), -1.7], [REVEAL + 0.3, -1.0], [DUR, -1.0]]);
  easeAll(vg, 60, 60);
} catch (e) { log("vignette: " + e); }

function overlay(item, startFrame, name, mode, opac) {
  var O = S.layers.add(item); O.name = name;
  O.startTime = f(startFrame); O.inPoint = f(startFrame); O.outPoint = Math.min(DUR, f(startFrame) + item.duration);
  O.property("Scale").setValue([200, 200]); O.blendingMode = mode;
  if (opac != null) O.property("Opacity").setValue(opac);
  return O;
}
overlay(aura, 196, "Card aura — rose gold (tracked)", BlendingMode.SCREEN, 100);
overlay(ripple, 214, "Reveal ripple — card-shaped light ring", BlendingMode.ADD, 100);
log("scene ok");

// ============ REEL (1080x1920) ============
var R = proj.items.addComp("Tarotoverse — Universe Love Message 01", W, H, 1, DUR, FPS);
log("m0");
var SL = R.layers.add(S); SL.name = "Scene";
// scale about the card's centre so the push-in travels toward it
SL.property("Anchor Point").setValue([972, 1920]); SL.property("Position").setValue([486, 960]);
var sc = SL.property("Scale");
log("m1");
keys(sc, [[0, [53, 53]], [f(151), [50, 50]], [f(180), [50, 50]], [DUR, [51.5, 51.5]]]);
easeAll(sc, 40, 40);

log("m2");
var E = R.layers.add(embers); E.name = "Candle embers"; E.blendingMode = BlendingMode.ADD; E.startTime = 0; E.outPoint = Math.min(DUR, embers.duration);

// ---- typography helpers
var SERIF = "BodoniSvtyTwoITCTT-Bold", SANS = "AvenirNext-DemiBold";
var IVORY = "FFF6EA", CHAMP = "F3D7AE", PLUM = "1A0B1E";
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
  var ds = T.property("Effects").addProperty("ADBE Drop Shadow");
  setn(ds, "Shadow Color", [0.05, 0.02, 0.06]); setn(ds, "Opacity", 160); setn(ds, "Distance", 2); setn(ds, "Softness", 18); setn(ds, "Direction", 180);
  var tv = T.property("Source Text").value; log(name + ": box " + Math.round(r.width) + "x" + Math.round(r.height) + " font " + tv.font + " size " + tv.fontSize);
  return T;
}
function panel(name, t0, t1, cy) {
  log("p0"); var P = R.layers.addShape(); P.name = name; log("p1");
  var g = P.property("Contents").addProperty("ADBE Vector Group");
  var rc = g.property("Contents").addProperty("ADBE Vector Shape - Rect");
  log("p2"); rc.property("Roundness").setValue(38); log("p3");
  var st = g.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
  st.property("Color").setValue(rgb("E9C99A")); st.property("Stroke Width").setValue(2); st.property("Opacity").setValue(38);
  var fl = g.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  log("p4"); fl.property("Color").setValue(rgb(PLUM)); fl.property("Opacity").setValue(100); log("p5");
  P.property("Position").setValue([W / 2, cy]); P.inPoint = t0; P.outPoint = t1;
  log("p6"); var sh = P.property("Effects").addProperty("ADBE Drop Shadow"); log("p7");
  setn(sh, "Shadow Color", [0, 0, 0]); log("p8"); setn(sh, "Opacity", 90); log("p9"); setn(sh, "Distance", 0); setn(sh, "Softness", 60); log("p10");
  return { layer: P, size: P.property("Contents").property(1).property("Contents").property("ADBE Vector Shape - Rect").property("Size") };
}
function fadeOutBlur(T, a, b) {
  keys(T.property("Opacity"), [[a, 100], [b, 0]]);
  var gb = T.property("Effects").addProperty("ADBE Gaussian Blur 2");
  try { keys(gb.property(1), [[a, 0], [b, 14]]); } catch (e) { log("blur " + e); }
}
function wordReveal(T, a, b, basedOn, rise, blurAmt) {
  var an = T.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
  var pr = an.property("ADBE Text Animator Properties");
  pr.addProperty("ADBE Text Opacity").setValue(0);
  pr.addProperty("ADBE Text Position 3D").setValue([0, rise, 0]);
  if (blurAmt) pr.addProperty("ADBE Text Blur").setValue([blurAmt, blurAmt]);
  var sel = an.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
  try { sel.property("ADBE Text Range Advanced").property("ADBE Text Range Type2").setValue(basedOn); } catch (e) { log("basedOn " + e); }
  try { sel.property("ADBE Text Range Advanced").property("ADBE Text Levels Max Ease").setValue(60); } catch (e) {}
  keys(sel.property("ADBE Text Percent Start"), [[a, 0], [b, 100]]); easeAll(sel.property("ADBE Text Percent Start"), 30, 70);
}

// ---- HOOK SEQUENCE: one plum panel that reshapes for each line (centre y 902)
log("m3");
var HY = 912;
var hp = panel("Hook panel (morphs)", 0, f(176), HY);
log("h1"); keys(hp.size, [[0, [580, 250]], [f(30), [580, 250]], [f(38), [640, 340]], [f(76), [640, 340]], [f(85), [720, 460]]]);
log("h2"); easeAll(hp.size, 70, 70); log("h3");
keys(hp.layer.property("Opacity"), [[0, 84], [f(167), 84], [f(176), 0]]);
keys(hp.layer.property("Scale"), [[0, [97, 97]], [f(7), [100, 100]]]); easeAll(hp.layer.property("Scale"), 30, 80);

// TEXT 1 — "wait!!" (frames 0-32): readable within 2 frames, settles with a soft impact
log("m4");
var t1 = makeText("TEXT 1 — wait!!", "wait!!", SERIF, 190, IVORY, W / 2, HY, 0, f(32), 10, 0);
keys(t1.property("Scale"), [[0, [110, 110]], [f(8), [100, 100]]]); easeAll(t1.property("Scale"), 20, 85);
keys(t1.property("Opacity"), [[0, 80], [f(2), 100]]);
fadeOutBlur(t1, f(28), f(32));

// TEXT 2 — "you need to see this" (frames 30-78), word-by-word rise
log("m5");
var t2 = makeText("TEXT 2 — you need to see this", "you need\rto see this", SERIF, 124, IVORY, W / 2, HY, f(30), f(78), 0, 138);
wordReveal(t2, f(30), f(40), 3, 34, 8);
fadeOutBlur(t2, f(74), f(78));

// TEXT 3 — the hero message (frames 76-175), line-by-line, "love life" in champagne
log("m6");
var t3 = makeText("TEXT 3 — Universe has a message for your love life", "Universe has\ra message for\ryour love life", SERIF, 104, IVORY, W / 2, HY, f(76), f(175), 0, 122);
try {
  var td3 = t3.property("Source Text").value; var s3 = td3.text; var i3 = s3.indexOf("love life");
  td3.characterRange(i3, i3 + 9).fillColor = rgb(CHAMP);
  t3.property("Source Text").setValue(td3); log("love life tinted");
} catch (e) { log("charRange: " + e); }
wordReveal(t3, f(76), f(90), 4, 28, 6);
var sw = t3.property("Effects").addProperty("CC Light Sweep");
try { keys(sw.property("Center"), [[f(100), [-260, 120]], [f(128), [1300, 120]]]); } catch (e) { log("sweep " + e); }
setn(sw, "Direction", -28); setn(sw, "Width", 70); setn(sw, "Sweep Intensity", 55); setn(sw, "Edge Intensity", 0);
setn(sw, "Light Color", rgb("FFE2C4")); setn(sw, "Light Reception", 1);
fadeOutBlur(t3, f(168), f(175));

// ---- REVEAL BLOCK — above the card (card top ~ y 550 after the push-in)
log("m7");
var RY = 388;
var rp = panel("Reveal panel", f(274), DUR, RY);
keys(rp.size, [[f(274), [790, 270]], [f(284), [820, 300]]]); easeAll(rp.size, 60, 80);
keys(rp.layer.property("Opacity"), [[f(274), 72], [f(279), 84]]);

// TEXT 4 — "Read Caption" appears at frame 274 = exactly 2.000 s after the reveal frame (214)
log("m8");
var t4 = makeText("TEXT 4 — Read Caption", "Read Caption", SERIF, 118, IVORY, W / 2, 345, f(274), DUR, 6, 0);
// visible from its very first frame (274): a short focus-pull + settle, never an invisible phase
keys(t4.property("Scale"), [[f(274), [106, 106]], [f(284), [100, 100]]]); easeAll(t4.property("Scale"), 20, 85);
var fb = t4.property("Effects").addProperty("ADBE Gaussian Blur 2");
try { keys(t4.property("Effects").property(2).property(1), [[f(274), 5], [f(281), 0]]); } catch (e) { log("rc blur " + e); }
var rsw = t4.property("Effects").addProperty("CC Light Sweep");
try { keys(t4.property("Effects").property(3).property("Center"), [[f(286), [-200, 60]], [f(312), [1300, 60]]]); } catch (e) { log("rc sweep " + e); }
setn(t4.property("Effects").property(3), "Direction", -25); setn(t4.property("Effects").property(3), "Width", 55);
setn(t4.property("Effects").property(3), "Sweep Intensity", 50); setn(t4.property("Effects").property(3), "Edge Intensity", 0);
setn(t4.property("Effects").property(3), "Light Color", rgb("FFE2C4")); setn(t4.property("Effects").property(3), "Light Reception", 1);

// TEXT 5 — CTA
log("m9");
var t5 = makeText("TEXT 5 — DM for Personal Tarot Reading", "DM for Personal Tarot Reading", SANS, 46, CHAMP, W / 2, 462, f(292), DUR, 30, 0);
keys(t5.property("Opacity"), [[f(292), 0], [f(304), 100]]);
var p5 = t5.property("Position").value; keys(t5.property("Position"), [[f(292), [p5[0], p5[1] + 14]], [f(304), p5]]); easeAll(t5.property("Position"), 30, 80);

// BRANDING — @tarotoverse, discreet, whole Reel
log("m10");
var wm = makeText("Watermark — @tarotoverse", "@tarotoverse", SANS, 32, IVORY, W / 2, 206, 0, DUR, 60, 0);
wm.property("Opacity").setValue(82);

// stacking: embers above scene, panels below their text
// (creation order already stacks: Scene < embers < hook panel < hooks < reveal panel < reveal text < CTA < watermark)
log("layers: " + R.numLayers);

proj.save(new File(ROOT + "/Tarotoverse_Universe_Love_Message_01.aep"));
log("saved");

// QC stills straight from the comp
var qc = [0, 1, 2, 10, 31, 34, 45, 77, 84, 95, 130, 172, 190, 205, 214, 220, 230, 273, 274, 280, 290, 310, 396];
var sd = new Folder(ROOT + "/qc"); if (!sd.exists) sd.create();
for (var q = 0; q < qc.length; q++) R.saveFrameToPng(f(qc[q]), new File(ROOT + "/qc/f" + ("00" + qc[q]).slice(-3) + ".png"));
log("stills queued");
} catch (e) { log("ERROR line " + e.line + ": " + e); }
app.endSuppressDialogs(false);
})();
