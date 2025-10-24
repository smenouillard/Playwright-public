import { test, expect } from '@playwright/test';

//TESTS MULTIPLE SELECTIONS THEN FIRST SELECTION - WITH DELAYS -  WORKS
test('Select multiple states in order and verify displayed last selected text and first selected option', async ({ page }) => {
  // Navigate to the test page
  await page.goto('https://www.lambdatest.com/selenium-playground/select-dropdown-demo');
  await page.waitForTimeout(500); // wait 0.5 seconds

  // Locate the multi-select dropdown
  const multiSelect = page.locator('#multi-select');

  // Define the options to select in the desired order
  const options = ['California', 'Texas', 'New Jersey'];

  // Focus the multi-select element to ensure keyboard events work
  await multiSelect.focus();
  await page.waitForTimeout(500);

  // Hold down the Control key to allow multiple selection
  await page.keyboard.down('Control');
  await page.waitForTimeout(500);

  // Loop through each option and click it in the specified order
  for (const option of options) {
    await multiSelect.locator(`option[value="${option}"]`).click();
    await page.waitForTimeout(500); // wait 0.5 seconds between clicks
  }

  // Release the Control key after all selections
  await page.keyboard.up('Control');
  await page.waitForTimeout(500);

  // Click the button that displays all selected options
  await page.locator('#printAll').click();
  await page.waitForTimeout(500);

  // Retrieve the displayed text from the page
  const displayedText = await page.locator('span.groupradiobutton').textContent();
  await page.waitForTimeout(500);

  // Strictly verify the displayed text exactly matches "California,Texas,New Jersey"
  expect(displayedText).toBe('California,Texas,New Jersey');

  // --- Check first selected option ---

  // Click the button that shows the first selected option
  await page.locator('#printMe').click();
  await page.waitForTimeout(500);

  // Retrieve the first selected option text
  const firstSelectedText = await page.locator('span.genderbutton').textContent();
  await page.waitForTimeout(500);

  // Strictly verify it matches "California"
  expect(firstSelectedText).toBe('California');
})


//TESTS FIRST SELECTION THEN MULTIPLE SELECTIONS - WITH DELAYS - WORKS
test('Select multiple states and verify first selected option first, then all selected', async ({ page }) => {
  // Navigate to the test page
  await page.goto('https://www.lambdatest.com/selenium-playground/select-dropdown-demo');
  await page.waitForTimeout(500); // wait 0.5 seconds

  // Locate the multi-select dropdown
  const multiSelect = page.locator('#multi-select');

  // Define the options to select in the desired order
  const options = ['California', 'Texas', 'New Jersey'];

  // Focus the multi-select element to ensure keyboard events work
  await multiSelect.focus();
  await page.waitForTimeout(500);

  // Hold down the Control key to allow multiple selection
  await page.keyboard.down('Control');
  await page.waitForTimeout(500);

  // Loop through each option and click it in the specified order
  for (const option of options) {
    await multiSelect.locator(`option[value="${option}"]`).click();
    await page.waitForTimeout(500); // wait 0.5 seconds between clicks
  }

  // Release the Control key after all selections
  await page.keyboard.up('Control');
  await page.waitForTimeout(500);

  // --- Check first selected option first ---

  // Click the button that shows the first selected option
  await page.locator('#printMe').click();
  await page.waitForTimeout(500);

  // Retrieve the first selected option text
  const firstSelectedText = await page.locator('span.genderbutton').textContent();
  await page.waitForTimeout(500);

  // Strictly verify it matches "California"
  expect(firstSelectedText).toBe('California');

  // --- Now check all selected options ---

  // Click the button that displays all selected options
  await page.locator('#printAll').click();
  await page.waitForTimeout(500);

  // Retrieve the displayed text from the page
  const displayedText = await page.locator('span.groupradiobutton').textContent();
  await page.waitForTimeout(500);

  // Strictly verify the displayed text exactly matches "California,Texas,New Jersey"
  expect(displayedText).toBe('California,Texas,New Jersey');
});
