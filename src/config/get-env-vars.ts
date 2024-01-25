import type {ChainId} from "@vearnfi/config";
import {chains} from "@vearnfi/config";

const chainIds = Object.keys(chains);
// ^ For some reason I cannot import chainIds directly from @vearnfi/config :S

/**
 * Utility function to read and validate environment variables.
 * @return {{
 * chainId: ChainId,
 * }} Environment variables
 */
export function getEnvVars() {
  const chainId = process.env.CHAIN_ID;

  if (chainId == null) {
    throw new Error("Missing env var CHAIN_ID");
  }
  if (!chainIds.includes(chainId)) {
    throw new Error("Invalid CHAIN_ID value");
  }

  return {
    chainId: parseInt(chainId, 10) as ChainId,
  };
}
