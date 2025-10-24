import { test, expect } from '@playwright/test';

test('Dropdown search and select India (exact match)', async ({ page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/jquery-dropdown-search-demo');

  // 1️⃣ Open the country dropdown by its unique container ID
  const countryDropdown = page.locator('span#select2-country-container').locator('..'); // parent span is clickable
  await countryDropdown.click();
  await page.waitForTimeout(2000);

  // 2️⃣ Type "India" in the search input scoped to the dropdown
  const searchInput = page.locator('span.select2-dropdown:visible input.select2-search__field');
  await searchInput.fill('India');
  await page.waitForTimeout(2000);

  // 3️⃣ Select "India" from the results (exact text match)
  const indiaOption = page.locator('span.select2-dropdown:visible li.select2-results__option', { hasText: /^India$/ });
  await indiaOption.click();
  await page.waitForTimeout(2000);

  // 4️⃣ Verify "India" is selected
  const selectedValue = page.locator('#select2-country-container');
  await expect(selectedValue).toHaveText('India');
});


