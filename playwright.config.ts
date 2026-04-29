import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false, // Set to false for offline tests to avoid network interference
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',

  expect: {
    timeout: 10000,
  },

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    navigationTimeout: 15000,
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    // Ensure service workers are ALLOWED (default is allow, but let's be explicit)
    permissions: ['notifications'], 
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // This is the secret sauce for PWAs in Playwright:
        serviceWorkers: 'allow', 
      },
    },
  ],

  webServer: {
    // CRITICAL: Service Workers require a PRODUCTION build to function
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});