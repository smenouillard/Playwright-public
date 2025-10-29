import { test, expect, Page } from '@playwright/test';
import generalsData from './data/generals.json';

// ---------------------------
// Utility: pick a random ancient general
// ---------------------------
function pickRandomGeneral() {
  const generals: string[] = generalsData.generals;
  const randomIndex = Math.floor(Math.random() * generals.length);
  return generals[randomIndex];
}

// ---------------------------
// Test: Wikipedia search for random ancient general
// ---------------------------
test('Wikipedia search for random ancient general - CI proof', async ({ page }) => {
  // Pick a random ancient general
  const generalName = pickRandomGeneral();
  console.log(`Searching for: ${generalName}`);

  // Navigate to English Wikipedia
  await page.goto('https://en.wikipedia.org');
  console.log('Navigated to English Wikipedia');

  // Wait for search input to be visible (CI-proof locator)
  const searchInput = page.locator("input[accesskey='f']");
  await expect(searchInput).toBeVisible({ timeout: 10000 });

  // Fill the search input
  await searchInput.fill(generalName);
  console.log(`Filled search input with "${generalName}"`);

  // Submit search
  await searchInput.press('Enter');
  console.log('Search submitted');

  // Wait for the page heading to appear
  const heading = page.locator('#firstHeading');
  await expect(heading).toBeVisible({ timeout: 10000 });

  // Verify heading contains the general's name (CI-proof)
  await expect(heading).toContainText(generalName, { timeout: 10000 });
  console.log(`Verified page heading contains "${generalName}"`);

  // Verify URL contains general's name (spaces replaced with underscores)
  const expectedUrlPart = generalName.replace(/ /g, '_');
  await expect(page).toHaveURL(new RegExp(expectedUrlPart), { timeout: 10000 });
  console.log(`Verified URL contains "${expectedUrlPart}"`);
});






/*
// ---------------------------
// Utility: pick a random ancient general
// ---------------------------
function pickRandomGeneral() {
  const generals: string[] = generalsData.generals;
  const randomIndex = Math.floor(Math.random() * generals.length);
  return generals[randomIndex];
}

test('Wikipedia search for random ancient general - CI proof', async ({ page }) => {
  // Pick a random ancient general
  const generalName = pickRandomGeneral();
  console.log(`Searching for: ${generalName}`);

  // Navigate to English Wikipedia
  await page.goto('https://en.wikipedia.org');
  console.log('Navigated to English Wikipedia');

  // Wait for search input to be visible (CI-proof locator)
  const searchInput = page.locator("input[accesskey='f']");
  await expect(searchInput).toBeVisible({ timeout: 10000 });

  // Fill the search input
  await searchInput.fill(generalName);
  console.log(`Filled search input with "${generalName}"`);

  // Submit search
  await searchInput.press('Enter');
  console.log('Search submitted');

  // Wait for the page heading to appear
  const heading = page.locator('#firstHeading');
  await expect(heading).toBeVisible({ timeout: 10000 });

  // Verify heading matches the general's name
  await expect(heading).toHaveText(generalName, { timeout: 10000 });
  console.log(`Verified page heading is "${generalName}"`);

  // Verify URL contains general's name (spaces replaced with underscores)
  const expectedUrlPart = generalName.replace(/ /g, '_');
  await expect(page).toHaveURL(new RegExp(expectedUrlPart), { timeout: 10000 });
  console.log(`Verified URL contains "${expectedUrlPart}"`);
});
*/