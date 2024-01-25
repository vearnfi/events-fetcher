import {getEnvVars} from "./get-env-vars";

describe("getEnvVars", () => {
  it("returns all environment variables", () => {
    // Arrange
    const chainId = 100010;
    const discordUrl =  "https://some-url.com"
    process.env.CHAIN_ID = chainId.toString();
    process.env.DISCORD_WEBHOOK_URL = discordUrl

    // Act
    const actual = getEnvVars();

    // Assert
    expect(actual.CHAIN_ID).toEqual(chainId);
    expect(actual.DISCORD_WEBHOOK_URL).toEqual(discordUrl);
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

    it("throws if DISCORD_WEBHOOK_URL is NOT set as an env var", () => {
    // Arrange
    process.env.CHAIN_ID = "100010";
    delete process.env.DISCORD_WEBHOOK_URL;

    // Act + Assert
    expect(() => getEnvVars()).toThrow("Missing env var DISCORD_WEBHOOK_URL");
  });
});
