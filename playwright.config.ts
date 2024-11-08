import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * * As for playwright v1.48.2, playwright will run projects that have dependencies list last.
 * * To not interfere with test user token by deleting and creating test user,
 * * leave projects that use auth token without dependencies so they run first.
 */

const authFile = path.join(__dirname, './playwright/.auth/user.json');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 7000,
  reporter: [['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    {
      name: 'Auth Setup',
      testMatch: /.*\.setup\.ts/,
      grep: /@authenticated/,
      grepInvert: /@unauthenticated/,
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
      dependencies: ['Auth Setup'],
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
      dependencies: ['Auth Setup'],
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
      dependencies: ['Auth Setup'],
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
      dependencies: ['Auth Setup'],
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
      dependencies: ['Auth Setup'],
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
      dependencies: ['Auth Setup'],
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
      dependencies: ['Auth Setup'],
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
      dependencies: ['Auth Setup'],
    },
  ],
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run start:test',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
