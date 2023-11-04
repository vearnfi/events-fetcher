import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet } from '@vechain/connex-driver'
import {getNetworkConfig } from '../config/index';
import type { NetworkConfig} from '../config/index';
import {getEnvVars} from '../config/get-env-vars'
import {ConnexUtils } from '../blockchain/connex-utils'
import type {Contract } from '../blockchain/connex-utils'
import * as vthoArtifact from "../abis/Energy.json";
import * as traderArtifact from "../abis/Trader.json";
import {AbiItem} from "../typings/types";

export type Connection = {
  networkConfig: NetworkConfig,
  connexUtils: ConnexUtils,
  /** Reference to the VTHO contract. */
  vtho: Contract,
  /** Reference to the Trader contract. */
  trader: Contract,
}

const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(CHAIN_ID);

// TODO: return undefined or connection error?
export async function connect(): Promise<Connection | undefined> {
  try {
    const net = new SimpleNet(networkConfig.rpc)
    const driver = await Driver.connect(net);
    const connex = new Framework(driver);
    const connexUtils = new ConnexUtils(connex);

    // Create a reference to the `VTHO` contract.
    const vtho = connexUtils.getContract(
      vthoArtifact.abi as AbiItem[],
      networkConfig.vtho,
    );

    // Create a reference to the `Trader` contract.
    const trader = connexUtils.getContract(
      traderArtifact.abi as AbiItem[],
      networkConfig.trader,
    );

    return {
      networkConfig,
      connexUtils,
      vtho,
      trader,
    };
  } catch (error) {
    console.log("ERROR while establishing connection " + error);
    return;
  }
}
