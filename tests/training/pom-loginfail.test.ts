import { test, expect } from '@playwright/test';
import LoginPage from './pom/pom-loginpage';

test('Login fails with invalid credentials (handles throttling)', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();

  // Attempt login with invalid credentials
  await loginPage.login('wrong@user.com', 'wrongpassword');

  // Assert error alert is visible
  const isVisible = await loginPage.isLoginErrorVisible();
  expect(isVisible).toBe(true);

  // Get the error message text
  const errorText = await loginPage.getLoginErrorText();

  // Check which error we got
  if (errorText.includes('Warning: No match for E-Mail Address and/or Password.')) {
    console.log('Login failed due to invalid credentials.');
  } else if (errorText.includes('Warning: Your account has exceeded allowed number of login attempts')) {
    console.log('Login failed due to too many attempts. Account is temporarily locked.');
  } else {
    console.log(`Unexpected login error message: "${errorText}"`);
  }

  // Assert that the message is one of the expected ones
  expect(errorText).toMatch(
    /(Warning: No match for E-Mail Address and\/or Password.|Warning: Your account has exceeded allowed number of login attempts)/
  );
});





/*
test('Login fails with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();

  // Attempt login with invalid credentials
  await loginPage.login('wrong@user.com', 'wrongpassword');

  // Assert error alert is visible
  expect(await loginPage.isLoginErrorVisible()).toBe(true);

  // Assert error message text
  expect(await loginPage.getLoginErrorText()).toContain(
    'Warning: No match for E-Mail Address and/or Password.'
  );
});
*/