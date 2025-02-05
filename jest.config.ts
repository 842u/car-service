import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  reporters: ['default', 'github-actions'],

  testPathIgnorePatterns: [
    './node_modules',
    './e2e',
    './resources',
    './next',
    './coverage',
    './playwright',
    './playwright-report',
    './test-results',
  ],

  testEnvironment: 'jsdom',
};

export default createJestConfig(config);
