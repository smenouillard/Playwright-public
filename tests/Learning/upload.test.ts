import { test, expect } from '@playwright/test';
import path from 'path';

test('File upload with multiple selection verification', async ({ page }) => {
  // Go to the test page
  await page.goto('https://blueimp.github.io/jQuery-File-Upload/');

  // Locate the file input
  const fileInput = page.locator("input[name='files[]']");

  // Confirm multiple upload is allowed
  const isMultiple = await fileInput.evaluate(el => (el as HTMLInputElement).multiple);
  console.log(`Multiple selection enabled: ${isMultiple}`);
  expect(isMultiple).toBeTruthy();

  // Build absolute paths for both test files
  const filePath1 = path.resolve('tests/learning/uploadFiles/Pic1.jpg');
  const filePath2 = path.resolve('tests/learning/uploadFiles/Pic2.jpg');

  // Upload both files
  await fileInput.setInputFiles([filePath1, filePath2]);
  console.log('Files selected');

  // Stricter locator: tbody rows containing uploaded files
  const uploadedFilesRows = page.locator('table.table.table-striped tbody tr');

  // Wait until at least 2 rows appear
  await expect(uploadedFilesRows).toHaveCount(2, { timeout: 10000 });

  // Check each row individually
  const firstRow = uploadedFilesRows.nth(0);
  const secondRow = uploadedFilesRows.nth(1);

  await expect(firstRow).toContainText('Pic1.jpg', { timeout: 10000 });
  await expect(secondRow).toContainText('Pic2.jpg', { timeout: 10000 });

  console.log('Files successfully displayed in upload list');
});




/*
test('File upload with multiple selection verification', async ({ page }) => {
  await page.goto('https://blueimp.github.io/jQuery-File-Upload/');
  await page.waitForTimeout(1000);

  const fileInput = page.locator("input[name='files[]']");

  const isMultiple = await fileInput.evaluate(el => el.multiple);
  console.log(`Multiple selection enabled: ${isMultiple}`);
  expect(isMultiple).toBeTruthy();
  await page.waitForTimeout(1000);

  const filePath1 = path.resolve('tests/learning/UploadFiles/Pic1.jpg');
  const filePath2 = path.resolve('tests/learning/UploadFiles/Pic2.jpg');

  await fileInput.setInputFiles([filePath1, filePath2]);
  console.log('Files selected');
  await page.waitForTimeout(1000);

  // Stricter locator: tbody rows
  const uploadedFilesRows = page.locator('table.table.table-striped tbody tr');

  // Wait until at least 2 rows appear
  await expect(uploadedFilesRows).toHaveCount(2, { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Check each row individually
  const firstRow = uploadedFilesRows.nth(0);
  const secondRow = uploadedFilesRows.nth(1);

  await expect(firstRow).toContainText('Pic1.jpg', { timeout: 10000 });
  await page.waitForTimeout(1000);

  await expect(secondRow).toContainText('Pic2.jpg', { timeout: 10000 });
  await page.waitForTimeout(1000);

  console.log('Files successfully displayed in upload list');
});
*/