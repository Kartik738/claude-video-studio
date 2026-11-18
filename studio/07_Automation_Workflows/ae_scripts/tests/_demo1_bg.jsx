// Demo 1 background: new 1080x1920 8s comp with a dark gradient (Gradient Ramp) for typography
var c=app.project.items.addComp("DEMO 1 Cinematic Typography",1080,1920,1,8,30);
var bg=c.layers.addSolid([0,0,0],"BG Gradient",1080,1920,1,8); var gr=bg.property("Effects").addProperty("ADBE Ramp");
setp(gr,"Start of Ramp",[540,0]); setp(gr,"Start Color",hex("1B1530")); setp(gr,"End of Ramp",[540,1920]); setp(gr,"End Color",hex("05040A")); setp(gr,"Ramp Shape",2);
c.openInViewer(); report("demo1 comp ready");
