import { test } from '../fixtures/hoverclickhelper';
import { expect } from '@playwright/test';

test('Navigate via Mega Menu to Printer page', async ({ page, hoverHelper }) => {
  // Navigate to main page
  await page.goto('https://ecommerce-playground.lambdatest.io/');

  // Wait for DOM content
  await page.waitForLoadState('domcontentloaded');

  // Hover "Mega Menu" and click "Printer"
  await hoverHelper(
    'a.icon-left.both.nav-link.dropdown-toggle:has-text("Mega Menu")',
    'a[title="Printer"]',
    'Mega Menu -> Printer'
  );

  // Verify final page URL
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=product/category&path=30');
});
