const fs = require('fs');
const path = require('path');

// Load template HTML
const templatePath = path.join(__dirname, '..', 'templates', 'index.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Global metadata from workflow
const metadataRaw = process.env.METADATA_JSON;
const globalMeta = JSON.parse(metadataRaw);

// Mapping for OS badges (emoji + label)
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

let reportListHtml = "";

const items = fs.readdirSync(reportsDir, { withFileTypes: true })
  .filter(d => d.isDirectory());

items.forEach(dir => {
  const name = dir.name;

  const metadataPath = path.join(reportsDir, name, 'metadata', 'metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.warn(`Missing metadata.json for ${name}, skipping`);
    return;
  }

  const info = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  // Get badges
  const osBadge = osBadges[info.os] || { emoji: "💻", label: info.os };
  const browserBadge = browserBadges[info.browser] || { emoji: "🌐", label: info.browser };

  reportListHtml += `
<div class="report-block">

  <span class="badge os-badge">${osBadge.emoji} ${osBadge.label}</span>
  <span class="badge browser-badge">${browserBadge.emoji} ${browserBadge.label}</span>

  <p><strong>Executed at:</strong> ${info.timestamp}<br>
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

// Inject replacements
template = template
  .replace('{{PUBLISH_TIMESTAMP}}', globalMeta.publishTimestamp)
  .replace('{{COMMIT_SHA}}', globalMeta.commitSha)
  .replace('{{RUN_NUMBER}}', globalMeta.runNumber)
  .replace('{{RUN_URL}}', globalMeta.runUrl)
  .replace('{{REPORT_LIST}}', reportListHtml);

// Output
const outputPath = path.join(reportsDir, 'index.html');
fs.writeFileSync(outputPath, template);

console.log("index.html generated with badges.");
