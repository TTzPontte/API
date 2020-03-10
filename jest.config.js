// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  bail: 0,
  clearMocks: true,
  collectCoverageFrom: ['src/**'],

  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  moduleDirectories: ['node_modules', './src/layers/common/node_modules'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'node'],
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  transformIgnorePatterns: ['\\\\node_modules\\\\'],
  setupFilesAfterEnv: ['./config/jest.setup.js'],
  verbose: true,
  coverageThreshold: {
    global: {
      statements: 85,
      lines: 85
    }
  }
};
