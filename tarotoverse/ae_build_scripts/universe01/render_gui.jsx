(function(){
var ROOT="~/Claude AI/tarotoverse/ae/universe01";
var logF=new File(ROOT+"/render_log.txt"); logF.open("w"); logF.close();
function log(s){logF.open("a");logF.writeln(s);logF.close();}
try{
app.beginSuppressDialogs();
var proj=app.project; var comp=null;
for(var i=1;i<=proj.numItems;i++){ if(proj.item(i) instanceof CompItem && proj.item(i).name=="Tarotoverse — Universe Love Message 01") comp=proj.item(i); }
log("comp "+(comp?comp.name:"none")+" file "+(proj.file?proj.file.fsName:"-"));
while(proj.renderQueue.numItems>0) proj.renderQueue.item(1).remove();
var rq=proj.renderQueue.items.add(comp);
rq.outputModule(1).applyTemplate("H.264 - Match Render Settings - 40 Mbps");
rq.outputModule(1).file=new File(ROOT+"/renders/"+$.global.OUTNAME);
proj.renderQueue.render();
log("status "+rq.status+" done");
}catch(e){log("ERR "+e.line+" "+e);}
app.endSuppressDialogs(false);
})();
