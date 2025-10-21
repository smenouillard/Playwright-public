import { test, expect } from '@playwright/test';

test('Follow on Twitter popup test', async ({ page, context }) => {
  // Go to the test page
  await page.goto('https://www.lambdatest.com/selenium-playground/window-popup-modal-demo');
  console.log('Main page URL:', page.url());

  // Wait for the popup window to open after clicking the Twitter button
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.click("a[title='Follow @Lambdatesting on Twitter']"),
  ]);

  // Wait for the popup to load
  await popup.waitForLoadState('domcontentloaded');
  console.log('Popup opened with URL:', popup.url());

  // Verify that the popup opened with the expected URL
  await expect(popup).toHaveURL('https://x.com/Lambdatesting');

  // Click the "X" logo button in the popup
  await popup.click("a[aria-label='X']");

  // Wait for navigation and verify the new URL
  await popup.waitForLoadState('domcontentloaded');
  console.log('Popup redirected to URL:', popup.url());

  await expect(popup).toHaveURL('https://x.com/');
});
