// PROJECT PREFLIGHT (read-only). Reports delivery risks for the whole project or ARGS.comp.
var p=app.project, issues=0, warn=function(s){issues++; report("  ⚠ "+s);};
report("== PREFLIGHT  AE "+app.version+"  project: "+(p.file?p.file.name:"(unsaved)")+(p.dirty?"  [UNSAVED CHANGES]":""));
report("Project bit depth: "+p.bitsPerChannel+"bpc | working space: "+(p.workingSpace||"none")+" | expression engine: "+p.expressionEngine);
var missing=[], comps=[], unused=0, solids=0;
for (var i=1;i<=p.numItems;i++){ var it=p.item(i);
  if (it instanceof FootageItem){ if (it.footageMissing) missing.push(it.name+" -> "+(it.missingFootagePath||"?")); if (it.usedIn.length===0) unused++; if (it.mainSource instanceof SolidSource) solids++; }
  if (it instanceof CompItem) comps.push(it); }
report("Items: "+p.numItems+" | comps: "+comps.length+" | unused footage: "+unused+" | solids: "+solids);
if (missing.length){ for (var m=0;m<missing.length;m++) warn("MISSING FOOTAGE: "+missing[m]); } else report("  ✓ no missing footage");
try { var mf=app.fonts.missingOrSubstitutedFonts; if (mf && mf.length){ for (var f=0;f<mf.length;f++) warn("MISSING FONT: "+mf[f].postScriptName); } else report("  ✓ no missing fonts"); } catch(e){ report("  (font check unavailable: "+e+")"); }
var target = ARGS.comp ? [findComp(ARGS.comp)] : comps;
function walk(group, layer, comp){ for (var k=1;k<=group.numProperties;k++){ var pr=group.property(k);
  if (pr.propertyType===PropertyType.PROPERTY){ if (pr.canSetExpression && pr.expressionEnabled && pr.expressionError) warn(comp.name+" > "+layer.name+" > "+pr.name+": EXPRESSION ERROR "+pr.expressionError.split("\n")[0]); }
  else walk(pr, layer, comp); } }
for (var c=0;c<target.length;c++){ var comp=target[c]; if(!comp) continue;
  var ar=(comp.width/comp.height).toFixed(3);
  report("-- comp '"+comp.name+"' "+comp.width+"x"+comp.height+" (ratio "+ar+") "+comp.frameRate+"fps "+comp.duration.toFixed(2)+"s, "+comp.numLayers+" layers");
  if (comp.width%2||comp.height%2) warn(comp.name+": odd dimensions break H.264 export");
  var texts=[], covered=false, hasAudio=false;
  for (var l=1;l<=comp.numLayers;l++){ var L=comp.layer(l);
    if (L.inPoint<=0.01 && L.outPoint>=comp.duration-0.01 && L.enabled && !L.adjustmentLayer && !(L instanceof TextLayer) && !L.guideLayer) covered=true;
    if (L.hasAudio && L.audioEnabled) hasAudio=true;
    if (L instanceof TextLayer){ try{ texts.push('"'+L.property("Source Text").value.text.replace(/\r/g," / ")+'"'); }catch(e){} }
    if (L.enabled && L.outPoint>comp.duration+0.01) {} 
    if (L.enabled && L.inPoint>comp.duration) warn(comp.name+" > "+L.name+": starts after comp end");
    try { walk(L, L, comp); } catch(e){}
  }
  if (!covered) report("  ℹ no single full-length base layer (check for black/empty frames between clips)");
  report("  audio: "+(hasAudio?"yes":"NONE"));
  if (texts.length) report("  on-screen text (check spelling): "+texts.join(" | "));
}
var rq=p.renderQueue; for (var r=1;r<=rq.numItems;r++){ var q=rq.item(r); try{ report("RQ "+r+": "+q.comp.name+" status="+q.status+" -> "+(q.outputModule(1).file?q.outputModule(1).file.fsName:"(no output path)")); }catch(e){} }
report(issues? ("RESULT: "+issues+" issue(s) found") : "RESULT: ✓ clean");
