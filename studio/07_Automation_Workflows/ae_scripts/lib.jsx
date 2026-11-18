// Shared helpers loaded before every script run by ae_run.sh
function hex(h){ h=h.replace("#",""); return [parseInt(h.substr(0,2),16)/255, parseInt(h.substr(2,2),16)/255, parseInt(h.substr(4,2),16)/255]; }
function setp(fx,name,val){ var pr=null; try{ pr=fx.property(name); }catch(x1){} if(!pr){ report("  ! no property "+name); return false; } try{ pr.setValue(val); return true; }catch(x2){ report("  ! "+name+": "+x2.toString()); return false; } }
function easeAll(prop, influence){ influence = influence||70; for (var k=1;k<=prop.numKeys;k++){ try{ var dims = (prop.value instanceof Array && prop.propertyValueType!==PropertyValueType.TwoD_SPATIAL && prop.propertyValueType!==PropertyValueType.ThreeD_SPATIAL)? prop.value.length:1; var e=[]; for(var d=0;d<dims;d++) e.push(new KeyframeEase(0,influence)); prop.setTemporalEaseAtKey(k,e,e);}catch(x){} } }
function findComp(name){ for (var i=1;i<=app.project.numItems;i++){ var it=app.project.item(i); if (it instanceof CompItem && it.name===name) return it; } return null; }
function activeComp(){ var c=app.project.activeItem; return (c && c instanceof CompItem)? c : null; }
