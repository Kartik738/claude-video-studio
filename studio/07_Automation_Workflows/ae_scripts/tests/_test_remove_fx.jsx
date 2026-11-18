var c=activeComp(), rm=0; for (var i=c.numLayers;i>=1;i--){ var n=c.layer(i).name; if(n==="FX Aura"||n==="FX Light Sweep"||n==="FX Light Motes"){ c.layer(i).remove(); rm++; } } report("removed "+rm);
