import {getEnvVars} from "./get-env-vars";

describe("getEnvVars", () => {
  it("returns chain data for the given CHAIN_ID env var", () => {
    // Arrange
    const expected = 100010;
    process.env.CHAIN_ID = expected.toString();

    // Act
    const actual = getEnvVars();

    // Assert
    expect(expected).toEqual(actual.chainId);
  });

  it("throws if CHAIN_ID is NOT set as an env var", () => {
    // Arrange
    delete process.env.CHAIN_ID;

    // Act + Assert
    expect(() => getEnvVars()).toThrow("Missing env var CHAIN_ID");
  });

  it("throws if CHAIN_ID is NOT valid", () => {
    // Arrange
    process.env.CHAIN_ID = "Some random string";

    // Act + Assert
    expect(() => getEnvVars()).toThrow("Invalid CHAIN_ID value");
  });
});
