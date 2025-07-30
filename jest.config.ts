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

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

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

  moduleNameMapper: {
    '^@/ui/(.*)$': '<rootDir>/src/features/common/ui/$1',
    '^@/landing/(.*)$': '<rootDir>/src/features/landing/$1',
    '^@/dashboard/(.*)$': '<rootDir>/src/features/dashboard/$1',
    '^@/auth/(.*)$': '<rootDir>/src/features/auth/$1',
    '^@/user/(.*)$': '<rootDir>/src/features/user/$1',
    '^@/car/(.*)$': '<rootDir>/src/features/car/$1',
    '^@/common/(.*)$': '<rootDir>/src/features/common/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
