import { chromium, test } from "@playwright/test";

test('Select multiple states, click buttons with delays, then verify displayed values', async ({ page }) => {
  // Navigate to the page
  await page.goto('https://www.lambdatest.com/selenium-playground/select-dropdown-demo');

  // Select multiple options
  await page.locator('#multi-select').selectOption([
    { value: 'Texas' },
    { value: 'New Jersey' },
    { value: 'California' }
  ]);

  // Wait 2 seconds
  await page.waitForTimeout(2000);

  // Click "First Selected" button
  await page.click('#printMe');

  // Wait 2 seconds
  await page.waitForTimeout(2000);

  // Click "Get Last Selected" button
  await page.click('#printAll');

  // Wait 2 seconds
  await page.waitForTimeout(2000);

  // Verify first selected option
  const firstSelected = page.locator('span.genderbutton');
  await expect(firstSelected).toHaveText('California', { timeout: 5000 });

  // Verify all selected options
  const allSelected = page.locator('span.groupradiobutton');
  await expect(allSelected).toHaveText('California,New Jersey,Texas', { timeout: 5000 });
});