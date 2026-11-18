// COLOR GRADE adjustment layer on the active comp using Lumetri (native).
// ARGS: {look:"natural"|"warm-cinematic"|"mystic-night"|"teal-gold"|"soft-luxe", strength=1}
// Conservative starting points: always check skin tones and adjust by eye.
app.beginUndoGroup("TV Grade");
var c=activeComp(); if(!c) throw "Open/select a composition first";
var LOOKS={
 "natural":        {e:0,   con:8,  hi:-12, sh:8,  wh:0,  bl:-4, temp:0,  tint:0, vib:10, sat:100, fade:0,  vig:-0.6},
 "warm-cinematic": {e:-0.1,con:14, hi:-20, sh:6,  wh:-5, bl:-8, temp:8,  tint:2, vib:12, sat:96,  fade:6,  vig:-1.2},
 "mystic-night":   {e:-0.2,con:12, hi:-18, sh:-4, wh:-8, bl:-10,temp:-9, tint:5, vib:8,  sat:90,  fade:8,  vig:-1.8},
 "teal-gold":      {e:0,   con:16, hi:-15, sh:4,  wh:-4, bl:-8, temp:4,  tint:-2,vib:14, sat:95,  fade:4,  vig:-1.0},
 "soft-luxe":      {e:0.05,con:-4, hi:-25, sh:12, wh:-6, bl:6,  temp:5,  tint:3, vib:6,  sat:94,  fade:12, vig:-0.8}};
var name=ARGS.look||"natural", k=ARGS.strength==null?1:ARGS.strength, v=LOOKS[name]; if(!v) throw "Unknown look "+name;
var L=c.layers.addSolid([0,0,0],"Grade: "+name,c.width,c.height,1,c.duration); L.adjustmentLayer=true; L.label=9;
var lu=L.property("Effects").addProperty("ADBE Lumetri");
function s(id,val){ try{ lu.property("ADBE Lumetri-"+id).setValue(val); }catch(e){ report("  ! lumetri "+id+": "+e); } }
s("0011",v.e*k); s("0012",v.con*k); s("0013",v.hi*k); s("0014",v.sh*k); s("0015",v.wh*k); s("0016",v.bl*k);
s("0007",v.temp*k); s("0008",v.tint*k); s("0030",v.vib*k); s("0020",100+(v.sat-100)*k); s("0028",v.fade*k);
s("0051",v.vig*k); s("0052",55); s("0054",70);
// move just under any text/FX layers: place above the lowest footage layer stack top
L.moveToBeginning(); for (var i=2;i<=c.numLayers;i++){ var x=c.layer(i); if (x instanceof TextLayer || x.guideLayer || /^FX /.test(x.name)) L.moveAfter(x); }
app.endUndoGroup(); report("Added Lumetri look '"+name+"' strength "+k+" (adjustment layer, fully editable in Effect Controls)");
