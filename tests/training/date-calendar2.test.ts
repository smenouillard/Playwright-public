import { test, expect } from '@playwright/test';

test('Pick the 15th after clicking next 3 times', async ({ page }) => {
  // Navigate to the jQuery UI Datepicker page
  await page.goto('https://jqueryui.com/datepicker/');

  // Access the iframe containing the datepicker demo
  const frame = page.frameLocator('.demo-frame');
  const dateInput = frame.locator('#datepicker');

  // Click the input to open the calendar
  await dateInput.click();

  // Click the "Next" button three times to move three months forward
  for (let i = 0; i < 3; i++) {
    await frame.locator('.ui-datepicker-next').click();
    // Wait for the calendar to update after each click
    await frame.locator('.ui-datepicker-title').waitFor({ state: 'visible' });
  }

  // Click the 15th day in the visible month
  const day15 = frame.locator(`.ui-datepicker-calendar td[data-handler="selectDay"] a[data-date="15"]`);
  await day15.first().click();

  // Compute the expected date in MM/DD/YYYY format
  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth() + 3, 15);
  const expectedMonth = String(target.getMonth() + 1).padStart(2, '0');
  const expectedDay = String(target.getDate()).padStart(2, '0');
  const expectedYear = target.getFullYear();
  const expectedValue = `${expectedMonth}/${expectedDay}/${expectedYear}`;

  // Assert that the input value matches the expected date
  await expect(dateInput).toHaveValue(expectedValue);

  // Log the selected date
  console.log('Selected date:', expectedValue);
});