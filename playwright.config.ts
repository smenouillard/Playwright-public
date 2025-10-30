import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config: PlaywrightTestConfig = {
    // Test selection (optional)
    // testMatch: ["dropdown.test.ts"], // Uncomment to run only specific test files

    // Global settings for all tests
    use: {
        headless: false,                                 // Run browser in non-headless mode for more authentic testing
        screenshot: "only-on-failure",                  // Take screenshots only when a test fails
        video: "on"                                     // Always record video
    },

    // Retry policy (controlled per test, not globally)
    // retries: 0,                                     // Removed, retries can be set in individual tests

    // Test reporters
    reporter: [
        ["dot"],                                        // Console output reporter (simple progress dots)
        ["json", { outputFile: "jsonReports/jsonReport.json" }], // JSON report saved to a file
        ["html", { open: "always" }]                   // HTML report, opens automatically after test run
    ]
};

export default config;
