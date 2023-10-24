import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex-driver'
import { abi } from 'thor-devkit'
import type {ConnexUtils } from '../blockchain/connex-utils'
import {getNetworkConfig} from '../config/index';
import * as traderArtifact from "../abis/Trader.json";
import {AbiItem} from "../typings/types";

// const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(100010); // testnet
const STEP = 20;

export async function fetchConfigs(
  connexUtils: ConnexUtils,
  range: { from: number, to: number },
): Promise<Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[]> {

  // Create a reference to the `Trader` contract.
  const trader = connexUtils.getContract(
    traderArtifact.abi as AbiItem[],
    networkConfig.trader,
  );

  return new Promise(async (resolve, reject) => {
      try {
        let events: Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[] = [];

      // Fetch `Config` events emitted by the `Trader` contract.
      const filter = trader.events.Config
        .filter([{}])
        .order("asc")
        .range({unit: "block", ...range})

        let offset = 0;
        for (;;) {
          const output = await filter.apply(offset, STEP)
          if (output.length === 0) break;
          events = [...events, ...output];
          offset += STEP;
        }

        resolve(events);
      } catch (error) {
        reject(error);
      }
    })
}
