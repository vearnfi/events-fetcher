import { Framework } from "@vechain/connex-framework";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import type { ChainData } from "@vearnfi/config";
import { WrappedConnex } from "@vearnfi/wrapped-connex";
import type { Contract, AbiItem } from "@vearnfi/wrapped-connex";
import { chain } from "../config/index";
import * as vthoArtifact from "../artifacts/Energy.json";
import * as traderArtifact from "../artifacts/Trader.json";

export type Connection = {
  chain: ChainData;
  wConnex: WrappedConnex;
  /** Reference to the VTHO contract. */
  vtho: Contract;
  /** Reference to the Trader contract. */
  trader: Contract;
};

export async function connect(): Promise<Connection | undefined> {
  try {
    const net = new SimpleNet(chain.rpc[0]);
    const driver = await Driver.connect(net);
    const connex = new Framework(driver);
    const wConnex = new WrappedConnex(connex);

    // Create a reference to the `VTHO` contract.
    const vtho = wConnex.getContract(vthoArtifact.abi as AbiItem[], chain.vtho);

    // Create a reference to the `Trader` contract.
    const trader = wConnex.getContract(
      traderArtifact.abi as AbiItem[],
      chain.trader,
    );

    return {
      chain,
      wConnex,
      vtho,
      trader,
    };
  } catch (error) {
    return;
  }
}
