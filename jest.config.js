module.exports = {
  'roots': [
    '<rootDir>/test',
    '<rootDir>/api'
  ],
  'globalSetup': '<rootDir>/test/jestGlobalSetup.ts',
  'globalTeardown': '<rootDir>/test/jestGlobalTeardown.ts',
  'clearMocks': true,
  'testEnvironment': 'node',
  'testMatch': [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  'transform': {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
};
