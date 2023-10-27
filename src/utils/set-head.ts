import {getNetworkConfig} from '../config/index';
import {getEnvVars} from '../config/get-env-vars'

const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(CHAIN_ID);

const postOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
}

/**
 * Store lastBlockNumber into DB via endpoint call.
 * @param {number} lastBlockNumber Latest block number.
 */
export async function setHead(lastBlockNumber: number): Promise<void> {
  const response = await fetch(networkConfig.setHeadEndpoint, {
    ...postOptions,
    body: JSON.stringify({lastBlockNumber}),
  });

  const body = await response.text();
  console.log(body);
}
