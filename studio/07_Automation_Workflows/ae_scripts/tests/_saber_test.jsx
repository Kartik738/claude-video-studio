if (app.project.dirty) throw "current project has unsaved changes - stopping";
app.open(new File(ARGS.proj)); var c=findComp("DEMO 1 Cinematic Typography"); c.openInViewer();
var L=null; for (var i=1;i<=c.numLayers;i++) if (c.layer(i).name.indexOf("Title: Tarotoverse")===0) L=c.layer(i);
var s=c.layers.addSolid([0,0,0],"FX Saber on title",c.width,c.height,1,c.duration); s.inPoint=6; s.outPoint=8; s.blendingMode=BlendingMode.ADD;
var sb=s.property("Effects").addProperty("VIDEOCOPILOT LightSaber"); var names=[]; for (var k=1;k<=Math.min(sb.numProperties,40);k++) names.push(sb.property(k).name);
report("Saber params: "+names.join(", "));
try{ sb.property("Core Type").setValue(3); }catch(e){ report("core type: "+e); }  // 3 = Layer Masks? try text layer via Text Layer option
try{ sb.property("Glow Color").setValue(hex("FFD68C")); sb.property("Glow Intensity").setValue(30); }catch(e){ report("glow: "+e); }
app.project.save(); report("saber layer added + saved");
