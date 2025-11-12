#!/usr/bin/env bash
set -e

OUTPUT="./reports/index.html"
TEMPLATE=".github/scripts/template.html"

# Start with the template
cat "$TEMPLATE" > "$OUTPUT"
echo "<ul>" >> "$OUTPUT"

# Loop through each downloaded artifact folder
for dir in ./reports/*/; do
  report_name=$(basename "$dir")
  report_path="$dir/index.html"

  if [[ -f "$report_path" ]]; then
    # Link directly to index.html inside the artifact folder
    echo "<li><a href='$report_name/index.html'>$report_name</a></li>" >> "$OUTPUT"
  else
    echo "<li>$report_name (no report found)</li>" >> "$OUTPUT"
  fi
done

echo "</ul></body></html>" >> "$OUTPUT"

echo "✅ Links fixed: regenerated index.html at $OUTPUT"
