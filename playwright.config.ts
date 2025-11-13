import { PlaywrightTestConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config: PlaywrightTestConfig = {
    // Test selection (optional)
    // testMatch: ["dropdown.test.ts"],

    // Global settings
    use: {
        headless: false,
        screenshot: "only-on-failure",
        video: "retain-on-failure"
    },

    // Reporters: JSON + HTML + JUnit
    reporter: [
        ["json", { outputFile: "jsonReports/jsonReport.json" }],
        ["html", { outputFolder: "playwright-report", open: "never" }],
        ["junit", { outputFile: "junit/test-results.xml" }]
    ],

    // Browser projects
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
