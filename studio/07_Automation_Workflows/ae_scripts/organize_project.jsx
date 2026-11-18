// PROJECT CLEANUP (non-destructive): sorts loose items into folders. Never deletes anything. One undo step.
app.beginUndoGroup("TV Organize Project");
var p=app.project, root=p.rootFolder;
function folder(n){ for (var i=1;i<=root.numItems;i++){ var it=root.item(i); if (it instanceof FolderItem && it.name===n) return it; } return p.items.addFolder(n); }
var moved=0, list=[];
for (var i=1;i<=root.numItems;i++) list.push(root.item(i));
for (var j=0;j<list.length;j++){ var it=list[j], dest=null;
  if (it instanceof FolderItem) continue;
  if (it instanceof CompItem) dest = (it.usedIn.length? "02 Precomps" : "01 Comps");
  else if (it instanceof FootageItem){
    if (it.mainSource instanceof SolidSource) dest="06 Solids";
    else if (!it.hasVideo && it.hasAudio) dest="04 Audio";
    else if (it.mainSource.isStill) dest="05 Images & Graphics";
    else dest="03 Footage"; }
  if (dest){ it.parentFolder=folder(dest); moved++; } }
app.endUndoGroup(); report("Organized "+moved+" item(s) into numbered folders. Nothing deleted. Undo with Cmd+Z.");
