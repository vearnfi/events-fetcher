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

export async function setHead(lastBlockNumber: number): Promise<void> {
  console.log({setHead: lastBlockNumber})
      const response = await fetch(networkConfig.setHeadEndpoint, {
      ...postOptions,
      body: JSON.stringify({lastBlockNumber}),
    });

    const body = await response.text();

    console.log(body);
}
