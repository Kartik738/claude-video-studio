// Read-only: list third-party effects AE has loaded (anything not by Adobe/CC)
var e=app.effects, out=[]; for (var i=0;i<e.length;i++){ var x=e[i]; if (!/^(ADBE|CC |APC |CS |PSOFT|VISINF|ISL|Mettle|EXtractoR|IDentifier)/.test(x.matchName) || /Saber|Video Copilot|VC|FX ?Console/i.test(x.displayName+x.category)) out.push(x.displayName+" ["+x.matchName+"] in "+x.category); }
report(out.length? out.join("\n") : "no third-party effects found");
