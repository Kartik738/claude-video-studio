// RENDER QUEUE: add a comp with a quality template and output path. Does NOT start rendering unless ARGS.render=true.
// ARGS: {comp (default active), out:"/full/path/name.mp4", om:"H.264 - Match Render Settings - 40 Mbps"|"High Quality with Alpha"|..., rs:"Best Settings", render:false}
var c = ARGS.comp? findComp(ARGS.comp) : activeComp(); if(!c) throw "No comp";
var rq=app.project.renderQueue, it=rq.items.add(c);
try{ it.applyTemplate(ARGS.rs||"Best Settings"); }catch(e){ report("  ! RS template: "+e); }
var om=it.outputModule(1); try{ om.applyTemplate(ARGS.om||"H.264 - Match Render Settings - 40 Mbps"); }catch(e){ report("  ! OM template: "+e); }
if (ARGS.out){ var f=new File(ARGS.out); if (f.exists){ var base=ARGS.out.replace(/(\.[^.\/]+)$/,""), ext=ARGS.out.match(/\.[^.\/]+$/)||[".mp4"], n=2; while(new File(base+"_v"+n+ext[0]).exists) n++; f=new File(base+"_v"+n+ext[0]); report("  (file existed; using new version name)"); } om.file=f; }
report("Queued '"+c.name+"' -> "+(om.file?om.file.fsName:"default location")+" ["+(ARGS.om||"H.264 40 Mbps")+"]");
if (ARGS.render===true){ rq.render(); report("Render finished, status "+it.status); }
