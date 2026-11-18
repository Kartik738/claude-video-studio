// NEW REEL COMP. ARGS: {name, w=1080, h=1920, fps=30, dur=15, footage:[paths], music:path, fit:"fill"}
// Creates numbered folders, a comp, imports footage in order as a rough sequence, adds a
// safe-zone guide layer (guides never render) and an empty "Grade" adjustment layer.
app.beginUndoGroup("TV New Reel");
var A=ARGS, W=A.w||1080, H=A.h||1920, FPS=A.fps||30, DUR=A.dur||15, NAME=A.name||"Reel";
var p=app.project; function fold(n){ for(var i=1;i<=p.rootFolder.numItems;i++){var it=p.rootFolder.item(i); if(it instanceof FolderItem&&it.name===n) return it;} return p.items.addFolder(n); }
var comp=p.items.addComp(NAME, W, H, 1, DUR, FPS); comp.parentFolder=fold("01 Comps");
var t=0, files=A.footage||[];
for (var i=0;i<files.length;i++){ var f=new File(files[i]); if(!f.exists){ report("  ! missing "+files[i]); continue; }
  var it=p.importFile(new ImportOptions(f)); it.parentFolder=fold("03 Footage");
  var L=comp.layers.add(it); L.moveToEnd(); L.startTime=t; 
  var s=Math.max(W/it.width, H/it.height)*100; if(A.fit==="fit") s=Math.min(W/it.width,H/it.height)*100; L.property("Scale").setValue([s,s]);
  if (L.hasAudio && A.muteOriginal) L.audioEnabled=false;
  t += it.duration>0? it.duration : 3; report("  + "+it.name+" "+it.width+"x"+it.height+" "+(it.duration||0).toFixed(2)+"s"); }
if (t>0 && !A.dur) comp.duration=Math.min(t, 180);
if (A.music){ var mf=new File(A.music); if(mf.exists){ var mi=p.importFile(new ImportOptions(mf)); mi.parentFolder=fold("04 Audio"); var ML=comp.layers.add(mi); ML.name="Music"; ML.moveToEnd(); } }
var G=comp.layers.addSolid([0,0,0],"Grade",W,H,1,comp.duration); G.adjustmentLayer=true; G.moveToBeginning(); G.label=9;
// Safe zone guide: Instagram/Facebook Reels & Shorts UI covers roughly top 14%, bottom 20%, right 12%.
var Z=comp.layers.addShape(); Z.name="SAFE ZONE (guide - not rendered)"; Z.guideLayer=true; Z.label=1;
var g=Z.property("Contents").addProperty("ADBE Vector Group"), r=g.property("Contents").addProperty("ADBE Vector Shape - Rect");
var top=H*0.14, bot=H*0.20, right=W*0.12, left=W*0.06;
r.property("Size").setValue([W-left-right, H-top-bot]); g.property("Transform").property("Position").setValue([(left-right)/2,(top-bot)/2]);
var st=g.property("Contents").addProperty("ADBE Vector Graphic - Stroke"); st.property("Color").setValue([1,0.2,0.2]); st.property("Stroke Width").setValue(4);
Z.property("Position").setValue([W/2,H/2]); Z.moveToBeginning();
comp.openInViewer();
app.endUndoGroup(); report("Created comp '"+NAME+"' "+W+"x"+H+" "+FPS+"fps "+comp.duration.toFixed(2)+"s with "+files.length+" clip(s). Red box = safe area for text.");
