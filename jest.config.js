/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  testMatch: ['**/tests/**/*.js'],
  clearMocks: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: true,
  // The directory where Jest should output its coverage files
  // coverageDirectory: 'coverage',
  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: 'v8',
  // collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  // A preset that is used as a base for Jest's configuration
};
