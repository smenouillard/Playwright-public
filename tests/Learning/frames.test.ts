import { test, expect } from '@playwright/test';

test('Fill first name, last name, and email in separate frames', async ({ page }) => {

  // Navigate to the LetCode frame page
  await page.goto('https://letcode.in/frame');

  // Count all frames
  const frames = page.frames();
  console.log(`Number of frames: ${frames.length}`);
  await expect(frames.length).toBeGreaterThan(0);

  // --- Parent frame: #firstFr ---
  const parentFrame = page.frameLocator('#firstFr');
  const firstName = 'Sylvestre';
  const lastName = 'Men';

  // Fill first and last name
  await parentFrame.locator("input[name='fname']").fill(firstName);
  await parentFrame.locator("input[name='lname']").fill(lastName);

  // Verify first and last name
  await expect(parentFrame.locator("input[name='fname']")).toHaveValue(firstName);
  await expect(parentFrame.locator("input[name='lname']")).toHaveValue(lastName);

  // Verify displayed message
  const expectedText = `You have entered ${firstName} ${lastName}`;
  await expect(parentFrame.locator('p.title.has-text-info')).toHaveText(expectedText);

  // --- Nested frame inside parent: iframe[src='innerframe'] ---
  const nestedFrame = parentFrame.frameLocator("iframe[src='innerframe']");
  const email = 'test@test.test';

  // Fill email input
  await nestedFrame.locator("input[name='email']").fill(email);

  // Verify email
  await expect(nestedFrame.locator("input[name='email']")).toHaveValue(email);

});