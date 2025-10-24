import { test, expect } from '@playwright/test';

// RECORDED USING PLAYWRIGHT CODEGEN
// STABILIZED: dropdown waits and explicit visibility checks added
test('Login, edit profile, and logout - stable version', async ({ page }) => {
  console.log('Navigating to LambdaTest eCommerce playground...');
  await page.goto('https://ecommerce-playground.lambdatest.io/');

  // Hover on "My account" to open dropdown
  const myAccount = page.locator('a.icon-left.both.nav-link.dropdown-toggle', { hasText: 'My account' });
  await myAccount.hover();
  console.log('Hovered on "My account"');

  // Click on "Login"
  const loginLink = page.getByRole('link', { name: 'Login' });
  await expect(loginLink).toBeVisible({ timeout: 5000 });
  await loginLink.click();
  console.log('Clicked on Login');

  // Verify login page
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');

  // Fill login form
  const emailInput = page.getByRole('textbox', { name: 'E-Mail Address' });
  await emailInput.fill('timcook@yopmail.com');
  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await passwordInput.fill('Test@1234');
  await page.getByRole('button', { name: 'Login' }).click();
  console.log('Logged in successfully');

  // Go to Edit Account
  const editAccountLink = page.getByRole('link', { name: ' Edit your account' });
  await expect(editAccountLink).toBeVisible({ timeout: 5000 });
  await editAccountLink.click();

  // Update First Name
  const firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
  await firstNameInput.fill('Kailashnikov');
  await page.getByRole('button', { name: 'Continue' }).click();
  console.log('Updated first name successfully');

  // Hover on "My account" again for logout
  await myAccount.hover();
  console.log('Hovered on "My account" for logout');

  // Wait for "Logout" link to appear and click
  const logoutLink = page.getByRole('link', { name: 'Logout', exact: true });
  await expect(logoutLink).toBeVisible({ timeout: 5000 }); // ensures dropdown is open
  await logoutLink.click();
  console.log('Clicked on Logout');

  // Verify logout page
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/logout');
  console.log('Logout verified successfully');
});


//RECORDED USING PLAYWRIGHT CODEGEN
/*
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
*/