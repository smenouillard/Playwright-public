import { test, expect, Page } from '@playwright/test';

// ------------------------------------------------------------
// Helper: CI-stable hover + click for dropdown links
// ------------------------------------------------------------
export async function hoverAndClickGlobal(
  page: Page,
  hoverSelector: string,
  clickSelector: string,
  label: string
): Promise<void> {
  console.log(`Clicking "${label}"...`);

  // Hover parent to reveal dropdown
  await page.locator(hoverSelector).hover({ force: true });
  await page.waitForTimeout(500); // wait for dropdown animation

  // Wait for link to appear globally
  const clickTarget = page.locator(clickSelector);
  await clickTarget.waitFor({ state: 'visible', timeout: 15000 });

  // Click reliably
  await clickTarget.click({ force: true });

  console.log(`Clicked "${label}" -> ${clickSelector}`);
}

// ------------------------------------------------------------
// Test: Login, edit profile, and logout - CI-stable version
// ------------------------------------------------------------
test('Login, edit profile, and logout - CI hardened version', async ({ page }) => {
  // Print browser console messages
  page.on('console', msg => {
    const text = msg.text();
    // Ignore autocomplete warnings to reduce log noise
    if (text.includes('Input elements should have autocomplete attributes')) return;
    console.log('BROWSER LOG:', text);
  });

  // Navigate to site
  console.log('Navigating to LambdaTest eCommerce playground...');
  await page.goto('https://ecommerce-playground.lambdatest.io/', { waitUntil: 'domcontentloaded' });

  // Click Login through dropdown
  await hoverAndClickGlobal(
    page,
    'a.icon-left.both.nav-link.dropdown-toggle:has-text("My account")',
    'a:has-text("Login")',
    'My account (login)'
  );

  // Verify login page
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');

  // Fill login form
  await page.getByRole('textbox', { name: 'E-Mail Address' }).fill('timcook@yopmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test@1234');
  await page.getByRole('button', { name: 'Login' }).click();
  console.log('Logged in successfully');

  // Go to Edit Account
  const editAccountLink = page.getByRole('link', { name: ' Edit your account' });
  await expect(editAccountLink).toBeVisible({ timeout: 8000 });
  await editAccountLink.click();

  // Update First Name
  await page.getByRole('textbox', { name: 'First Name *' }).fill('Kailashnikov');
  await page.getByRole('button', { name: 'Continue' }).click();
  console.log('Updated first name successfully');

  // Click Logout through dropdown
  await hoverAndClickGlobal(
    page,
    'a.icon-left.both.nav-link.dropdown-toggle:has-text("My account")',
    'a.icon-left.both.dropdown-item:has-text("Logout")',
    'My account (logout)'
  );

  // Verify logout page
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/logout');
  console.log('Logout verified successfully');
});







/*
// WORKED 80% OF THE TIME IN CI
// CI-proof version: hover + wait + scroll + force click for logout
test('Login, edit profile, and logout - fully stable', async ({ page }) => {
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

  // Hover on "My account" again to reveal logout
  await myAccount.hover();
  console.log('Hovered on "My account" for logout');

  // Locate "Logout" link globally
  const logoutLink = page.getByRole('link', { name: 'Logout', exact: true });

  // Wait until visible AND enabled
  await expect(logoutLink).toBeVisible({ timeout: 15000 });
  await expect(logoutLink).toBeEnabled({ timeout: 15000 });

  // Scroll into view
  await logoutLink.scrollIntoViewIfNeeded();

  // Click logout reliably
  await logoutLink.click({ force: true });
  console.log('Clicked on Logout');

  // Verify logout page
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/logout');
  console.log('Logout verified successfully');
});




/*
// INITIALLY RECORDED USING PLAYWRIGHT CODEGEN
// STABILIZED: waits, visibility checks, and CI-proof logout
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

  // Hover on "My account" again to reveal logout
  await myAccount.hover();
  console.log('Hovered on "My account" for logout');

  // Locate "Logout" link globally and wait until visible
  const logoutLink = page.getByRole('link', { name: 'Logout', exact: true });
  await logoutLink.waitFor({ state: 'visible', timeout: 10000 });

  // Click logout reliably
  await logoutLink.click();
  console.log('Clicked on Logout');

  // Verify logout page
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/logout');
  console.log('Logout verified successfully');
});
*/





/*
// INITIALLY RECORDED USING PLAYWRIGHT CODEGEN
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
*/


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