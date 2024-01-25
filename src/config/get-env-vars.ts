import type {ChainId} from "@vearnfi/config";
import {chains} from "@vearnfi/config";

const chainIds = Object.keys(chains);
// ^ For some reason I cannot import chainIds directly from @vearnfi/config :S

/**
 * Utility function to read and validate environment variables.
 * @return {{
 * CHAIN_ID: ChainId,
 * }} Environment variables
 */
export function getEnvVars() {
  const {CHAIN_ID, DISCORD_WEBHOOK_URL} = process.env;

  if (CHAIN_ID == null) {
    throw new Error("Missing env var CHAIN_ID");
  }
  if (!chainIds.includes(CHAIN_ID)) {
    throw new Error("Invalid CHAIN_ID value");
  }
  if (DISCORD_WEBHOOK_URL == null) {
    throw new Error("Missing env var DISCORD_WEBHOOK_URL");
  }

  return {
    CHAIN_ID: parseInt(CHAIN_ID, 10) as ChainId,
    DISCORD_WEBHOOK_URL,
  };
}
