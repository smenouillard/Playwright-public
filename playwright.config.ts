import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    //testMatch: ["dropdown.test.ts"],
    use: {
        headless: false,
        screenshot: "on",
        video: "on"
         },
    retries: 0,
    reporter: [["dot"], ["json",{
        outputFile: "jsonReports/jesonReport.json"
    }], ["html", {
    open: "always"
}]]
};

export default config;
