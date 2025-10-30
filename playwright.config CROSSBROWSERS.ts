import { PlaywrightTestConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config: PlaywrightTestConfig = {
    // Test selection (optional)
    // testMatch: ["dropdown.test.ts"], // Uncomment to run only specific test files

    // Global settings for all tests
    use: {
        headless: false,                // Run browser in non-headless mode for more authentic testing
        screenshot: "only-on-failure", // Take screenshots only when a test fails
        video: "retain-on-failure"      // Record video only for failing tests
    },

    // Test reporters
    reporter: [
        ["dot"],                                        // Console output reporter (simple progress dots)
        ["json", { outputFile: "jsonReports/jsonReport.json" }], // JSON report saved to a file
        ["html", { open: "always" }]                   // HTML report, opens automatically after test run
    ],

    // Projects for different browsers
    projects: [
        {
            name: 'Chromium',
            use: { ...devices['Desktop Chrome'] }     // Default Chromium browser
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
