import { test, expect } from '@playwright/test';

test('Pick today, three years in the past', async ({ page }) => {
  // Navigate to the jQuery UI Datepicker page
  await page.goto('https://jqueryui.com/datepicker/');

  // Access the iframe containing the datepicker demo
  const frame = page.frameLocator('.demo-frame');
  const dateInput = frame.locator('#datepicker');

  // Click the input to open the calendar
  await dateInput.click();

  // Compute the target date: today, three years ago
  const today = new Date();
  const target = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
  const targetMonth = target.getMonth(); // 0-based
  const targetYear = target.getFullYear();
  const targetDay = target.getDate();

  // Navigate backward until the calendar shows the target month/year
  while (true) {
    const monthYearText = await frame.locator('.ui-datepicker-title').textContent();
    if (monthYearText?.includes(targetYear.toString()) && monthYearText?.includes(monthName(targetMonth))) {
      break;
    }
    await frame.locator('.ui-datepicker-prev').click();
    await frame.locator('.ui-datepicker-title').waitFor({ state: 'visible' });
  }

  // Click the target day
  const dayLocator = frame.locator(`.ui-datepicker-calendar td[data-handler="selectDay"] a[data-date="${targetDay}"]`);
  await dayLocator.first().click();

  // Build expected value in MM/DD/YYYY format
  const expectedMonth = String(target.getMonth() + 1).padStart(2, '0');
  const expectedDayStr = String(target.getDate()).padStart(2, '0');
  const expectedValue = `${expectedMonth}/${expectedDayStr}/${targetYear}`;

  // Assert the input value matches
  await expect(dateInput).toHaveValue(expectedValue);

  console.log('Selected date:', expectedValue);
});

// Helper function to convert month number to jQuery UI month name
function monthName(monthIndex: number) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[monthIndex];
}
