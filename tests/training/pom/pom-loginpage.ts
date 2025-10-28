import { Page, Locator } from '@playwright/test';

// Page Object Model for the Login Page
export default class LoginPage {
  readonly page: Page;

  // ---------------------------
  // Locators for the DOM elements
  // ---------------------------
  readonly emailInput: Locator;               // "E-mail address" input field
  readonly passwordInput: Locator;            // "Password" input field
  readonly loginButton: Locator;              // "Login" button
  readonly forgottenPasswordLink: Locator;   // "Forgotten password" link
  readonly loginErrorAlert: Locator;          // Error message when login fails
  readonly accountHeading: Locator;           // Unique heading on the account page

  // ---------------------------
  // Constructor
  // ---------------------------
  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('#input-email');
    this.passwordInput = page.locator('#input-password');
    this.loginButton = page.locator("input[value='Login']");
    this.forgottenPasswordLink = page.locator("a[href*='forgotten']");
    this.loginErrorAlert = page.locator('.alert-danger'); 
    this.accountHeading = page.locator('h2:has-text("My Account")'); // verify post-login
  }

  // ---------------------------
  // Page Actions
  // ---------------------------

  // Navigate to the login page
  async goto() {
    await this.page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');
  }

  // Fill in email and password, then click login
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Click the "Forgotten password" link
  async clickForgottenPassword() {
    await this.forgottenPasswordLink.click();
  }

  // ---------------------------
  // Page State / Validation
  // ---------------------------

  // Check if login was successful by verifying URL and heading
  async isLoginSuccessful(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle'); // ensure page fully loads
    const urlOk = this.page.url().includes('route=account/account');
    const headingVisible = await this.accountHeading.isVisible();
    return urlOk && headingVisible;
  }

  // Check if login error alert is visible
  async isLoginErrorVisible(): Promise<boolean> {
    return this.loginErrorAlert.isVisible();
  }

  // Get login error text
  async getLoginErrorText(): Promise<string> {
    const text = await this.loginErrorAlert.textContent(); // await added
    return text ?? ''; // safely return empty string if null
  }
}
