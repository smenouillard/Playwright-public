import { test, expect } from '@playwright/test';

/*
test('Click into birthday field and type date', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const birthdayInput = page.locator('#birthday');

  // 1️⃣ Simulate user clicking in the field
  await birthdayInput.click();

  // 2️⃣ Type the date digits (slashed automatically by the browser)
  await birthdayInput.type('04091967', { delay: 100 });

  // 3️⃣ Assert the value in ISO format (what the input actually stores)
  await expect(birthdayInput).toHaveValue('1967-09-04');
});
*/

test('Type birthday and validate stored ISO date with displayed value', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const birthdayInput = page.locator('#birthday');

  // Click in the field so user focus is simulated
  await birthdayInput.click();
  await page.waitForTimeout(500);

  // Type the date digits (DDMMYYYY), browser auto-adds slashes
  const typed = '14021969';
  await birthdayInput.type(typed, { delay: 200 });
  await page.waitForTimeout(500);

  // Read the actual value stored by the browser (ISO format)
  const isoStored = await birthdayInput.inputValue();
  console.log('ISO date stored by browser:', isoStored);

  // Validate that stored value is valid ISO 8601 (YYYY-MM-DD)
  await expect(isoStored).toMatch(/\d{4}-\d{2}-\d{2}/);

  // Dynamically extract parts from ISO
  const [year, month, day] = isoStored.split('-');

  // Assert each part matches what user typed
  expect(day).toBe(typed.slice(0, 2));   // DD
  expect(month).toBe(typed.slice(2, 4)); // MM
  expect(year).toBe(typed.slice(4, 8));  // YYYY

  // Read the value displayed to the user (with slashes)
  const displayedValue = await birthdayInput.evaluate(el => (el as HTMLInputElement).value);
  console.log('Displayed date (user sees DD/MM/YYYY):', displayedValue);
});
