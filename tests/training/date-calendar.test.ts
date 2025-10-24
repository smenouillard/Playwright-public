import { test, expect } from '@playwright/test';

test('Pick May 4th 2026 in jQuery UI Datepicker', async ({ page }) => {
  await page.goto('https://jqueryui.com/datepicker/');

  const frame = page.frameLocator('.demo-frame');
  const dateInput = frame.locator('#datepicker');

  await dateInput.click();

  // Navigate to May 2026
  while (true) {
    const monthYear = await frame.locator('.ui-datepicker-title').textContent();
    if (monthYear?.includes('May') && monthYear?.includes('2026')) break;
    await frame.locator('.ui-datepicker-next').click();
  }

  // Click the day "4" with precise selector using data-date
  const day = frame.locator('.ui-datepicker-calendar td[data-handler="selectDay"] a[data-date="4"]');
  await day.first().click(); // ensures we click only one element

  // Verify the input value
  await expect(dateInput).toHaveValue('05/04/2026');
});