// MAGICAL FX on the active comp, built only from AE's own effects (no plugins needed).
// ARGS: {fx:"motes"|"mist"|"aura"|"sweep"|"stars"|"saber"(needs Saber plugin; target:"Title: ..."), t=0, dur=comp, color:"FFD68C", amount=1 (0.3 subtle .. 1.5 strong), x=0.5, y=0.5}
app.beginUndoGroup("TV Magic FX");
var c=activeComp(); if(!c) throw "Open/select a composition first";
var A=ARGS, kind=A.fx||"motes", T=A.t||0, D=A.dur||(c.duration-T), K=(A.amount==null?1:A.amount), col=hex(A.color||"FFD68C");
var cx=c.width*(A.x==null?0.5:A.x), cy=c.height*(A.y==null?0.5:A.y);
function solid(n, adj){ var s=c.layers.addSolid([0,0,0], n, c.width, c.height, 1, c.duration); s.inPoint=T; s.outPoint=T+D; if(adj) s.adjustmentLayer=true; s.label=11; return s; }
function fadeInOut(L, a){ var o=L.property("Opacity"); var top=Math.min(100,100*Math.min(1,K)); o.setValueAtTime(T,0); o.setValueAtTime(T+a,top); o.setValueAtTime(T+D-a,top); o.setValueAtTime(T+D,0); easeAll(o,70); }
var L;
if (kind==="motes"){ // drifting luminous particles
  L=solid("FX Light Motes"); L.blendingMode=BlendingMode.ADD; var pw=L.property("Effects").addProperty("CC Particle World");
  // CC Particle World groups are flat: set every property directly on the effect
  setp(pw,"Birth Rate",0.6*K); setp(pw,"Longevity (sec)",4);
  setp(pw,"Radius X",0.6); setp(pw,"Radius Y",0.9); setp(pw,"Radius Z",0.4);
  setp(pw,"Animation",1); setp(pw,"Velocity",0.12); setp(pw,"Gravity",-0.03); setp(pw,"Extra",0.4);
  setp(pw,"Particle Type",1); setp(pw,"Birth Size",0.08); setp(pw,"Death Size",0.02); setp(pw,"Max Opacity",80);
  setp(pw,"Birth Color",col); setp(pw,"Death Color",col); setp(pw,"Grid",0); setp(pw,"Horizon",0); setp(pw,"Axis Box",0);
  var gl=L.property("Effects").addProperty("ADBE Glo2"); setp(gl,"Glow Radius",25); setp(gl,"Glow Intensity",1.2);
  fadeInOut(L, 0.8);
} else if (kind==="mist"){ // slow atmospheric haze
  L=solid("FX Mist"); L.blendingMode=BlendingMode.SCREEN; var fn=L.property("Effects").addProperty("ADBE Fractal Noise");
  setp(fn,"Fractal Type",8); setp(fn,"Contrast",110); setp(fn,"Brightness",-45); setp(fn,"Complexity",3);
  try{ fn.property("Transform").property("Uniform Scaling").setValue(1); fn.property("Transform").property("Scale").setValue(600); }catch(e){}
  fn.property("Evolution").expression="time*18"; try{ fn.property("Transform").property("Offset Turbulence").expression="value+[time*12, -time*6]"; }catch(e){}
  var bl=L.property("Effects").addProperty("ADBE Gaussian Blur 2"); setp(bl,"Blurriness",60);
  var tint=L.property("Effects").addProperty("ADBE Tint"); setp(tint,"Map White To",col); setp(tint,"Map Black To",[0,0,0]);
  var m2=L.property("Masks").addProperty("Mask"); var r2=new Shape(); r2.vertices=[[0,c.height*0.45],[c.width,c.height*0.45],[c.width,c.height],[0,c.height]]; r2.closed=true; m2.property("Mask Path").setValue(r2); m2.property("Mask Feather").setValue([0,400]);
  fadeInOut(L,1.2); L.property("Opacity").expression="value*0.3";
} else if (kind==="aura"){ // soft glow bloom centred on a point (e.g. the tarot card)
  L=solid("FX Aura", true); var m=L.property("Masks").addProperty("Mask"); var sh=new Shape(), rx=c.width*0.32, ry=c.height*0.24, k=0.5523;
  sh.vertices=[[cx,cy-ry],[cx+rx,cy],[cx,cy+ry],[cx-rx,cy]]; sh.inTangents=[[-rx*k,0],[0,-ry*k],[rx*k,0],[0,ry*k]]; sh.outTangents=[[rx*k,0],[0,ry*k],[-rx*k,0],[0,-ry*k]]; sh.closed=true;
  m.property("Mask Path").setValue(sh); m.property("Mask Feather").setValue([180,180]);
  var g2=L.property("Effects").addProperty("ADBE Glo2"); setp(g2,"Glow Threshold",78); setp(g2,"Glow Radius",140); setp(g2,"Glow Intensity",0.35*K);
  setp(g2,"Glow Colors",2); setp(g2,"Color A",col); setp(g2,"Color B",[1,1,1]);
  var pulse=g2.property("Glow Intensity"); pulse.expression="value*(0.85+0.15*Math.sin(time*2.2))";
  fadeInOut(L,0.6);
} else if (kind==="sweep"){ // light sweep across the frame (good for text/card reveal)
  L=solid("FX Light Sweep", true); var ls=L.property("Effects").addProperty("CC Light Sweep");
  setp(ls,"Width",70); setp(ls,"Sweep Intensity",22*K); setp(ls,"Edge Intensity",30); setp(ls,"Light Color",col); setp(ls,"Direction",-25);
  var ce=ls.property("Center"); ce.setValueAtTime(T,[-c.width*0.3,cy]); ce.setValueAtTime(T+Math.min(D,1.6),[c.width*1.3,cy]); easeAll(ce,60);
} else if (kind==="stars"){ // twinkling sparkles
  L=solid("FX Star Twinkle"); L.blendingMode=BlendingMode.ADD; var sb=L.property("Effects").addProperty("CC Star Burst");
  setp(sb,"Scatter",100); setp(sb,"Speed",0.05); setp(sb,"Grid Spacing",22); setp(sb,"Size",Math.max(20,Math.round(30*K))); setp(sb,"Blend w. Original",0);
  var tn=L.property("Effects").addProperty("ADBE Tint"); setp(tn,"Map White To",col);
  var g3=L.property("Effects").addProperty("ADBE Glo2"); setp(g3,"Glow Radius",15);
  L.property("Opacity").expression="var b=(Math.sin(time*3)+1)/2; value*(0.6+0.4*b)"; fadeInOut(L,0.8);
} else if (kind==="saber"){ // Video Copilot Saber glow on a text layer (needs Saber installed). ARGS.target = text layer name (start of name is enough)
  var tgt=null; for (var i=1;i<=c.numLayers;i++) if (c.layer(i).name.indexOf(A.target||"Title:")===0){ tgt=c.layer(i); break; }
  if (!tgt) throw "saber: no layer named "+(A.target||"Title:...");
  L=solid("FX Saber Glow"); L.blendingMode=BlendingMode.ADD; var sbr=L.property("Effects").addProperty("VIDEOCOPILOT LightSaber");
  setp(sbr,"Core Type",3); setp(sbr,"Text Layer",tgt.index); setp(sbr,"Glow Color",col); setp(sbr,"Glow Intensity",18*K); setp(sbr,"Core Size",1.2);
  fadeInOut(L,0.5);
} else throw "Unknown fx: "+kind;
L.moveToBeginning();
app.endUndoGroup(); report("Added "+kind+" ("+L.name+") "+T+"s→"+(T+D).toFixed(2)+"s amount "+K+" colour "+(A.color||"FFD68C"));
