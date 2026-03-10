import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  reporters: ['default', 'github-actions'],

  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/e2e',
    '<rootDir>/resources',
    '<rootDir>/.next',
    '<rootDir>/coverage',
    '<rootDir>/playwright',
    '<rootDir>/playwright-report',
    '<rootDir>/test-results',
  ],

  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@/icons/(.*)$':
      '<rootDir>/src/common/presentation/ui/decorative/icons/$1',
    '^@/ui/(.*)$': '<rootDir>/src/common/presentation/ui/$1',
    '^@/landing/(.*)$': '<rootDir>/src/module/landing/$1',
    '^@/dashboard/(.*)$': '<rootDir>/src/module/dashboard/$1',
    '^@/user/(.*)$': '<rootDir>/src/module/user/$1',
    '^@/car/(.*)$': '<rootDir>/src/module/car/$1',
    '^@/common/(.*)$': '<rootDir>/src/common/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
