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