import { test, expect } from '@playwright/test';

test("Checkbox", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/checkbox-demo")
    const singleCheckbox = page.getByLabel('Click on check box');
    expect(singleCheckbox).not.toBeChecked();
    await singleCheckbox.check();
    expect(singleCheckbox).toBeChecked

})