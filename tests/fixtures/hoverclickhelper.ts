import { test as baseTest, Page } from '@playwright/test';

// ---------------------------
// Fixture type definition
// ---------------------------
type HoverClickHelperTest = {
  hoverHelper: (hoverSelector: string, clickSelector: string, label: string) => Promise<void>;
};

// ---------------------------
// Custom fixture: hoverHelper
// ---------------------------
export const test = baseTest.extend<HoverClickHelperTest>({
  hoverHelper: async ({ page }, use) => {
    // Provide a function to reliably hover and click on dropdown links
    await use(async (hoverSelector, clickSelector, label) => {
      console.log(`Hovering and clicking "${label}"...`);

      const hoverTarget = page.locator(hoverSelector);

      // Hover parent to reveal dropdown
      await hoverTarget.hover({ force: true });
      await page.waitForTimeout(500); // wait for dropdown animation

      // Wait for the link to appear globally
      const clickTarget = page.locator(clickSelector);
      await clickTarget.waitFor({ state: 'visible', timeout: 15000 });

      // Click reliably
      await clickTarget.click({ force: true });

      console.log(`Clicked "${label}" -> ${clickSelector}`);
    });
  }
});
