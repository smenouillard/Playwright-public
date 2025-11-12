import { PlaywrightTestConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
      outputDir: 'playwright-report/Chromium'
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
      outputDir: 'playwright-report/Firefox'
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
      outputDir: 'playwright-report/WebKit'
    },
    {
      name: 'Edge',
      use: { ...devices['Desktop Chrome'], channel: 'msedge' },
      outputDir: 'playwright-report/Edge'
    }
  ],

  reporter: [
    ['html', { open: 'never' }], // Will respect per-project outputDir
    ['junit', { outputFile: 'junit.xml' }], // Saved inside each project folder
    ['json', { outputFile: 'jsonReport.json' }] // Saved inside each project folder
  ]
};

export default config;
