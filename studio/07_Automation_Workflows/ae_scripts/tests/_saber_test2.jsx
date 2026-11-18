var c=findComp("DEMO 1 Cinematic Typography"), L=null, S=null; for (var i=1;i<=c.numLayers;i++){ var n=c.layer(i).name; if (n.indexOf("Title: Tarotoverse")===0) L=c.layer(i); if (n==="FX Saber on title") S=c.layer(i); }
var sb=S.property("Effects").property(1); var ct=sb.property("Core Type"); report("core type now "+ct.value);
sb.property("Text Layer").setValue(L.index); sb.property("Glow Intensity").setValue(18); sb.property("Core Size").setValue(1.2);
var r=c.saveFrameToPng(7.2, new File(ARGS.out)); try{ r.wait(); }catch(e){} app.project.save(); report("frame saved");
