const fs = require('fs');
const path = require('path');

/* Load template */
const templatePath = path.join(__dirname, '..', 'templates', 'index.html');
let template = fs.readFileSync(templatePath, 'utf8');

/* Global metadata */
const metadataRaw = process.env.METADATA_JSON;
const globalMeta = JSON.parse(metadataRaw);

/* Badge definitions */
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

/* ---- XML PARSER ---- */

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

function formatDuration(sec) {
  const seconds = Math.round(sec);
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remain}s` : `${remain}s`;
}

/* Determine status pill type */
function statusInfo(summary) {
  if (summary.totalFailures > 0)
    return { text: "FAIL", emoji: "🔴", css: "pill-fail" };
  if (summary.totalSkipped > 0)
    return { text: "SKIPPED", emoji: "🟡", css: "pill-skip" };
  if (summary.totalTests > 0)
    return { text: "PASS", emoji: "🟢", css: "pill-pass" };
  return { text: "NO TESTS", emoji: "⚪", css: "pill-none" };
}

/* Collect all report data */
let entries = [];

const dirs = fs.readdirSync(reportsDir, { withFileTypes: true })
  .filter(d => d.isDirectory());

dirs.forEach(dir => {
  const name = dir.name;
  const metadataPath = path.join(reportsDir, name, 'metadata', 'metadata.json');

  if (!fs.existsSync(metadataPath)) return;

  const info = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  /* Read JUnit XML */
  const junitPath = path.join(reportsDir, name, 'junit', 'test-results.xml');
  let summary = { totalTests: 0, totalFailures: 0, totalSkipped: 0, totalTime: 0 };

  if (fs.existsSync(junitPath)) {
    const xml = fs.readFileSync(junitPath, 'utf8');
    summary = parseJUnitSummary(xml);
  }

  const status = statusInfo(summary);

  entries.push({
    name,
    info,
    summary,
    duration: formatDuration(summary.totalTime),
    status,
    os: osBadges[info.os] || { emoji: "💻", label: info.os },
    browser: browserBadges[info.browser] || { emoji: "🌐", label: info.browser }
  });
});

/* Sort: FAIL → SKIPPED → PASS → NONE */
entries.sort((a, b) => {
  const order = { "FAIL": 0, "SKIPPED": 1, "PASS": 2, "NO TESTS": 3 };
  return order[a.status.text] - order[b.status.text];
});

/* ---- BUILD SUMMARY TABLE ---- */

let summaryTable = `
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

entries.forEach(e => {
  summaryTable += `
<tr>
  <td class="status-cell">
    <span class="status-pill ${e.status.css}">
      ${e.status.emoji} ${e.status.text}
    </span>
  </td>

  <td>${e.os.emoji} ${e.os.label}</td>
  <td>${e.browser.emoji} ${e.browser.label}</td>

  <td class="num-cell">${e.summary.totalTests}</td>
  <td class="num-cell">${e.summary.totalFailures}</td>
  <td class="num-cell">${e.summary.totalSkipped}</td>

  <td>${e.duration}</td>
</tr>`;
});

summaryTable += `</table>`;

/* ---- BUILD DETAIL BLOCKS ---- */

let reportBlocks = "";

entries.forEach(e => {
  reportBlocks += `
<div class="report-block">

  <span class="status-pill ${e.status.css}">
    ${e.status.emoji} ${e.status.text}
  </span>

  <br><br>

  <span class="badge os-badge">${e.os.emoji} ${e.os.label}</span>
  <span class="badge browser-badge">${e.browser.emoji} ${e.browser.label}</span>

  <p>
    📊 ${e.summary.totalTests} tests  
    • ⚠ ${e.summary.totalFailures} failed  
    • ➖ ${e.summary.totalSkipped} skipped<br>

    ⏱ Duration: ${e.duration}<br>
    Executed at: ${e.info.timestamp}<br>
    Runner: ${e.info.runner}
  </p>

  <div class="links">
    <a href="${globalMeta.runUrl}">📘 Logs</a>
    <a href="${e.name}/playwright-report/index.html">📄 HTML Report</a>
    <a href="${e.name}/jsonReports/jsonReport.json">🧩 JSON</a>
    <a href="${e.name}/junit/test-results.xml">📑 XML</a>
  </div>

</div>`;
});

/* Inject into template */
template = template
  .replace('{{PUBLISH_TIMESTAMP}}', globalMeta.publishTimestamp)
  .replace('{{COMMIT_SHA}}', globalMeta.commitSha)
  .replace('{{RUN_NUMBER}}', globalMeta.runNumber)
  .replace('{{RUN_URL}}', globalMeta.runUrl)
  .replace('{{SUMMARY_TABLE}}', summaryTable)
  .replace('{{REPORT_LIST}}', reportBlocks);

fs.writeFileSync(path.join(reportsDir, 'index.html'), template);

console.log("Batch 4 dashboard generated successfully.");
