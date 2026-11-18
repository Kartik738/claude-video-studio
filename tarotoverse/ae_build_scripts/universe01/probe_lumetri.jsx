(function(){
var f=new File("~/Claude AI/tarotoverse/ae/universe01/lumetri_props.txt"); f.open("w");
try{
app.beginSuppressDialogs();
var c=app.project.items.addComp("probe",100,100,1,1,30);
var s=c.layers.addSolid([0,0,0],"x",100,100,1,1);
var fx=s.property("Effects");
var names=["ADBE Lumetri","ADBE Unsharp Mask2","ADBE Sharpen","ADBE Noise Reduction","VISINF Grain Implant","ADBE Exposure2","ADBE Vibrance","CC Vignette","ADBE Glo2","ADBE Gaussian Blur 2","ADBE Camera Lens Blur","ADBE Drop Shadow","CC Light Sweep","ADBE Remove Grain"];
for(var i=0;i<names.length;i++) f.writeln(names[i]+" can="+fx.canAddProperty(names[i]));
var L=fx.addProperty("ADBE Lumetri");
function walk(p,d){ for(var k=1;k<=p.numProperties;k++){ var q=p.property(k); var v=""; try{ if(q.propertyValueType!=PropertyValueType.NO_VALUE) v=" = "+q.value;}catch(e){} f.writeln(new Array(d+1).join("  ")+k+" "+q.name+" ["+q.matchName+"]"+v); if(q.numProperties) walk(q,d+1);} }
walk(L,0);
c.remove();
}catch(e){f.writeln("ERR "+e.line+" "+e);}
f.close(); app.endSuppressDialogs(false);
})();
