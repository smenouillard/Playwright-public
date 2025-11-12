#!/usr/bin/env bash
set -e

OUTPUT="./reports/index.html"
TEMPLATE=".github/scripts/template.html"

# Generate the report list
REPORT_LIST=""
for dir in ./reports/*/; do
  report_name=$(basename "$dir")
  report_path="$dir/index.html"

  if [[ -f "$report_path" ]]; then
    REPORT_LIST+="<li><a href='$report_name/index.html'>$report_name</a></li>\n"
  else
    REPORT_LIST+="<li>$report_name (no report found)</li>\n"
  fi
done

# Replace {{LIST}} in the template with the generated list
sed "s|{{LIST}}|$REPORT_LIST|g" "$TEMPLATE" > "$OUTPUT"

echo "✅ Links fixed and template applied: generated index.html at $OUTPUT"
