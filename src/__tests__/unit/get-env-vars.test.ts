import { getEnvVars } from "../../config/get-env-vars";

describe("getEnvVars", () => {
  it("returns chain data for the given CHAIN_ID env var", () => {
    // Arrange
    const expected = 100010
    process.env.CHAIN_ID = expected.toString()

    // Act
    const actual = getEnvVars()

    // Assert
    expect(expected).toEqual(actual.chainId)
  })

  xit("throws if CHAIN_ID is NOT set as an env var", () => {
    // Arrange

    // Act + Assert
    expect(getEnvVars()).toThrow("Missing env var CHAIN_ID");
  })
})
