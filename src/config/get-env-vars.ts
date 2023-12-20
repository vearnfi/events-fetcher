import type { ChainId } from "@vearnfi/config";

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

  return {
    chainId: parseInt(chainId, 10) as ChainId,
  };
}
