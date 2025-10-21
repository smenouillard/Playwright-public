import { test, expect } from '@playwright/test';

test('Click into birthday field and type date (CI-proof, .type())', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const birthdayInput = page.locator('#birthday');

  // Simulate user clicking in the field
  await birthdayInput.click();

  // Type the date digits (MMDDYYYY)
  const typed = '04091967';
  await birthdayInput.type(typed, { delay: 100 });

  // Read the actual value stored by the browser (ISO format)
  const actualValue = await birthdayInput.inputValue();
  console.log('Birthday input actual value:', actualValue);

  // Assert the browser stored the expected ISO date
  const expectedISO = '1967-09-04'; // the value browser will store regardless of locale
  await expect(actualValue).toBe(expectedISO);
});
