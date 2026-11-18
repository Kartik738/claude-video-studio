// KINETIC TITLE on the active comp (native AE, no plugins).
// ARGS: {text, style:"rise"|"track"|"words"|"typewriter", t=0, dur=3, font, size=86, color:"F4E7C5", y=0.32, glow:true, tracking}
app.beginUndoGroup("TV Kinetic Title");
var c=activeComp(); if(!c) throw "Open/select a composition first";
var A=ARGS, T=A.t||0, D=A.dur||3, style=A.style||"rise";
var L=c.layers.addText(A.text||"Your Title"); L.name="Title: "+(A.text||"").substr(0,24); L.startTime=0; L.inPoint=T; L.outPoint=T+D;
var td=L.property("Source Text").value; td.resetCharStyle(); td.fontSize=A.size||86; td.fillColor=hex(A.color||"F4E7C5"); td.applyFill=true; td.applyStroke=false;
td.justification=ParagraphJustification.CENTER_JUSTIFY; try{ td.font=A.font||"Baskerville-SemiBold"; }catch(fe){ report("  ! font not available: "+(A.font||"Baskerville-SemiBold")); } if (A.tracking!=null) td.tracking=A.tracking; td.leading=(A.size||86)*1.15;
L.property("Source Text").setValue(td);
var r=L.sourceRectAtTime(T,false); L.property("Anchor Point").setValue([r.left+r.width/2, r.top+r.height/2]);
L.property("Position").setValue([c.width/2, c.height*(A.y||0.32)]);
var anims=L.property("Text").property("Animators");
function animator(name){ var an=anims.addProperty("ADBE Text Animator"); an.name=name; return an; }
function rangeKeys(an, a, b, unitBy){ var sel=an.property("Selectors").addProperty("ADBE Text Selector"); if(unitBy) sel.property("Advanced").property("Based On").setValue(unitBy);
  sel.property("Advanced").property("Shape").setValue(2); // ramp up
  sel.property("Advanced").property("Ease Low").setValue(60);
  var off=sel.property("Offset"); off.setValueAtTime(T,-100); off.setValueAtTime(T+a,100); easeAll(off,80); return sel; }
var ap=function(an,n){ return an.property("Properties").addProperty(n); };
if (style==="rise"||style==="words"){
  var an=animator("Reveal"); ap(an,"ADBE Text Opacity").setValue(0); ap(an,"ADBE Text Position 3D").setValue([0,40,0]); ap(an,"ADBE Text Blur").setValue([12,12]);
  rangeKeys(an, Math.min(1.2,D*0.5), 0, style==="words"?3:1);
} else if (style==="track"){
  var an2=animator("Track In"); ap(an2,"ADBE Text Tracking Amount").setValue(60); ap(an2,"ADBE Text Opacity").setValue(0);
  var sel=an2.property("Selectors").addProperty("ADBE Text Selector"); var amt=sel.property("Advanced").property("Amount"); amt.setValueAtTime(T,100); amt.setValueAtTime(T+1.4,0); easeAll(amt,85);
} else if (style==="typewriter"){
  var an3=animator("Type"); ap(an3,"ADBE Text Opacity").setValue(0); var s3=an3.property("Selectors").addProperty("ADBE Text Selector");
  var st=s3.property("Start"); st.setValueAtTime(T,0); st.setValueAtTime(T+Math.min(1.6,D*0.6),100);
}
var op=L.property("Opacity"); op.setValueAtTime(T+D-0.45,100); op.setValueAtTime(T+D,0); easeAll(op,70);
var fx=L.property("Effects");
var sh=fx.addProperty("ADBE Drop Shadow"); setp(sh,"Opacity",A.shadow==null?55:A.shadow); setp(sh,"Distance",2); setp(sh,"Softness",30); // always on: legibility over footage
if (A.glow!==false){ var gl=fx.addProperty("ADBE Glo2"); setp(gl,"Glow Threshold",55); setp(gl,"Glow Radius",28); setp(gl,"Glow Intensity",0.6); }
app.endUndoGroup(); report("Added '"+style+"' title \""+(A.text||"")+"\" at "+T+"s for "+D+"s");
