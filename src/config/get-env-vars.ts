import type {ChainId} from './index';

/**
 * Utility function to read and validate environment variables.
 * @return {{
 * CHAIN_ID: ChainId,
 * }} Environment variables
 */
export function getEnvVars() {
  const CHAIN_ID = process.env.CHAIN_ID as unknown as ChainId;

  if (CHAIN_ID == null) {
    throw new Error("Missing env var CHAIN_ID");
  }

  return {
    CHAIN_ID,
  };
}
