#!/bin/zsh
# Run an ExtendScript (.jsx) inside the open After Effects 2027 and print what it reports.
# Usage: ae_run.sh /path/to/script.jsx ['{"json":"args"}'] [timeout_seconds]
# The JSON (optional) is available inside the script as ARGS.
# Inside the script call report("text") to send lines back. lib.jsx helpers are preloaded.
# Note: AE cannot read scripts from system temp folders, so run files live in ../.run
JSX="${1:A}"; ARGS_JSON="${2:-}"; [[ -z "$ARGS_JSON" ]] && ARGS_JSON="{}"; T="${3:-300}"
[[ -f "$JSX" ]] || { echo "No such script: $JSX"; exit 1; }
BASE="${0:A:h:h}"; RUN="$BASE/.run"; mkdir -p "$RUN"
ID=$(date +%s)$$; OUT="$RUN/out_$ID.txt"; WRAP="$RUN/wrap_$ID.jsx"; : > "$OUT"
cat > "$WRAP" <<JSX
var __AE_OUT = "$OUT";
var ARGS = $ARGS_JSON;
function report(s){ var f=new File(__AE_OUT); f.encoding="UTF-8"; f.lineFeed="Unix"; f.open("a"); f.writeln(String(s)); f.close(); }
app.beginSuppressDialogs();
try { \$.evalFile(new File("$BASE/ae_scripts/lib.jsx")); \$.evalFile(new File("$JSX")); }
catch(e){ report("ERROR: " + e.toString() + " (line " + e.line + ")"); }
app.endSuppressDialogs(false);
report("__DONE__");
JSX
osascript -e "with timeout of $T seconds" -e "tell application \"Adobe After Effects 2027\" to DoScript \"\$.evalFile(new File('$WRAP'))\"" -e "end timeout" >/dev/null 2>&1
grep -v "__DONE__" "$OUT"
grep -q "__DONE__" "$OUT" || echo "NOTE: script did not confirm completion (AE busy, a dialog open, or timeout ${T}s)"
[[ -n "$AE_KEEP" ]] || rm -f "$WRAP" "$OUT"
