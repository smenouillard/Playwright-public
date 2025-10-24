import { test, expect } from '@playwright/test';

test('Generate and download file', async ({ page }) => {
  // Go to the page
  await page.goto('https://www.lambdatest.com/selenium-playground/generate-file-to-download-demo');

  // Type text in the textbox (simulate real typing to trigger JS)
  const textbox = page.locator('#textbox');
  await textbox.click();
  await textbox.type('Test test test', { delay: 50 }); // small delay simulates real user typing

  // Wait until the "Generate File" button is enabled
  const createButton = page.locator('#create');
  await expect(createButton).toBeEnabled({ timeout: 10000 });

  // Click on "Generate file"
  await createButton.click();

  // Wait until the download link is visible
  const downloadLink = page.locator('#link-to-download');
  await expect(downloadLink).toBeVisible({ timeout: 5000 });

  // Click on "Download" and wait for the download to start
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    downloadLink.click()
  ]);

  // Save the file locally in the current working directory
  await download.saveAs(download.suggestedFilename());

  // Verify the downloaded file name
  expect(download.suggestedFilename()).toBe('Lambdainfo.txt');
});
