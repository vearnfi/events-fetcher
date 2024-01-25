import {Framework} from "@vechain/connex-framework";
import {Driver, SimpleNet} from "@vechain/connex-driver";
import type {ChainData} from "@vearnfi/config";
import {wrapConnex} from "@vearnfi/wrapped-connex";
import type {WrappedConnex, Contract, AbiItem} from "@vearnfi/wrapped-connex";
import * as vthoArtifact from "../artifacts/Energy.json";
import * as traderArtifact from "../artifacts/Trader.json";

export type Connection = {
  wConnex: WrappedConnex;
  /** Reference to the VTHO contract. */
  vtho: Contract;
  /** Reference to the Trader contract. */
  trader: Contract;
};

export type Connect = () => Promise<Connection>;

export function makeConnect(chain: ChainData): Connect {
  return async function connect(): Promise<Connection> {
    const net = new SimpleNet(chain.rpc[0]);
    const driver = await Driver.connect(net);
    const connex = new Framework(driver);
    const wConnex = wrapConnex(connex);

    // Create a reference to the `VTHO` contract.
    const vtho = wConnex.getContract(vthoArtifact.abi as AbiItem[], chain.vtho);

    // Create a reference to the `Trader` contract.
    const trader = wConnex.getContract(
      traderArtifact.abi as AbiItem[],
      chain.trader,
    );

    return {
      wConnex,
      vtho,
      trader,
    };
  };
}
