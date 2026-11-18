// Save PNG stills of the active (or ARGS.comp) comp at given times. ARGS: {times:[s,...], dir:"/abs/path", prefix:"frame"}
var c = ARGS.comp? findComp(ARGS.comp) : activeComp(); if(!c) throw "No comp";
var ts=ARGS.times||[0, c.duration/2, c.duration-0.1], out=[];
for (var i=0;i<ts.length;i++){ var f=new File(ARGS.dir+"/"+(ARGS.prefix||"frame")+"_"+("00"+i).slice(-2)+"_"+ts[i].toFixed(2)+"s.png");
  var r=c.saveFrameToPng(ts[i], f); try{ if(r && r.wait) r.wait(); }catch(e){} out.push(f.name); }
report("Saved "+out.length+" frame(s) to "+ARGS.dir);
