(function(){
var ROOT="~/Claude AI/tarotoverse/ae/universe01";
var logF=new File(ROOT+"/stills_log.txt"); logF.open("w"); logF.close();
function log(s){logF.open("a");logF.write(s+"\n");logF.close();}
try{
app.beginSuppressDialogs();
try{ if(app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);}catch(c){}
app.newProject();
var foot=app.project.importFile(new ImportOptions(new File("~/Downloads/IMG_7061.MOV")));
log("foot "+foot.width+"x"+foot.height+" fps "+foot.frameRate+" dur "+foot.duration);
var c=app.project.items.addComp("s",1080,1920,1,foot.duration,30);
var L=c.layers.add(foot); L.property("Scale").setValue([50,50]);
var ts=[0.8,3.0,6.0,8.0,10.6,11.5,14.0,17.5];
for(var i=0;i<ts.length;i++){ c.saveFrameToPng(ts[i], new File(ROOT+"/stills/src_"+ts[i].toFixed(2)+".png")); }
// a 1:1 crop at full res for noise/detail inspection
var c2=app.project.items.addComp("crop",1080,1080,1,foot.duration,30);
var L2=c2.layers.add(foot); L2.property("Position").setValue([1080/2+ (1080-1080), 1080/2 - 1300 + 1920]);
c2.saveFrameToPng(12.0, new File(ROOT+"/stills/crop100_12.png"));
log("done");
}catch(e){log("ERR "+e.line+" "+e);}
app.endSuppressDialogs(false);
})();
