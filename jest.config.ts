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

  reporters: [['github-actions', { silent: false }], 'summary'],

  testPathIgnorePatterns: ['./node_modules', './e2e'],

  testEnvironment: 'jsdom',
};

export default createJestConfig(config);
