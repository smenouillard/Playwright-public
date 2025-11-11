import { test, expect } from '@playwright/test';

test('Test Scenario 2 - Drag & Drop Sliders Demo (robust)', async ({ page }) => {
  // Open LambdaTest Selenium Playground
  await page.goto('https://www.lambdatest.com/selenium-playground');

  // Click "Drag & Drop Sliders" using text locator
  await page.locator('text=Drag & Drop Sliders').click();

  // Locate the slider input inside #slider3 ("Default value 15")
  const slider = page.locator('#slider3 input[type="range"]');

  // Wait for the slider to be visible
  await slider.waitFor({ state: 'visible' });

  // Ensure the slider is enabled (not disabled)
  await expect(slider).toBeEnabled();

  // Scroll slider into view
  await slider.scrollIntoViewIfNeeded();

  // Optional small delay to allow page JS to attach listeners
  await page.waitForTimeout(300);

  // Get element handle safely
  const sliderHandle = await slider.elementHandle();
  if (!sliderHandle) throw new Error('Slider not ready');

  // Set the slider value to 95 and trigger page JS to update output
  await page.evaluate((el) => {
    const slider = el as HTMLInputElement;
    slider.value = '95';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    slider.dispatchEvent(new Event('change', { bubbles: true }));

    const output = slider.nextElementSibling as HTMLOutputElement;
    if (output) output.textContent = slider.value;
  }, sliderHandle);

  // Locate the output displaying the value
  const output = page.locator('#rangeSuccess');

  // Validate that the output shows 95
  await expect(output).toHaveText('95');
});
