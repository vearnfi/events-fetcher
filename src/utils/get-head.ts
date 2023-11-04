import {getNetworkConfig} from '../config/index';
import {getEnvVars} from '../config/get-env-vars'

const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(CHAIN_ID);

/**
 * Get latest block number from consumer service.
 * @return {number} Latest block number.
 */
export async function getHead(): Promise<number> {
  try {
    const response = await fetch(networkConfig.getHeadEndpoint);

    const json = await response.json() as {lastBlockNumber: number};

    return json.lastBlockNumber;
  } catch (error) {
    console.error(error)
    return 0;
  }
}
