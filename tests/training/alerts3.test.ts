import { test, expect } from '@playwright/test';

test('Prompt dialog test', async ({ page }) => {
  // 1️⃣ Go to the test page
  await page.goto('https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo');

  // 2️⃣ Handle the prompt dialog before clicking the button
  page.once('dialog', async (dialog) => {
    // Ensure it is a prompt
    expect(dialog.type()).toBe('prompt');

    // Type the text and click OK
    await dialog.accept('Hello Sylvain!');
  });

  // 3️⃣ Click the button inside the paragraph containing "Prompt Box"
  const button = page.locator('p:has-text("Prompt Box") >> button');
  await button.click();

  // 4️⃣ Verify that the typed text appears on the page
  const result = page.locator('#prompt-demo'); // the page shows text here
  await expect(result).toContainText('Hello Sylvain!');
  console.log('Prompt test completed, text verified on the page.');
});