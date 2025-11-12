import { PlaywrightTestConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config: PlaywrightTestConfig = {
  // Global settings for all tests
  use: {
    headless: false,                // Run browser in non-headless mode
    screenshot: "only-on-failure",  // Take screenshots only on failure
    video: "retain-on-failure"      // Record video only on failure
  },

  // Top-level reporter configuration with per-project output using {projectName}
  reporter: [
    ["html", { outputFolder: "playwright-report/{projectName}", open: "never" }],
    ["junit", { outputFile: "playwright-report/{projectName}/junit.xml" }],
    ["json", { outputFile: "playwright-report/{projectName}/jsonReport.json" }]
  ],

  // Projects for different browsers
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Edge',
      use: { ...devices['Desktop Chrome'], channel: 'msedge' }
    }
  ]
};

export default config;