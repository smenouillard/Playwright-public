import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Generate, download, check, and delete file', async ({ page }) => {
  // Go to the page
  console.log('Navigating to LambdaTest download page...');
  await page.goto('https://www.lambdatest.com/selenium-playground/generate-file-to-download-demo');

  // Type text to trigger the "Generate File" button
  const textbox = page.locator('#textbox');
  await textbox.click();
  await textbox.type('Test test test', { delay: 50 });
  console.log('Typed text: "Test test test"');

  // Wait until the "Generate File" button is enabled
  const createButton = page.locator('#create');
  await expect(createButton).toBeEnabled({ timeout: 10000 });
  console.log('Button is now enabled');

  // Click "Generate File"
  await createButton.click();
  console.log('Clicked "Generate File"');

  // Wait for download link and download the file
  const downloadLink = page.locator('#link-to-download');
  await expect(downloadLink).toBeVisible({ timeout: 5000 });
  console.log('Download link is visible');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    downloadLink.click()
  ]);
  console.log(`Download started for file: ${download.suggestedFilename()}`);

  // Save file locally
  const downloadPath = path.join(__dirname, download.suggestedFilename());
  await download.saveAs(downloadPath);
  console.log(`File saved locally at: ${downloadPath}`);

  // Check file name
  const expectedFileName = 'Lambdainfo.txt';
  expect(download.suggestedFilename()).toBe(expectedFileName);
  console.log(`Verified file name is: ${expectedFileName}`);

  // Read and log file content
  const content = fs.readFileSync(downloadPath, 'utf-8');
  console.log('File content:');
  console.log(content);

  // Verify file content
  expect(content).toContain('Test test test');
  console.log('Verified content contains "Test test test"');

  // Delete the file after test
  fs.unlinkSync(downloadPath);
  console.log('Downloaded file deleted after test');
});
