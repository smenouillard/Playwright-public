import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/');
  //await page.hover("//a[@data-toggle='dropdown']//span[contains(., 'My account')]")
  await page.locator('a.icon-left.both.nav-link.dropdown-toggle', { hasText: 'My account' }).hover();
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL("https://ecommerce-playground.lambdatest.io/index.php?route=account/login")
  await page.getByRole('textbox', { name: 'E-Mail Address' }).click();
  await page.getByRole('textbox', { name: 'E-Mail Address' }).fill('timcook@yopmail.com');
  await page.getByRole('textbox', { name: 'E-Mail Address' }).click();
  await page.getByRole('textbox', { name: 'E-Mail Address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test@1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: ' Edit your account' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('Kailashnikov');
  await page.getByRole('button', { name: 'Continue' }).click();
  //await page.hover("//a[@data-toggle='dropdown']//span[contains(., 'My account')]")
  //await page.locator('#main-navigation a.icon-left.both.nav-link', { hasText: 'My account' }).hover({ trial: false });
  await page.locator('a.icon-left.both.nav-link.dropdown-toggle', { hasText: 'My account' }).hover();
  await page.getByRole('link', { name: 'Logout', exact: true }).click();
  await expect(page).toHaveURL("https://ecommerce-playground.lambdatest.io/index.php?route=account/logout")
});