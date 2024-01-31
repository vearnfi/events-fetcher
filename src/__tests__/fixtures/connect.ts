import type {
  WrappedConnex,
  Filter,
  Callback,
  RawEvent,
  Contract,
} from "@vearnfi/wrapped-connex";
import type {ChainData} from "@vearnfi/config";
import type {Connect, Connection} from "../../utils/connect";

function fakeFilter(): Filter {
  return {
    order: (order: "asc" | "desc") => ({
      range: ({unit, from, to}: {unit: string, from: number, to: number}) => {},
    })
  } as Filter
}

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
  return async function fakeConnect(): Promise<Connection> {
    let blockCount = nextBlock - 1;
    let eventCount = 0;

    return Promise.resolve({
      wConnex: Object.freeze({
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
      vtho: {
        getAddress: () => chain.vtho,
        events: {
          Approval: {
            filter: fakeFilter,
          }
        }
      } as unknown as Contract,
      trader: {
        getAddress: () => chain.trader,
        events: {
          Config: {
            filter: fakeFilter,
          },
          Swap: {
            filter: fakeFilter,
          }
        }
      } as unknown as Contract
    });
  };
}
