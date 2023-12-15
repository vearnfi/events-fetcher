import { ChainId } from "@vearnfi/config";

/**
 * Utility function to read and validate environment variables.
 * @return {{
 * CHAIN_ID: ChainId,
 * }} Environment variables
 */
export function getEnvVars() {
  const CHAIN_ID = process.env.CHAIN_ID;

  if (CHAIN_ID == null) {
    throw new Error("Missing env var CHAIN_ID");
  }

  return {
    CHAIN_ID: parseInt(CHAIN_ID, 10) as ChainId,
  };
}
