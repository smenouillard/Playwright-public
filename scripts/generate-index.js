const fs = require('fs');
const path = require('path');

// Load template HTML
const templatePath = path.join(__dirname, '..', 'templates', 'index.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Global metadata from workflow
const metadataRaw = process.env.METADATA_JSON;
const globalMeta = JSON.parse(metadataRaw);

// Mapping for OS badges
const osBadges = {
  "ubuntu-latest": { emoji: "🐧", label: "Ubuntu" },
  "windows-latest": { emoji: "🪟", label: "Windows" },
  "macos-latest": { emoji: "🍎", label: "macOS" }
};

// Mapping for Browser badges
const browserBadges = {
  "firefox": { emoji: "🦊", label: "Firefox" },
  "chromium": { emoji: "🌐", label: "Chromium" },
  "webkit": { emoji: "🍏", label: "WebKit" }
};

const reportsDir = path.join(process.cwd(), 'reports');

// ---- Helpers ----

// Parse JUnit XML (simple, custom parser)
function parseJUnitSummary(xml) {
  const suiteRegex = /<testsuite\b([^>]*)>/g;
  let totalTests = 0;
  let totalFailures = 0;
  let totalSkipped = 0;
  let totalTime = 0;

  let match;
  while ((match = suiteRegex.exec(xml)) !== null) {
    const attrs = match[1];

    function getAttr(name) {
      const re = new RegExp(name + '="([^"]+)"');
      const m = re.exec(attrs);
      return m ? m[1] : null;
    }

    const tests = parseInt(getAttr('tests') || '0', 10) || 0;
    const failures = parseInt(getAttr('failures') || '0', 10) || 0;
    const skipped = parseInt(getAttr('skipped') || '0', 10) || 0;
    const timeStr = getAttr('time');
    const time = timeStr ? parseFloat(timeStr) || 0 : 0;

    totalTests += tests;
    totalFailures += failures;
    totalSkipped += skipped;
    totalTime += time;
  }

  return { totalTests, totalFailures, totalSkipped, totalTime };
}

// Format duration as Xm Ys (choice 1B)
function formatDuration(totalSeconds) {
  const seconds = Math.round(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remaining}s`;
  }
  return `${remaining}s`;
}

// Determine status emoji
function getStatusEmoji(summary) {
  const { totalTests, totalFailures, totalSkipped } = summary;
  if (totalFailures > 0) return "🔴";
  if (totalTests > 0 && totalSkipped > 0) return "🟡";
  if (totalTests > 0) return "🟢";
  return "⚪"; // no tests?
}

// ---- Build data from folders ----

let reportListHtml = "";
let summaries = [];

const items = fs.readdirSync(reportsDir, { withFileTypes: true })
  .filter(d => d.isDirectory());

items.forEach(dir => {
  const name = dir.name;

  // metadata.json
  const metadataPath = path.join(reportsDir, name, 'metadata', 'metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.warn(`Missing metadata.json for ${name}, skipping`);
    return;
  }
  const info = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  // JUnit XML
  const junitPath = path.join(reportsDir, name, 'junit', 'test-results.xml');
  let summary = {
    totalTests: 0,
    totalFailures: 0,
    totalSkipped: 0,
    totalTime: 0
  };

  if (fs.existsSync(junitPath)) {
    const xml = fs.readFileSync(junitPath, 'utf8');
    summary = parseJUnitSummary(xml);
  } else {
    console.warn(`Missing JUnit XML for ${name}, summary will be empty`);
  }

  const durationText = formatDuration(summary.totalTime);
  const statusEmoji = getStatusEmoji(summary);

  const osBadge = osBadges[info.os] || { emoji: "💻", label: info.os };
  const browserBadge = browserBadges[info.browser] || { emoji: "🌐", label: info.browser };

  // Save for summary table
  summaries.push({
    name,
    os: osBadge,
    browser: browserBadge,
    statusEmoji,
    summary
  });

  // Build report block (detailed)
  reportListHtml += `
<div class="report-block">

  <span class="badge os-badge">${osBadge.emoji} ${osBadge.label}</span>
  <span class="badge browser-badge">${browserBadge.emoji} ${browserBadge.label}</span>

  <p><strong>Status:</strong> ${statusEmoji} 
     — Tests: ${summary.totalTests}, Failures: ${summary.totalFailures}, Skipped: ${summary.totalSkipped}<br>
     <strong>Duration:</strong> ${durationText}<br>
     <strong>Executed at:</strong> ${info.timestamp}<br>
     <strong>Runner:</strong> ${info.runner}</p>

  <div class="links">
    <a href="${globalMeta.runUrl}">View Logs</a> |
    <a href="${name}/playwright-report/index.html">HTML Report</a> |
    <a href="${name}/jsonReports/jsonReport.json">JSON</a> |
    <a href="${name}/junit/test-results.xml">JUnit XML</a>
  </div>

</div>
`;
});

// ---- Build summary table ----

let summaryTableHtml = '<table class="summary"><tr>' +
  '<th>Status</th>' +
  '<th>OS</th>' +
  '<th>Browser</th>' +
  '<th>Total</th>' +
  '<th>Failures</th>' +
  '<th>Skipped</th>' +
  '<th>Duration</th>' +
  '</tr>';

summaries.forEach(entry => {
  const { os, browser, statusEmoji, summary } = entry;
  const durationText = formatDuration(summary.totalTime);

  summaryTableHtml += `
<tr>
  <td>${statusEmoji}</td>
  <td>${os.emoji} ${os.label}</td>
  <td>${browser.emoji} ${browser.label}</td>
  <td>${summary.totalTests}</td>
  <td>${summary.totalFailures}</td>
  <td>${summary.totalSkipped}</td>
  <td>${durationText}</td>
</tr>`;
});

summaryTableHtml += '</table>';

// ---- Inject into template ----

template = template
  .replace('{{PUBLISH_TIMESTAMP}}', globalMeta.publishTimestamp)
  .replace('{{COMMIT_SHA}}', globalMeta.commitSha)
  .replace('{{RUN_NUMBER}}', globalMeta.runNumber)
  .replace('{{RUN_URL}}', globalMeta.runUrl)
  .replace('{{SUMMARY_TABLE}}', summaryTableHtml)
  .replace('{{REPORT_LIST}}', reportListHtml);

// Output
const outputPath = path.join(reportsDir, 'index.html');
fs.writeFileSync(outputPath, template);

console.log("index.html generated with summary table and JUnit stats.");
