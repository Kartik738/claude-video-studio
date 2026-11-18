// Read-only: what is open in After Effects right now
var p=app.project; report("AE "+app.version+" | project: "+(p.file?p.file.fsName:"(unsaved)")+" | items: "+p.numItems+" | unsaved changes: "+p.dirty);
var c=activeComp(); if(c) report("active comp: "+c.name+" "+c.width+"x"+c.height+" "+c.frameRate+"fps "+c.duration.toFixed(2)+"s layers:"+c.numLayers);
report("render queue items: "+p.renderQueue.numItems);
