const fs = require('fs');
const path = require('path');

// Load template
const templatePath = path.join(__dirname, '..', 'templates', 'index.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Global metadata from publish job
const metadataRaw = process.env.METADATA_JSON;
const globalMeta = JSON.parse(metadataRaw);

// Location of downloaded artifacts
const reportsDir = path.join(process.cwd(), 'reports');

// Build report list HTML
let reportListHtml = '';

const items = fs.readdirSync(reportsDir, { withFileTypes: true })
  .filter(d => d.isDirectory());

items.forEach(dir => {
  const name = dir.name;

  // Path to metadata.json created in each test job
  const metadataPath = path.join(reportsDir, name, 'metadata', 'metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.warn(`Missing metadata.json for ${name}, skipping`);
    return;
  }

  const info = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  reportListHtml += `
<li>
  <strong>${name}</strong><br>
  Executed at: ${info.timestamp}<br>
  OS: ${info.os}<br>
  Browser: ${info.browser}<br>
  Runner: ${info.runner}<br>
  <a href="${globalMeta.runUrl}">View Logs</a><br>
  <a href="${name}/playwright-report/index.html">HTML Report</a> •
  <a href="${name}/jsonReports/jsonReport.json">JSON</a> •
  <a href="${name}/junit/test-results.xml">JUnit XML</a>
</li><br>`;
});

// Inject into template
template = template
  .replace('{{PUBLISH_TIMESTAMP}}', globalMeta.publishTimestamp)
  .replace('{{COMMIT_SHA}}', globalMeta.commitSha)
  .replace('{{RUN_NUMBER}}', globalMeta.runNumber)
  .replace('{{RUN_URL}}', globalMeta.runUrl)
  .replace('{{REPORT_LIST}}', reportListHtml);

// Output final file
const outputPath = path.join(reportsDir, 'index.html');
fs.writeFileSync(outputPath, template);

console.log("index.html generated successfully.");
