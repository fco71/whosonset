import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['**/__tests__/**/*.test.(js|jsx|ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleDirectories: [
    'node_modules',
    path.join(__dirname, 'src'),
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!(@testing-library|@babel|@jest|@types)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};
