#!/usr/bin/env bash
set -e

REPORTS_DIR="./reports"
TEMPLATE_FILE=".github/scripts/template.html"
OUTPUT_FILE="$REPORTS_DIR/index.html"

mkdir -p "$REPORTS_DIR"

# Ensure the HTML template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "❌ HTML template not found: $TEMPLATE_FILE"
  exit 1
fi

# Start building the report list
REPORT_LIST=""

for dir in "$REPORTS_DIR"/*/; do
  [ -d "$dir" ] || continue
  report_name=$(basename "$dir")
  index="$dir/playwright-report/index.html"

  status_class="status-unknown"
  status_text="unknown"

  if [ -f "$index" ]; then
    if grep -qiE 'fail(ed|ures)?' "$index"; then
      status_class="status-fail"
      status_text="failed"
    else
      status_class="status-ok"
      status_text="passed"
    fi
  fi

  relative_link="${report_name}/playwright-report/index.html"
  REPORT_LIST+="<li><a href='$relative_link' target='_blank'>$report_name</a> <span class='badge $status_class'>$status_text</span></li>\n"
done

# Read the template and replace {{LIST}} with the generated list
echo "🧱 Generating $OUTPUT_FILE..."
sed "s|{{LIST}}|$REPORT_LIST|g" "$TEMPLATE_FILE" > "$OUTPUT_FILE"
echo "✅ Global report generated: $OUTPUT_FILE"