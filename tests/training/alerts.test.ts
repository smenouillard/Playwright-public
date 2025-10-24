import { test, expect } from '@playwright/test';

test('Bootstrap Modal Demo - should open modal, click Save Changes, and ensure it closes', async ({ page }) => {
  // Navigate to the page
  await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-modal-demo');

  // --- Locators ---
  const launchModalButton = page.locator('button[data-target="#myModal"]');
  const modalDialog = page.locator('#myModal'); // the modal element
  const saveChangesButton = modalDialog.getByRole('button', { name: 'Save Changes' }); // "Save Changes" button inside modal

  // --- Step 1: Click "Launch Modal" ---
  await launchModalButton.click();
  // Wait for modal to be visible
  await expect(modalDialog).toBeVisible();

  // --- Step 2: Click "Save Changes" ---
  await saveChangesButton.click();

  // --- Step 3: Assert that modal is closed ---
  await expect(modalDialog).toBeHidden();
});