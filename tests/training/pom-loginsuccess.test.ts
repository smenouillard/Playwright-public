import { test, expect } from '@playwright/test';
import LoginPage from './pom/pom-loginpage';
import * as dotenv from 'dotenv';

dotenv.config(); // Load TEST_USER and TEST_PASSWORD from .env

test('Login successful with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();

  // Perform login with credentials from .env
  await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASSWORD!);

  // Assert we reached the correct page
  expect(await loginPage.isLoginSuccessful()).toBe(true);
});
