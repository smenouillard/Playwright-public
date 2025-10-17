import { test, expect } from '@playwright/test';

test("Login/Logout", async ({ page }) => {

  // Go to main page
  await page.goto("https://ecommerce-playground.lambdatest.io/");

  // Hover "My Account" in the top navigation bar
  const myAccountMenu = page.locator('a[role="button"].nav-link.dropdown-toggle >> text=My account');
  await myAccountMenu.hover();

  // Click on "Login" in the dropdown
  const loginLink = page.locator('a.dropdown-item:has-text("Login")');
  await loginLink.click();

  // Fill in credentials and submit
  await page.locator("#input-email").fill("timcook@yopmail.com");
  await page.locator("#input-password").fill("Test@1234");
  await page.locator('input[type="submit"][value="Login"]').click();

  // Verify user is logged in (account page)
  await expect(page).toHaveURL("https://ecommerce-playground.lambdatest.io/index.php?route=account/account");

  // Hover "My Account" again after login
  const myAccountMenuAfterLogin = page.locator('a[role="button"].nav-link.dropdown-toggle.active >> text=My account');
  await myAccountMenuAfterLogin.hover();

  // Click on "Logout"
  const logoutLink = page.locator('a.dropdown-item:has-text("Logout")');
  await logoutLink.click();

  // Verify user is logged out (logout page)
  await expect(page).toHaveURL("https://ecommerce-playground.lambdatest.io/index.php?route=account/logout");
})

