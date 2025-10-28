import { test, expect } from '@playwright/test';
import LoginPage from './pom/pom-loginpage';

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
