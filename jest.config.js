/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  coverageProvider: "v8",
  collectCoverageFrom: ["src/**/*.ts"],
  moduleNameMapper: {
    "^axios$": require.resolve("axios"),
  },
  modulePathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/src/__tests__/fixtures",
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/index.ts',
    '<rootDir>/src/config/index.ts',
    '<rootDir>/src/controllers/index.ts',
    '<rootDir>/src/data-access/index.ts',
    '<rootDir>/src/typings/global.d.ts',
    '<rootDir>/src/use-cases/index.ts',
  ],
  verbose: true,
};
