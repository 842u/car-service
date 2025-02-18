import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  timeout: 20000,
  reporter: [['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run start:local',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
      grep: /@desktop/,
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@desktop/,
    },
    {
      name: 'Desktop Edge',
      use: { ...devices['Desktop Edge'] },
      grep: /@desktop/,
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'], deviceScaleFactor: 1 },
      grep: /@desktop/,
    },
    {
      name: 'Tablet Chrome',
      use: {
        ...devices['Galaxy Tab S4'],
        viewport: {
          width: 834,
          height: 1194,
        },
      },
      grep: /@tablet/,
    },
    {
      name: 'Tablet Safari',
      use: { ...devices['iPad Pro 11'] },
      grep: /@tablet/,
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Galaxy S9+'] },
      grep: /@mobile/,
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 15 Pro Max'] },
      grep: /@mobile/,
    },
  ],
});
