import { test, expect } from '@playwright/test';

test('handling alerts', async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo")
    
    page.on("dialog", async (alert) => {
        const text = alert.message();
        console.log(text);
        await alert.dismiss();
    })
    
    //await page.locator("button:has-text('Click Me')").nth(0).click()
    const buttonconfirm = page.locator('p:has-text("Confirm box:") >> button')
    await buttonconfirm.click();
    expect(page.locator("#confirm-demo")).toContainText("You pressed Cancel!")

})