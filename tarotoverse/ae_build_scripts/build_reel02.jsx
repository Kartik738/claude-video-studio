// Tarotoverse — Magical Reel 02 (After Effects build). Run inside AE 2027.
// Builds the comp from the raw footage, saves the project, queues an H.264-friendly render.
(function () {
var ROOT = "~/Claude AI/tarotoverse/ae";
var SRC = "~/Downloads/IMG_8295.MOV";
var FX = "~/Library/Containers/com.burbn.basel.mac/Data/Documents/fx/MagicalReel02";
var W = 1080, H = 1920, FPS = 30, DUR = 11.2;
var logF = new File(ROOT + "/build_log.txt"); logF.open("w"); logF.close();
function log(s) { logF.open("a"); logF.write(s + " || "); logF.close(); }
function rgb(hex) { return [parseInt(hex.substr(0,2),16)/255, parseInt(hex.substr(2,2),16)/255, parseInt(hex.substr(4,2),16)/255]; }
function setp(fx, name, val) { try { fx.property(name).setValue(val); } catch (e) { log("  ! " + fx.name + "." + name + ": " + e); } }
function keys(prop, arr) { for (var i = 0; i < arr.length; i++) prop.setValueAtTime(arr[i][0], arr[i][1]); }
function ease(prop) { for (var k = 1; k <= prop.numKeys; k++) { try { var e = new KeyframeEase(0, 60); prop.setTemporalEaseAtKey(k, prop.value instanceof Array ? (prop.value.length==3?[e,e,e]:[e,e]) : [e], prop.value instanceof Array ? (prop.value.length==3?[e,e,e]:[e,e]) : [e]); } catch (x) {} } }

try {
app.beginSuppressDialogs();
log("start " + app.version);
try { if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES); } catch (c) { log("close: " + c); }
app.newProject();
log("new project");
var proj = app.project;
var foot = proj.importFile(new ImportOptions(new File(SRC)));
log("footage " + foot.width + "x" + foot.height + " dur " + foot.duration + " fps " + foot.frameRate);
var comp = proj.items.addComp("Tarotoverse Reel 02", W, H, 1, DUR, FPS);
var base = W / foot.width * 100;

// ---- footage: browse at 1.5x, then real time (matches the Edits timeline exactly)
var A = comp.layers.add(foot);
A.stretch = 100 / 1.5; A.startTime = -3.0 / 1.5; A.inPoint = 0; A.outPoint = 4.2;
A.audioEnabled = false; A.name = "Browse 1.5x";
keys(A.property("Scale"), [[0, [base*1.08, base*1.08]], [0.9, [base, base]]]); ease(A.property("Scale"));
var B = comp.layers.add(foot);
B.startTime = -5.1; B.inPoint = 4.2; B.outPoint = DUR;
B.audioEnabled = false; B.name = "Pull, flip, hold";
B.property("Scale").setValue([base, base]);
keys(B.property("Scale"), [[5.6, [base, base]], [DUR, [base*1.05, base*1.05]]]);
log("footage layers ok, base scale " + base);

// ---- grade (adjustment layer over the footage)
var G = comp.layers.addSolid([0,0,0], "Grade", W, H, 1, DUR); G.adjustmentLayer = true;
var fx = G.property("Effects");
if (fx.canAddProperty("ADBE Exposure2")) {
  var ex = fx.addProperty("ADBE Exposure2"); var s2 = []; for (var k = 1; k <= ex.numProperties; k++) s2.push(ex.property(k).name);
  log("exposure props: " + s2.join(","));
  setp(ex, "Exposure", -0.12); setp(ex, "Gamma Correction", 0.97);
} else log("no exposure effect");
var bc = fx.addProperty("ADBE Brightness & Contrast 2");
setp(bc, "Brightness", -6); setp(bc, "Contrast", 9);
var pf = fx.addProperty("ADBE Photo Filter");
setp(pf, "Filter", 2); setp(pf, "Color", rgb("6E8CFF")); setp(pf, "Density", 9); setp(pf, "Preserve Luminosity", 1);
var vb = fx.addProperty("ADBE Vibrance");
setp(vb, "Vibrance", 12); setp(vb, "Saturation", -4);
var vg = fx.addProperty("CC Vignette");
setp(vg, "Amount", 38);
log("grade ok");

// ---- reveal bloom (card only)
var BL = comp.layers.addSolid([0,0,0], "Reveal bloom", W, H, 1, DUR); BL.adjustmentLayer = true;
BL.inPoint = 5.35; BL.outPoint = 7.4;
var m = BL.property("Masks").addProperty("Mask"); var sh1 = new Shape();
sh1.vertices = [[120,700],[780,700],[780,1730],[120,1730]]; sh1.closed = true;
m.property("Mask Path").setValue(sh1); m.property("Mask Feather").setValue([60,60]);
var gl = BL.property("Effects").addProperty("ADBE Glo2");
setp(gl, "Glow Threshold", 90); setp(gl, "Glow Radius", 45);
keys(gl.property("Glow Intensity"), [[5.45, 0], [5.8, 0.22], [6.4, 0.08], [7.0, 0]]);
setp(gl, "Glow Colors", 2); // A & B colours
setp(gl, "Color A", rgb("FFFFFF")); setp(gl, "Color B", rgb("BFD0FF"));
log("bloom ok");

// ---- silver light sweep across the card
var SW = comp.layers.addSolid([0,0,0], "Card light sweep", W, H, 1, DUR); SW.adjustmentLayer = true;
SW.inPoint = 6.0; SW.outPoint = 7.3;
var m2 = SW.property("Masks").addProperty("Mask"); var sh2 = new Shape();
sh2.vertices = [[140,720],[760,720],[760,1720],[140,1720]]; sh2.closed = true;
m2.property("Mask Path").setValue(sh2); m2.property("Mask Feather").setValue([8,8]);
var ls = SW.property("Effects").addProperty("CC Light Sweep");
keys(ls.property("Center"), [[6.05, [-120, 760]], [7.2, [1100, 1720]]]);
setp(ls, "Direction", -38); setp(ls, "Width", 110); setp(ls, "Sweep Intensity", 45);
setp(ls, "Edge Intensity", 0); setp(ls, "Light Color", rgb("E4ECFF"));
log("sweep ok");

// ---- custom overlays made earlier for this exact timeline (halo + dust)
var halo = [["halo_00",5.40,5.50],["halo_01",5.50,5.60],["halo_02",5.60,5.70],["halo_03",5.70,5.8333],["halo_04",5.8333,6.00],["halo_05",6.00,6.30],["halo_06",6.30,6.80],["halo_07",6.80,7.60],["halo_08",7.60,8.40],["halo_09",8.40,9.80],["halo_10",9.80,11.20]];
var dust = []; for (var d = 0; d < 20; d++) dust.push([("dust_" + (d<10?"0":"") + d), 1.2 + d*0.2, 1.4 + d*0.2]);
function place(list, label) {
  for (var i = 0; i < list.length; i++) {
    var it = proj.importFile(new ImportOptions(new File(FX + "/" + list[i][0] + ".png")));
    var L = comp.layers.add(it); L.startTime = list[i][1]; L.inPoint = list[i][1]; L.outPoint = list[i][2];
    L.blendingMode = BlendingMode.SCREEN; L.name = label + " " + list[i][0];
  }
}
place(halo, "Halo"); place(dust, "Dust");
log("overlays ok");

// ---- typography helpers
function panel(name, cy, w, h, t0, t1, fadeIn) {
  var S = comp.layers.addShape(); S.name = name;
  var g = S.property("Contents").addProperty("ADBE Vector Group");
  var r = g.property("Contents").addProperty("ADBE Vector Shape - Rect");
  r.property("Size").setValue([w, h]); r.property("Roundness").setValue(60);
  var f = g.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  f.property("Color").setValue(rgb("0B1233"));
  S.property("Position").setValue([W/2, cy]);
  S.inPoint = t0; S.outPoint = t1;
  if (fadeIn) keys(S.property("Opacity"), [[t0, 0], [t0 + 0.3, 55]]); else S.property("Opacity").setValue(55);
  return S;
}
function text(name, str, font, size, hex, cy, t0, t1, tracking, lead) {
  var T = comp.layers.addText(str); T.name = name;
  var sp = T.property("Source Text"); var td = sp.value;
  td.resetCharStyle(); td.font = font; td.fontSize = size; td.fillColor = rgb(hex); td.applyFill = true; td.applyStroke = false;
  td.justification = ParagraphJustification.CENTER_JUSTIFY; td.tracking = tracking || 0;
  if (lead) { td.autoLeading = false; td.leading = lead; }
  sp.setValue(td);
  T.inPoint = t0; T.outPoint = t1;
  var r = T.sourceRectAtTime(t0, false);
  T.property("Anchor Point").setValue([r.left + r.width/2, r.top + r.height/2]);
  T.property("Position").setValue([W/2, cy]);
  var ds = T.property("Effects").addProperty("ADBE Drop Shadow");
  setp(ds, "Opacity", 150); setp(ds, "Distance", 3); setp(ds, "Softness", 14); setp(ds, "Direction", 180);
  log(name + " box " + Math.round(r.width) + "x" + Math.round(r.height) + " font " + T.property("Source Text").value.font);
  return T;
}

// Hook — readable within ~0.3 s; gentle tracking settle
panel("Hook panel", 540, 970, 540, 0, 4.6, false);
var hook = text("Hook", "What's coming\rnext between\ryou and them ?", "Baskerville-SemiBold", 100, "FFF8EC", 540, 0, 4.6, 0, 128);
var an = hook.property("Text").property("Animators").addProperty("ADBE Text Animator");
an.property("Properties").addProperty("ADBE Text Tracking Amount");
keys(an.property("Properties").property("ADBE Text Tracking Amount"), [[0, 14], [0.35, 0]]); ease(an.property("Properties").property("ADBE Text Tracking Amount"));
keys(hook.property("Opacity"), [[0, 55], [0.2, 100], [4.35, 100], [4.6, 0]]);
// fade the hook panel out with the text
var hp = comp.layer("Hook panel"); keys(hp.property("Opacity"), [[4.35, 55], [4.6, 0]]);

// Reveal block — Read Caption at exactly 7.600 s (reveal 5.600 s + 2.000 s)
panel("Reveal panel", 466, 940, 320, 7.6, DUR, true);
var rc = text("Read Caption", "Read Caption", "Baskerville-SemiBold", 94, "FFF8EC", 400, 7.6, DUR, 10);
keys(rc.property("Opacity"), [[7.6, 0], [8.05, 100]]);
var p0 = rc.property("Position").value; keys(rc.property("Position"), [[7.6, [p0[0], p0[1] + 18]], [8.05, p0]]); ease(rc.property("Position"));
var tls = rc.property("Effects").addProperty("CC Light Sweep");
keys(tls.property("Center"), [[7.75, [-200, 400]], [8.6, [1250, 400]]]);
setp(tls, "Direction", -25); setp(tls, "Width", 60); setp(tls, "Sweep Intensity", 70); setp(tls, "Edge Intensity", 0);
setp(tls, "Light Color", rgb("E8EEFF")); setp(tls, "Light Reception", 1);
var cta = text("CTA", "DM for Personal Tarot Reading", "AvenirNext-DemiBold", 40, "F3E3BE", 532, 8.4, DUR, 20);
keys(cta.property("Opacity"), [[8.4, 0], [8.8, 100]]);
var wm = text("Watermark", "@tarotoverse", "AvenirNext-DemiBold", 30, "FFF8EC", 222, 0, DUR, 40);
wm.property("Opacity").setValue(82);
log("text ok");

// ---- save + render queue
proj.save(new File(ROOT + "/Tarotoverse_Magical_Reel_02.aep"));
var rq = proj.renderQueue.items.add(comp);
var om = rq.outputModule(1);
log("OM templates: " + om.templates.join(" | "));
log("saved");
} catch (e) { log("ERROR line " + e.line + ": " + e); }
app.endSuppressDialogs(false);
})();
