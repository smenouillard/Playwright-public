import { PlaywrightTestConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // reporters — single flat output folder per run
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'playwright-report/junit.xml' }],
    ['json', { outputFile: 'playwright-report/jsonReport.json' }]
  ],

  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit', use: { ...devices['Desktop Safari'] } },
    { name: 'Edge', use: { ...devices['Desktop Chrome'], channel: 'msedge' } }
  ]
};

export default config;
