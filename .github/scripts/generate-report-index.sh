#!/usr/bin/env bash
set -e

# Output index file
OUTPUT="./reports/index.html"
TEMPLATE=".github/scripts/template.html"

REPORT_LIST=""

# Look for every Playwright report (anywhere inside ./reports)
for dir in ./reports/*/; do
  report_name=$(basename "$dir")
  report_index="$dir/playwright-report/index.html"
  junit_file="$dir/playwright-report/junit.xml"
  status="unknown"

  # Determine status from JUnit XML
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

  # Build HTML list
  if [[ -f "$report_index" ]]; then
    REPORT_LIST+="<li><a href='$report_name/playwright-report/index.html'>$report_name</a> <span class='badge $status_class'>[$status]</span></li>\n"
  else
    REPORT_LIST+="<li>$report_name (no report found)</li>\n"
  fi
done

# Replace {{LIST}} in template
sed "s|{{LIST}}|$REPORT_LIST|g" "$TEMPLATE" > "$OUTPUT"

echo "✅ Links + status badges generated in index.html"
