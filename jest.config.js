/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^axios$": require.resolve("axios"),
  },
  modulePathIgnorePatterns: [
    "<rootDir>/lib/",
    "<rootDir>/src/__tests__/fixtures",
  ],
  verbose: true,
};
