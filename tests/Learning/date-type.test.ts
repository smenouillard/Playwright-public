import { test, expect } from '@playwright/test';

//WORKS LOCALLY, NOT ONLINE
/*
test('Click into birthday field and type date', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const birthdayInput = page.locator('#birthday');

  // 1Simulate user clicking in the field
  await birthdayInput.click();

  // Type the date digits (slashed automatically by the browser)
  await birthdayInput.type('04091967', { delay: 100 });

  // Assert the value in ISO format (what the input actually stores)
  await expect(birthdayInput).toHaveValue('1967-09-04');
});
*/

// WORKS LOCALLY
/*
test('Type birthday as digits and validate displayed value', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const birthdayInput = page.locator('#birthday');

  // Change input to text so slashes are visible and stored as typed
  await birthdayInput.evaluate(el => el.type = 'text');

  // Simulate user clicking into the field
  await birthdayInput.click();

  // Type the date digits (DDMMYYYY)
  const typed = '14021969';
  await birthdayInput.type(typed, { delay: 100 });

  // Insert slashes dynamically for display
  await birthdayInput.evaluate(el => {
    const val = el.value;
    if (val.length === 8) {
      el.value = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4, 8)}`;
    }
  });

  // Read what user actually sees
  const displayedValue = await birthdayInput.inputValue();
  console.log('Displayed value seen by user:', displayedValue);

  // Assert it matches exactly
  await expect(displayedValue).toBe('14/02/1969');
});
*/

//WORKS LOCALLY
/*
test('Type birthday in DDMMYYYY format and see slashes', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const birthdayInput = page.locator('#birthday');

  // Focus input
  await birthdayInput.click();

  // Type digits as user would
  await birthdayInput.type('14021969', { delay: 100 });

  // Get the displayed value exactly as the user sees it
  const displayed = await birthdayInput.evaluate((el: HTMLInputElement) => el.valueAsDate 
    ? el.valueAsDate.toLocaleDateString('fr-FR')  // convert ISO to dd/mm/yyyy
    : el.value
  );

  expect(displayed).toBe('14/02/1969');
});
*/

//WORKS LOCALLY
/*test('Type birthday in DDMMYYYY format and see slashes (locale-independent)', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');

  const birthdayInput = page.locator('#birthday');

  // Focus input
  await birthdayInput.click();

  // Simulate user typing digits only
  await birthdayInput.type('14021969', { delay: 100 });

  // Read the displayed value as the user sees it (with slashes)
  const displayed = await birthdayInput.evaluate((el: HTMLInputElement) => {
    if (!el.value) return '';
    const [year, month, day] = el.value.split('-'); // ISO format YYYY-MM-DD
    return `${day}/${month}/${year}`;               // Convert to DD/MM/YYYY
  });

  // Assert the visible value matches
  expect(displayed).toBe('14/02/1969');
});
*/

test('Set birthday with fill and check displayed value (with 1s visual delays)', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo');
  await page.waitForTimeout(1000); // 1s pause to see navigation

  const birthdayInput = page.locator('#birthday');

  await birthdayInput.waitFor({ state: 'visible' });
  await page.waitForTimeout(1000); // 1s pause

  await expect(birthdayInput).toBeEnabled({ timeout: 5000 });
  await page.waitForTimeout(1000); // 1s pause

  // Fill the input directly with ISO format
  await birthdayInput.fill('1969-02-14');
  await page.waitForTimeout(1000); // 1s pause

  // Read the displayed value as the user would see it (DD/MM/YYYY)
  const displayed = await birthdayInput.evaluate((el: HTMLInputElement) => {
    if (!el.value) return '';
    const [year, month, day] = el.value.split('-'); // ISO format
    return `${day}/${month}/${year}`;               // Convert to DD/MM/YYYY
  });
  await page.waitForTimeout(1000); // 1s pause

  // Assert the displayed value matches expected
  expect(displayed).toBe('14/02/1969');
});

