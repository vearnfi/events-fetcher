import { chain } from "../config/index";

/**
 * Get latest block number from consumer service.
 * @return {number} Latest block number.
 */
export async function getHead(): Promise<number> {
  try {
    const response = await fetch(chain.getHeadEndpoint);

    const json = (await response.json()) as { lastBlockNumber: number };

    return json.lastBlockNumber;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
