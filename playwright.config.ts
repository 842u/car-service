import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, './playwright/.auth/user.json');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 5000,
  reporter: [['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    {
      name: 'Auth Setup',
      testMatch: /.*\.setup\.ts/,
      grep: /authenticated/,
    },
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      grep: /@desktop/,
      grepInvert: /@unauthenticated/,
    },
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined,
      },
      grep: /@desktop/,
      grepInvert: /@authenticated/,
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: authFile,
      },
      grep: /@desktop/,
      grepInvert: /@unauthenticated/,
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: undefined,
      },
      grep: /@desktop/,
      grepInvert: /@authenticated/,
    },
    {
      name: 'Desktop Edge',
      use: {
        ...devices['Desktop Edge'],
        storageState: authFile,
      },
      grep: /@desktop/,
      grepInvert: /@unauthenticated/,
    },
    {
      name: 'Desktop Edge',
      use: {
        ...devices['Desktop Edge'],
        storageState: undefined,
      },
      grep: /@desktop/,
      grepInvert: /@authenticated/,
    },
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
        deviceScaleFactor: 1,
        storageState: authFile,
      },
      grep: /@desktop/,
      grepInvert: /@unauthenticated/,
    },
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
        deviceScaleFactor: 1,
        storageState: undefined,
      },
      grep: /@desktop/,
      grepInvert: /@authenticated/,
    },
    {
      name: 'Tablet Chrome',
      use: {
        ...devices['Galaxy Tab S4'],
        viewport: {
          width: 834,
          height: 1194,
        },
        storageState: authFile,
      },
      grep: /@tablet/,
      grepInvert: /@unauthenticated/,
    },
    {
      name: 'Tablet Chrome',
      use: {
        ...devices['Galaxy Tab S4'],
        viewport: {
          width: 834,
          height: 1194,
        },
        storageState: undefined,
      },
      grep: /@tablet/,
      grepInvert: /@authenticated/,
    },
    {
      name: 'Tablet Safari',
      use: {
        ...devices['iPad Pro 11'],
        storageState: authFile,
      },
      grep: /@tablet/,
      grepInvert: /@unauthenticated/,
    },
    {
      name: 'Tablet Safari',
      use: {
        ...devices['iPad Pro 11'],
        storageState: undefined,
      },
      grep: /@tablet/,
      grepInvert: /@authenticated/,
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Galaxy S9+'],
        storageState: authFile,
      },
      grep: /@mobile/,
      grepInvert: /@unauthenticated/,
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Galaxy S9+'],
        storageState: undefined,
      },
      grep: /@mobile/,
      grepInvert: /@authenticated/,
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 15 Pro Max'],
        storageState: authFile,
      },
      grep: /@mobile/,
      grepInvert: /@unauthenticated/,
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 15 Pro Max'],
        storageState: undefined,
      },
      grep: /@mobile/,
      grepInvert: /@authenticated/,
    },
  ],
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run start:test',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
