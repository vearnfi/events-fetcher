import type {
  WrappedConnex,
  Filter,
  Callback,
  RawEvent,
} from "@vearnfi/wrapped-connex";
import type {ChainData} from "@vearnfi/config";
import {makeConnect} from "../../utils/connect";
import type {Connect, Connection} from "../../utils/connect";

/**
 * Simulate a tick increase and events fetching with every new
 * function call.
 * @param {ChainData} chain Current chain.
 * @param {RawEvent[][]} events Set of events to be returned by connex.
 * @param {number} nextBlock Next block to be returned by the fake connex ticker.
 * @returns
 */
export function makeFakeConnect(
  chain: ChainData,
  events: RawEvent[][],
  nextBlock: number,
): Connect {
  return async function (): Promise<Connection> {
    const connect = makeConnect(chain);
    const connection = await connect();

    let blockCount = nextBlock - 1;
    let eventCount = 0;

    return Promise.resolve({
      ...connection,
      wConnex: Object.freeze({
        ...connection.wConnex,
        getTicker: () => ({
          next: async () => {
            blockCount++;
            return Promise.resolve({
              id: "0x01082242f9c473bc261b8d871d26857e499776dbdc152ec36f3563425fe3fe32",
              number: blockCount,
              timestamp: 1703134110 + blockCount,
              parentID:
                "0x0108224199631d578657ac65fff6f7e6a93531c68b1ecf810cecc79ba6262a79",
              txsFeatures: 1,
              gasLimit: 30000000,
            });
          },
        }),
        fetchEvents: async (filter: Filter, cb: Callback) => {
          cb(events[eventCount] || events[0]);
          eventCount++;
        },
      }) as WrappedConnex,
    } as Connection);
  };
}
