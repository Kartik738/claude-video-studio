// ASPECT VARIANTS: wraps the active (master) comp into 1:1, 4:5, 16:9 (and/or 9:16) comps.
// Content is fitted (not blindly cropped) with a blurred fill background; text stays editable in the master.
// Review framing of each variant by eye. ARGS: {ratios:["1:1","4:5","16:9","9:16"], long:1080}
app.beginUndoGroup("TV Aspect Variants");
var m=activeComp(); if(!m) throw "Select the master comp";
var R=ARGS.ratios||["1:1","4:5","16:9"], LONG=ARGS.long||1080, made=[];
for (var i=0;i<R.length;i++){ var p=R[i].split(":"), rw=+p[0], rh=+p[1], w,h;
  if (rw>=rh){ h=LONG; w=Math.round(LONG*rw/rh/2)*2; if(rw===rh) w=h; } else { w=LONG; h=Math.round(LONG*rh/rw/2)*2; }
  var c=app.project.items.addComp(m.name+" ["+R[i]+"]", w, h, 1, m.duration, m.frameRate); c.parentFolder=m.parentFolder;
  var bg=c.layers.add(m); bg.name="Fill (blurred)"; var sc=Math.max(w/m.width,h/m.height)*100; bg.property("Scale").setValue([sc,sc]);
  var bl=bg.property("Effects").addProperty("ADBE Gaussian Blur 2"); setp(bl,"Blurriness",80); setp(bl,"Repeat Edge Pixels",1);
  var bc=bg.property("Effects").addProperty("ADBE Brightness & Contrast 2"); setp(bc,"Brightness",-35);
  var fg=c.layers.add(m); fg.name="Master (fit)"; var fs=Math.min(w/m.width,h/m.height)*100; fg.property("Scale").setValue([fs,fs]);
  made.push(c.name+" "+w+"x"+h); }
app.endUndoGroup(); report("Created: "+made.join(", ")+". Tip: for 16:9, consider re-laying out titles in the master instead of using the fitted version.");
