import { test, expect } from '@playwright/test';

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
