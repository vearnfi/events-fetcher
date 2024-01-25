import type {
  WrappedConnex,
  Filter,
  Callback,
  RawEvent,
} from "@vearnfi/wrapped-connex";
import type {ChainData} from "@vearnfi/config";
import {makeConnect} from "../../utils/connect";
import type {Connect, Connection} from "../../utils/connect";

export function makeFakeConnect(
  chain: ChainData,
  events: RawEvent[][],
): Connect {
  return async function () {
    const connect = makeConnect(chain);
    const connection = await connect();

    let index = 0;

    return Promise.resolve({
      ...connection,
      wConnex: Object.freeze({
        ...connection.wConnex,
        getTicker: () => ({
          next: async () => {
            return Promise.resolve({
              id: "0x01082242f9c473bc261b8d871d26857e499776dbdc152ec36f3563425fe3fe32",
              number: 17310274,
              timestamp: 1703134110,
              parentID:
                "0x0108224199631d578657ac65fff6f7e6a93531c68b1ecf810cecc79ba6262a79",
              txsFeatures: 1,
              gasLimit: 30000000,
            });
          },
        }),
        fetchEvents: async (filter: Filter, cb: Callback) => {
          cb(events[index] || events[0]);
          index++;
        },
      }) as WrappedConnex,
    } as Connection);
  };
}
