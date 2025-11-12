#!/usr/bin/env bash
set -e

OUTPUT="./reports/index.html"
TEMPLATE=".github/scripts/template.html"
REPORT_LIST=""

for artifact_dir in ./reports/*/; do
  for report_dir in "$artifact_dir"/*/; do
    report_name=$(basename "$report_dir")
    report_index="$report_dir/index.html"
    junit_file="$report_dir/junit.xml"
    status="unknown"

    if [[ -f "$junit_file" ]]; then
      failures=$(grep -oP 'failures="\K\d+' "$junit_file" | head -1)
      if [[ "$failures" -eq 0 ]]; then
        status="passed"
      else
        status="failed"
      fi
    fi

    case "$status" in
      passed) status_class="status-ok" ;;
      failed) status_class="status-fail" ;;
      *)      status_class="status-unknown" ;;
    esac

    if [[ -f "$report_index" ]]; then
      relative_path=$(realpath --relative-to="./reports" "$report_index")
      REPORT_LIST+="<li><a href='$relative_path'>$report_name</a> <span class='badge $status_class'>[$status]</span></li>\n"
    else
      REPORT_LIST+="<li>$report_name (no report found)</li>\n"
    fi
  done
done

sed "s|{{LIST}}|$REPORT_LIST|g" "$TEMPLATE" > "$OUTPUT"
echo "✅ Links + status badges generated in index.html"
