import { defineConfig, devices } from '@playwright/test';

// A port of its own, so tests never touch a dev server already on 5173.
const PORT = 4174;
// An explicit IPv4 host: `localhost` lets Vite bind only ::1 while WebKit
// sometimes tries 127.0.0.1 first, failing the odd request under load.
const ORIGIN = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: ORIGIN,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
    // Apple devices in WebKit (Safari's engine). Viewports are what Safari
    // leaves for the page, e.g. a 1440×900 MacBook screen minus browser chrome.
    {
      name: 'macbook',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 790 },
      },
    },
    { name: 'ipad-portrait', use: { ...devices['iPad Pro 11'] } },
    { name: 'ipad-landscape', use: { ...devices['iPad Pro 11 landscape'] } },
    { name: 'iphone', use: { ...devices['iPhone 15'] } },
  ],
  // Tests run against the production build, like the deployed site.
  webServer: {
    command: `pnpm build && pnpm preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: ORIGIN,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
