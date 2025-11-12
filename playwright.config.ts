import { PlaywrightTestConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config: PlaywrightTestConfig = {
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Reporters: HTML + JUnit + JSON
  reporter: [
    ["html", { outputFolder: "reports/html/{projectName}", open: "never" }],
    ["junit", { outputFile: "reports/junit/{projectName}.xml" }],
    ["json", { outputFile: "reports/json/{projectName}.json" }]
  ],

  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit',   use: { ...devices['Desktop Safari'] } },
    { name: 'Edge',     use: { ...devices['Desktop Chrome'], channel: 'msedge' } }
  ]
};

export default config;
