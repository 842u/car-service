import dotenv from 'dotenv';
import type { Config } from 'jest';
import nextJest from 'next/jest';

dotenv.config({ path: './.env.test.local' });

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jsdom',
};

export default createJestConfig(config);
