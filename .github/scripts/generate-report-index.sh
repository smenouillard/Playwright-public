#!/usr/bin/env bash
set -e

OUTPUT="./reports/index.html"
TEMPLATE=".github/scripts/template.html"

REPORT_LIST=""

for dir in ./reports/*/; do
  report_name=$(basename "$dir")
  report_index="$dir/index.html"
  junit_file="$dir/junit.xml"
  status="unknown"
  color="grey"

  if [[ -f "$junit_file" ]]; then
    # Extract the number of failures from junit.xml
    failures=$(grep -oP 'failures="\K\d+' "$junit_file" | head -1)
    if [[ "$failures" -eq 0 ]]; then
      status="passed"
      color="green"
    else
      status="failed"
      color="red"
    fi
  fi

  if [[ -f "$report_index" ]]; then
    REPORT_LIST+="<li><a href='$report_name/index.html'>$report_name</a> <span style='color:$color;font-weight:bold;'>[$status]</span></li>\n"
  else
    REPORT_LIST+="<li>$report_name (no report found)</li>\n"
  fi
done

# Replace {{LIST}} in the template with the generated list
sed "s|{{LIST}}|$REPORT_LIST|g" "$TEMPLATE" > "$OUTPUT"

echo "✅ Links + status badges generated in index.html"