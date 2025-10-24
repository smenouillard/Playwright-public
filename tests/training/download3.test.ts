import { test, expect } from '@playwright/test';

test('Generate, download, and check file content', async ({ page }) => {
  // Go to the page
  console.log('Navigating to LambdaTest download page...');
  await page.goto('https://www.lambdatest.com/selenium-playground/generate-file-to-download-demo');

  // Type text in the textbox
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

  // Wait for the download link and start download
  const downloadLink = page.locator('#link-to-download');
  await expect(downloadLink).toBeVisible({ timeout: 5000 });
  console.log('Download link is visible');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    downloadLink.click()
  ]);
  console.log(`Download started for file: ${download.suggestedFilename()}`);

  // Check file name
  const expectedFileName = 'Lambdainfo.txt';
  expect(download.suggestedFilename()).toBe(expectedFileName);
  console.log(`Verified file name is: ${expectedFileName}`);

  // Read file content directly from download stream
  let content = '';
  const stream = await download.createReadStream();
  for await (const chunk of stream) {
    content += chunk.toString();
  }

  // Verify content
  console.log('File content:');
  console.log(content);
  expect(content).toContain('Test test test');
  console.log('Verified content contains "Test test test"');

  // Done — no file saved
  console.log('Download checked successfully, no file saved.');
});




/*
test('Generate, download, check, and log file content without fs', async ({ page }) => {
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

  // Check file name
  const expectedFileName = 'Lambdainfo.txt';
  expect(download.suggestedFilename()).toBe(expectedFileName);
  console.log(`Verified file name is: ${expectedFileName}`);

  // Read file content using a stream (no fs needed)
  let content = '';
  const stream = await download.createReadStream();
  for await (const chunk of stream) {
    content += chunk.toString();
  }

  // Log and verify content
  console.log('File content:');
  console.log(content);
  expect(content).toContain('Test test test');
  console.log('Verified content contains "Test test test"');

  // No file is written to disk, so no need to delete it
  console.log('File read entirely in memory, no disk file created');
});
*/