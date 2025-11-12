#!/usr/bin/env bash
set -e

# Output index file
OUTPUT="./reports/index.html"
TEMPLATE=".github/scripts/template.html"

# Roots for HTML reports and JUnit XML
HTML_ROOT="./reports/html"
JUNIT_ROOT="./reports/junit"

REPORT_LIST=""

# Loop over each project folder in HTML reports
for dir in "$HTML_ROOT"/*/; do
  report_name=$(basename "$dir")
  report_index="$dir/index.html"
  junit_file="$JUNIT_ROOT/$report_name.xml"
  status="unknown"

  # Determine status from junit.xml
  if [[ -f "$junit_file" ]]; then
    failures=$(grep -oP 'failures="\K\d+' "$junit_file" | head -1)
    if [[ "$failures" -eq 0 ]]; then
      status="passed"
    else
      status="failed"
    fi
  fi

  # Map status to CSS class
  case "$status" in
    passed) status_class="status-ok" ;;
    failed) status_class="status-fail" ;;
    *)      status_class="status-unknown" ;;
  esac

  # Build the HTML list item
  if [[ -f "$report_index" ]]; then
    REPORT_LIST+="<li><a href='html/$report_name/index.html'>$report_name</a> <span class='badge $status_class'>[$status]</span></li>\n"
  else
    REPORT_LIST+="<li>$report_name (no report found)</li>\n"
  fi
done

# Replace {{LIST}} in the template with generated list
sed "s|{{LIST}}|$REPORT_LIST|g" "$TEMPLATE" > "$OUTPUT"

echo "✅ Links + status badges generated in index.html"