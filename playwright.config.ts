import { PlaywrightTestConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config: PlaywrightTestConfig = {
    // Global settings for all tests
    use: {
        headless: false,                // Run browser in non-headless mode for more authentic testing
        screenshot: "only-on-failure",  // Take screenshots only when a test fails
        video: "retain-on-failure"      // Record video only for failing tests
    },

    // Test reporters
    reporter: [
        ["dot"],                                        // Console output reporter
        ["json", { outputFile: "jsonReports/jsonReport.json" }], // JSON report
        ["html", { outputFolder: "playwright-report", open: "never" }], // HTML report
        ["junit", { outputFile: "playwright-report/junit.xml" }]       // JUnit XML report for badges
    ],

    // Projects for different browsers
    projects: [
        {
            name: 'Chromium',
            use: { ...devices['Desktop Chrome'] }     // Chromium
        },
        {
            name: 'Firefox',
            use: { ...devices['Desktop Firefox'] }    // Firefox
        },
        {
            name: 'WebKit',
            use: { ...devices['Desktop Safari'] }     // Safari
        },
        {
            name: 'Edge',
            use: { ...devices['Desktop Chrome'], channel: 'msedge' } // Microsoft Edge
        }
    ]
};

export default config;
