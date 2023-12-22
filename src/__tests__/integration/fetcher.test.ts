import { ChainData, getChainData } from "@vearnfi/config";
import type { Filter, Callback, RawEvent } from "@vearnfi/wrapped-connex";
import { connect } from "../../utils/connect";
import type { Connection } from "../../utils/connect";
import { fetcher } from "../../fetcher";
import { Api } from "../../api";
// import type {  }
import * as approvalEvents from "../fixtures/approval-events.json";
import * as configEvents from "../fixtures/config-events.json"
import * as swapEvents from "../fixtures/swap-events.json"

jest.mock("../../api");
// jest.mock("../../utils/connect")

describe("fetcher", () => {
  let chain: ChainData;
  let connection: Connection;
  let api: Api;
  let currentBlock: number;
  let index = 0

  beforeEach(async () => {
    chain = getChainData(100010);
    connection = await connect(chain);
    api = new Api(chain);
    currentBlock = 0;
  });

  it("fetches and forwards all type of events to the remote service", async () => {
    // Arrange
    const mockGetHead = (api.getHead as jest.Mock).mockResolvedValue(0);
    const mockForwardEvents = (api.forwardEvents as jest.Mock).mockResolvedValue(200);
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
            const events: RawEvent[][] = [approvalEvents, configEvents, swapEvents].map(json => json.events)
            cb(events[index] || events[0])
            index++
        }
      },
    };

    // Act
    await fetcher((cycles) => cycles >= 1, mockConnection, api);

    // Assert
    expect(mockForwardEvents).toHaveBeenCalledTimes(3);
    expect(mockForwardEvents.mock.calls[0][0]).toBe(approvalEvents.eventType);
    expect(mockForwardEvents.mock.calls[1][0]).toBe(configEvents.eventType);
    expect(mockForwardEvents.mock.calls[2][0]).toBe(swapEvents.eventType);
    expect(mockForwardEvents.mock.calls[0][1]).toBe(approvalEvents.events);
    expect(mockForwardEvents.mock.calls[1][1]).toBe(configEvents.events);
    expect(mockForwardEvents.mock.calls[2][1]).toBe(swapEvents.events);
  });
});
