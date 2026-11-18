// Read-only: list Output Module and Render Settings templates available in AE
var rq=app.project.renderQueue; if(rq.numItems>0){ var it=rq.item(1); report("OM templates: "+it.outputModule(1).templates.join(" | ")); report("RS templates: "+it.templates.join(" | ")); } else report("no RQ item to read templates from");
