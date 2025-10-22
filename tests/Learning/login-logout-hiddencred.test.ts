// RECORDED USING PLAYWRIGHT CODEGEN
// STABILIZED: explicit waits, console logs, CI-friendly dropdown handling, hover delay
import { test, expect } from '@playwright/test';
import { getCredentials } from '../fixtures/credentials';

test('Login and Logout with hidden credentials - stable', async ({ page }) => {
  // Get credentials from environment
  const { email, password } = getCredentials();
  console.log('Retrieved credentials from environment');

  // Navigate to main page
  console.log('Navigating to main page...');
  await page.goto('https://ecommerce-playground.lambdatest.io/');

  // Hover "My Account" and click "Login"
  const myAccountMenu = page.locator('a[role="button"].nav-link.dropdown-toggle >> text=My account');
  await myAccountMenu.hover();
  console.log('Hovered on "My account"');
  await page.waitForTimeout(150); // small delay to let dropdown animation complete

  const loginLink = page.locator('a.dropdown-item:has-text("Login")');
  await expect(loginLink).toBeVisible({ timeout: 5000 });
  await loginLink.click();
  console.log('Clicked Login');

  // Fill login form
  await page.locator('#input-email').fill(email);
  await page.locator('#input-password').fill(password);
  await page.locator('input[type="submit"][value="Login"]').click();
  console.log('Submitted login form');

  // Verify login success
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/account');
  console.log('Login verified');

  // Hover "My Account" again and click "Logout"
  const myAccountMenuAfterLogin = page.locator('a[role="button"].nav-link.dropdown-toggle.active >> text=My account');
  await myAccountMenuAfterLogin.hover();
  console.log('Hovered on "My account" after login');
  await page.waitForTimeout(150); // small delay to let dropdown animation complete

  const logoutLink = page.locator('a.dropdown-item:has-text("Logout")');
  await expect(logoutLink).toBeVisible({ timeout: 5000 });
  await logoutLink.click();
  console.log('Clicked Logout');

  // Verify logout success
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/logout');
  console.log('Logout verified successfully');
});


/*
test('Login and Logout with hidden credentials', async ({ page }) => {

  // Get credentials from environment
  const { email, password } = getCredentials();

  // Navigate to main page
  await page.goto('https://ecommerce-playground.lambdatest.io/');

  // Hover "My Account" and click "Login"
  const myAccountMenu = page.locator('a[role="button"].nav-link.dropdown-toggle >> text=My account');
  await myAccountMenu.hover();

  const loginLink = page.locator('a.dropdown-item:has-text("Login")');
  await loginLink.waitFor({ state: 'visible' }); // ensure dropdown fully appears
  await loginLink.click();

  // Fill login form
  await page.locator('#input-email').fill(email);
  await page.locator('#input-password').fill(password);
  await page.locator('input[type="submit"][value="Login"]').click();

  // Verify login success
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/account');

  // Hover "My Account" again and click "Logout"
  const myAccountMenuAfterLogin = page.locator('a[role="button"].nav-link.dropdown-toggle.active >> text=My account');
  await myAccountMenuAfterLogin.hover();

  const logoutLink = page.locator('a.dropdown-item:has-text("Logout")');
  await logoutLink.waitFor({ state: 'visible' }); // ensure dropdown fully appears
  await logoutLink.click();

  // Verify logout success
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/logout');
});
*/


/* test('Login and Logout with hidden credentials', async ({ page }) => {
  // Get credentials from environment
  const { email, password } = getCredentials();

  // Navigate to main page
  await page.goto('https://ecommerce-playground.lambdatest.io/');

  // Hover "My Account" and click "Login"
  const myAccountMenu = page.locator('a[role="button"].nav-link.dropdown-toggle >> text=My account');
  await myAccountMenu.hover();
  await page.locator('a.dropdown-item:has-text("Login")').click();

  // Fill login form
  await page.locator('#input-email').fill(email);
  await page.locator('#input-password').fill(password);
  await page.locator('input[type="submit"][value="Login"]').click();

  // Verify login success
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/account');

  // Hover "My Account" again and click "Logout"
  const myAccountMenuAfterLogin = page.locator('a[role="button"].nav-link.dropdown-toggle.active >> text=My account');
  await myAccountMenuAfterLogin.hover();
  await page.locator('a.dropdown-item:has-text("Logout")').click();

  // Verify logout success
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/logout');
});

*/