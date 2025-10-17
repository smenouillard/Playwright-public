import { test, expect } from '@playwright/test';

test('Interaction with inputs', async ({ page }) => {

await page.goto ("https://www.lambdatest.com/selenium-playground/simple-form-demo")
const messageInput = page.locator("input#user-message");
await messageInput.scrollIntoViewIfNeeded();
console.log(await messageInput.getAttribute("placeholder"));
expect(messageInput).toHaveAttribute("placeholder", "Please enter your Message")
console.log("Before entering data: " + await messageInput.inputValue());
await messageInput.type("Hi Sly"); 
console.log("After enteting data: " + await messageInput.inputValue());

})

test("Sum", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/simple-form-demo");
    const sum1input = page.locator("#sum1")
    const sum2input = page.locator("#sum2")
    
    const getValuesBtn = page.locator("form#gettotal>button")
    let num1 = 121
    let num2 = 546
    await sum1input.type("" + num1);
    await sum2input.type("" + num2);
    await getValuesBtn.click() 
    const result = page.locator("#addmessage")
    console.log(await result.textContent());
    let expectedResult = num1 + num2;
    expect(result).toHaveText(""+ expectedResult)
})