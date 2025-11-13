const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'templates', 'index.html');
let template = fs.readFileSync(templatePath, 'utf8');

const metadataRaw = process.env.METADATA_JSON;
const globalMeta = JSON.parse(metadataRaw);

const osBadges = {
  "ubuntu-latest": { emoji: "🐧", label: "Ubuntu" },
  "windows-latest": { emoji: "🪟", label: "Windows" },
  "macos-latest": { emoji: "🍎", label: "macOS" }
};

const browserBadges = {
  "firefox": { emoji: "🦊", label: "Firefox" },
  "chromium": { emoji: "🌐", label: "Chromium" },
  "webkit": { emoji: "🍏", label: "WebKit" }
};

const reportsDir = path.join(process.cwd(), 'reports');

// ---- XML Parsing ----

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

    totalTests += parseInt(getAttr('tests') || '0', 10);
    totalFailures += parseInt(getAttr('failures') || '0', 10);
    totalSkipped += parseInt(getAttr('skipped') || '0', 10);
    totalTime += parseFloat(getAttr('time') || '0');
  }

  return { totalTests, totalFailures, totalSkipped, totalTime };
}

function formatDuration(totalSeconds) {
  const seconds = Math.round(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${remaining}s`;
}

function getStatusEmoji(summary) {
  if (summary.totalFailures > 0) return "🔴";
  if (summary.totalSkipped > 0) return "🟡";
  if (summary.totalTests > 0) return "🟢";
  return "⚪";
}

function getStatusCssClass(summary) {
  if (summary.totalFailures > 0) return "status-red";
  if (summary.totalSkipped > 0) return "status-yellow";
  if (summary.totalTests > 0) return "status-green";
  return "status-neutral";
}

// ---- Collect summaries ----

let summaries = [];

const items = fs.readdirSync(reportsDir, { withFileTypes: true })
  .filter(d => d.isDirectory());

items.forEach(dir => {
  const name = dir.name;

  const metadataPath = path.join(reportsDir, name, 'metadata', 'metadata.json');
  if (!fs.existsSync(metadataPath)) return;
  const info = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  const junitPath = path.join(reportsDir, name, 'junit', 'test-results.xml');
  let summary = { totalTests: 0, totalFailures: 0, totalSkipped: 0, totalTime: 0 };
  if (fs.existsSync(junitPath)) {
    summary = parseJUnitSummary(fs.readFileSync(junitPath, 'utf8'));
  }

  const os = osBadges[info.os] || { emoji: "💻", label: info.os };
  const browser = browserBadges[info.browser] || { emoji: "🌐", label: info.browser };
  const duration = formatDuration(summary.totalTime);
  const status = getStatusEmoji(summary);
  const cssClass = getStatusCssClass(summary);

  summaries.push({
    name,
    info,
    os,
    browser,
    summary,
    duration,
    status,
    cssClass
  });
});

// ---- Sort: failures first, then skipped, then passed ----

summaries.sort((a, b) => {
  const order = { "🔴": 0, "🟡": 1, "🟢": 2, "⚪": 3 };
  return order[a.status] - order[b.status];
});

// ---- Build summary table ----

let summaryTableHtml = `
<table class="summary">
<tr>
  <th>Status</th>
  <th>OS</th>
  <th>Browser</th>
  <th>Total</th>
  <th>Failures</th>
  <th>Skipped</th>
  <th>Duration</th>
</tr>`;

summaries.forEach(s => {
  summaryTableHtml += `
<tr class="${s.cssClass}">
  <td>${s.status}</td>
  <td>${s.os.emoji} ${s.os.label}</td>
  <td>${s.browser.emoji} ${s.browser.label}</td>
  <td>${s.summary.totalTests}</td>
  <td>${s.summary.totalFailures}</td>
  <td>${s.summary.totalSkipped}</td>
  <td>${s.duration}</td>
</tr>`;
});

summaryTableHtml += `</table>`;

// ---- Build detailed blocks ----

let reportListHtml = "";

summaries.forEach(s => {
  reportListHtml += `
<div class="report-block ${s.cssClass}">

  <span class="badge os-badge">${s.os.emoji} ${s.os.label}</span>
  <span class="badge browser-badge">${s.browser.emoji} ${s.browser.label}</span>

  <p><strong>${s.status === "🟢" ? "🟢 All tests passed" :
               s.status === "🔴" ? "🔴 Failures detected" :
               s.status === "🟡" ? "🟡 Some tests skipped" :
               "⚪ No tests run"}</strong><br>

     📊 ${s.summary.totalTests} tests  
     • ⚠ ${s.summary.totalFailures} failed  
     • ➖ ${s.summary.totalSkipped} skipped<br>

     ⏱ Duration: ${s.duration}<br>
     Executed at: ${s.info.timestamp}<br>
     Runner: ${s.info.runner}</p>

  <div class="links">
    <a href="${globalMeta.runUrl}">📘 Logs</a>
    <a href="${s.name}/playwright-report/index.html">📄 HTML Report</a>
    <a href="${s.name}/jsonReports/jsonReport.json">🧩 JSON</a>
    <a href="${s.name}/junit/test-results.xml">📑 XML</a>
  </div>

</div>`;
});

// ---- Inject into template ----

template = template
  .replace('{{PUBLISH_TIMESTAMP}}', globalMeta.publishTimestamp)
  .replace('{{COMMIT_SHA}}', globalMeta.commitSha)
  .replace('{{RUN_NUMBER}}', globalMeta.runNumber)
  .replace('{{RUN_URL}}', globalMeta.runUrl)
  .replace('{{SUMMARY_TABLE}}', summaryTableHtml)
  .replace('{{REPORT_LIST}}', reportListHtml);

fs.writeFileSync(path.join(reportsDir, 'index.html'), template);

console.log("index.html generated with Batch 3 refinements.");
