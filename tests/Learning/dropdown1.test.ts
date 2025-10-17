import { test, expect } from '@playwright/test';

test('Select Tuesday from dropdown', async ({ page }) => {
  // Navigate to the page
  await page.goto('https://www.lambdatest.com/selenium-playground/select-dropdown-demo');

  // --- Locators ---
  const dayDropdown = page.locator('#select-demo'); // the dropdown menu
  const selectedValueText = page.locator('.selected-value'); // area showing selected value

  // --- Step 1: Select "Tuesday" ---
  await dayDropdown.selectOption('Tuesday');

  // --- Step 2: Wait for 3 seconds (3000 ms) ---
  await page.waitForTimeout(3000);

  // --- Step 3: Assert the selected value ---
  await expect(selectedValueText).toHaveText('Day selected :- Tuesday');
});


/* 
//TESTS BOTH ALL SELECTED AND FIRST SELECTED. WORKED THEN DID NOT WORK.

test('Select multiple states and verify first & all selected', async ({ page }) => {
  // Go to the page
  await page.goto('https://www.lambdatest.com/selenium-playground/select-dropdown-demo');

  // Locator for the multi-select dropdown
  const multiSelect = page.locator('#multi-select');

  // Hold Ctrl and click options in order: California, Texas, New Jersey
  const options = ['California', 'Texas', 'New Jersey'];

  for (const option of options) {
    await page.keyboard.down('Control');            // Hold Ctrl
    await multiSelect.locator(`option[value="${option}"]`).click();
    await page.keyboard.up('Control');              // Release Ctrl
    await page.waitForTimeout(3000);                // Wait 3 seconds to watch
  }

  // Verify all three states are selected in the dropdown
  const selectedOptions = await multiSelect.evaluate((sel) =>
    Array.from(sel.selectedOptions).map((opt) => opt.value)
  );
  expect(selectedOptions.sort()).toEqual(options.sort());

  // Click "First Selected" button
  const firstSelectedBtn = page.locator('#printMe');
  await firstSelectedBtn.click();
  await page.waitForTimeout(3000); // wait 3 seconds

  // Verify the displayed first selected text
  const firstSelectedText = await page.locator('span.genderbutton').textContent();
  expect(firstSelectedText).toBe('California');

  // Click "Get Last Selected" button
  const getAllSelectedBtn = page.locator('#printAll');
  await getAllSelectedBtn.click();
  await page.waitForTimeout(3000); // wait 3 seconds

  // Verify all selected items are displayed
  const allSelectedText = await page.locator('span.groupradiobutton').textContent();
  const displayedItems = allSelectedText?.split(',').map(s => s.trim()).sort();
  expect(displayedItems).toEqual(options.sort());
});
*/

/*
//TESTS ONLY MULTIPLE SELECTIONS - WORKED THEN DID NOT WORK
test('Select multiple states and verify displayed last selected text', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/select-dropdown-demo');

  const multiSelect = page.locator('#multi-select');
  const options = ['California', 'Texas', 'New Jersey'];

  // Hold Ctrl to select multiple options
  await page.keyboard.down('Control');

  for (const option of options) {
    await multiSelect.locator(`option[value="${option}"]`).click();
    await page.waitForTimeout(1000); // 1 second delay between clicks
  }

  await page.keyboard.up('Control');

  // Click "Get Last Selected" button to update the span
  await page.locator('#printAll').click();
  await page.waitForTimeout(1000); // 1 second delay

  // Verify the displayed text
  const displayedText = await page.locator('span.groupradiobutton').textContent();
  expect(displayedText).toBe(options.join(','));
})
*/

/*
//TESTS ONLY MULTIPLE SELECTIONS - WORKED
test('Select multiple states in order and verify displayed last selected text', async ({ page }) => {
  // Navigate to the test page
  await page.goto('https://www.lambdatest.com/selenium-playground/select-dropdown-demo');

  // Locate the multi-select dropdown
  const multiSelect = page.locator('#multi-select');

  // Define the options to select in the desired order
  const options = ['California', 'Texas', 'New Jersey'];

  // Focus the multi-select element to ensure keyboard events work
  await multiSelect.focus();

  // Hold down the Control key to allow multiple selection
  await page.keyboard.down('Control');

  // Loop through each option and click it in the specified order
  for (const option of options) {
    await multiSelect.locator(`option[value="${option}"]`).click();
  }

  // Release the Control key after all selections
  await page.keyboard.up('Control');

  // Click the button that displays all selected options
  await page.locator('#printAll').click();

  // Retrieve the displayed text from the page
  const displayedText = await page.locator('span.groupradiobutton').textContent();

  // Strictly verify the displayed text exactly matches "California,Texas,New Jersey"
  expect(displayedText).toBe('California,Texas,New Jersey');
  
});
*/

//TESTS MULTIPLE SELECTIONS THEN FIRST SELECTION - WORKS FOR NOW
test('Select multiple states in order and verify displayed last selected text and first selected option', async ({ page }) => {
  // Navigate to the test page
  await page.goto('https://www.lambdatest.com/selenium-playground/select-dropdown-demo');

  // Locate the multi-select dropdown
  const multiSelect = page.locator('#multi-select');

  // Define the options to select in the desired order
  const options = ['California', 'Texas', 'New Jersey'];

  // Focus the multi-select element to ensure keyboard events work
  await multiSelect.focus();

  // Hold down the Control key to allow multiple selection
  await page.keyboard.down('Control');

  // Loop through each option and click it in the specified order
  for (const option of options) {
    await multiSelect.locator(`option[value="${option}"]`).click();
  }

  // Release the Control key after all selections
  await page.keyboard.up('Control');

  // Click the button that displays all selected options
  await page.locator('#printAll').click();

  // Retrieve the displayed text from the page
  const displayedText = await page.locator('span.groupradiobutton').textContent();

  // Strictly verify the displayed text exactly matches "California,Texas,New Jersey"
  expect(displayedText).toBe('California,Texas,New Jersey');

  // --- NEW SECTION: Check first selected option ---

  // Click the button that shows the first selected option
  await page.locator('#printMe').click();

  // Retrieve the first selected option text
  const firstSelectedText = await page.locator('span.genderbutton').textContent();

  // Strictly verify it matches "California"
  expect(firstSelectedText).toBe('California');
})