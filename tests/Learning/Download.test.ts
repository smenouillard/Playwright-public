import { test, expect } from '@playwright/test';

test('Generate and verify donwloaded file name', async ({ page }) => {
  // Go to the page
  await page.goto('https://www.lambdatest.com/selenium-playground/generate-file-to-download-demo');

  // Type text in the textbox (simulate real typing to trigger JS)
  const textbox = page.locator('#textbox');
  await textbox.click();
  await textbox.type('Test test test', { delay: 50 });

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
    page.waitForEvent('download', { timeout: 15000 }),
    downloadLink.click()
  ]);

  // Verify the downloaded file name
  const expectedFileName = 'Lambdainfo.txt'; // <-- updated to match site
  expect(download.suggestedFilename()).toBe(expectedFileName);
});
