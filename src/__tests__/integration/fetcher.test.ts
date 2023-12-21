import { ChainData, getChainData } from "@vearnfi/config";
import { wrapConnex } from "@vearnfi/wrapped-connex";
import type { WrappedConnex, Filter, Callback, RawEvent } from "@vearnfi/wrapped-connex";
import { connect } from "../../utils/connect";
import type { Connection } from "../../utils/connect";
import { fetcher } from "../../fetcher";
import { Api } from "../../api";
// import type {  }
import * as approvalEvents from "../fixtures/approval-events.json";
import * as configEvents from "../fixtures/config-events.json"
import * as swapEvents from "../fixtures/swap-events.json"

// const api: Api = {
//   getHead: jest.fn(() => 0),
//   for
// }

jest.mock("../../api");
// jest.mock("../../utils/connect")

function* getTicker() {
  let index = 0;
  while (true) {
    yield index;
    index++;
  }
}

describe("fetcher", () => {
  let chain: ChainData;
  let connection: Connection;
  let api: Api;
  let currentBlock: number;

  beforeEach(async () => {
    chain = getChainData(100010);
    connection = await connect(chain);
    api = new Api(chain);
    currentBlock = 0;
    console.log({ connection });
  });

  it.only("fetches and forwards events to the remote service", async () => {
    // Arrange
    const mockGetHead = (api.getHead as jest.Mock).mockResolvedValue(0);
    const mockForwardEvents = (api.forwardEvents as jest.Mock).mockResolvedValue(200);
    // (connection.wConnex.getTicker as jest.Mock).mockReturnValue({
    //   next: async () => {
    //   currentBlock++
    //     return Promise.resolve(currentBlock)
    // }})
    let callsCount = 0
    const mockConnection: Connection = {
      ...connection,
      wConnex: {
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
          let events: RawEvent[] = []
          switch(callsCount) {
            case 0: // "APPROVAL"
              events = approvalEvents.events
            case 1: // "CONFIG"
             events = configEvents.events
            case 2: // "SWAP"
            events = swapEvents.events
          }
            callsCount++
            cb(events)
        }
      },
    };
    // (connection.wConnex.fetchEvents as jest.Mock).mockImplementation(async (filter: Filter, cb: Callback) => {
    //   cb(approvalEvents.events)
    // })

    // Act
    await fetcher((cycles) => cycles < 1, mockConnection, api);

    // Assert
    // expect(api.forwardEvents as jest.Mock).toHaveBeenCalledTimes(3);
    expect(mockForwardEvents).toHaveBeenCalledTimes(3);
    expect(mockForwardEvents.mock.calls[0][0]).toBe(approvalEvents.eventType);
    expect(mockForwardEvents.mock.calls[1][0]).toBe(configEvents.eventType);
    expect(mockForwardEvents.mock.calls[2][0]).toBe(swapEvents.eventType);
    // expect(mockForwardEvents.mock.calls[0][1]).toBe(ap provalEvents.events);
    // expect(
    //   (api.forwardEvents as jest.Mock).mock.calls[0][0],
    // ).toHaveBeenCalledWith(approvalEvents.eventType);
    // expect(api.forwardEvents).toHaveBeenCalledTimes(3)
    // expect(api.forwardEvents).toHaveBeenCalledTimes(3)
  });
  it("", async () => {});
  it("", async () => {});
  it("", async () => {});
  it("", async () => {});
  it("", async () => {});
});

// const wConnex: WrappedConnex = {
//     getTicker,
//     fetchEvents: async (filter: Filter, cb: Callback) => {
//       cb(approvalEvents.events)
//     }
//   }

// const connection: Connection = {
//   ...connection_,
//   wConnex: {
//     // ...wConnex,
//     ...connection_.wConnex,
//     fetchEvents: async (filter: Filter, cb: Callback) => {
//       cb(approvalEvents.events)
//     }
//   }
// }
