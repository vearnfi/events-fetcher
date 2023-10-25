import {getNetworkConfig} from '../config/index';
import {getEnvVars} from '../config/get-env-vars'

const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(CHAIN_ID);

export async function getHead(): Promise<number> {
  try {
    const response = await fetch(networkConfig.getHeadEndpoint);
    console.log({response})
    const json = await response.json() as {lastBlockNumber: number};
    console.log({json})
    return json.lastBlockNumber;
  } catch (error) {
    console.log({error})
    return 0;
  }
}
