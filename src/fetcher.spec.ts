import {getChainData} from "@vearnfi/config";
import type {RawEvent} from "@vearnfi/wrapped-connex";
import * as approvalEvents from "./__tests__/fixtures/approval-events.json";
import * as configEvents from "./__tests__/fixtures/config-events.json";
import * as swapEvents from "./__tests__/fixtures/swap-events.json";
import {makeFakeConnect} from "./__tests__/fixtures/connect";
import type {EventType} from "./typings/types";
import type {Connect} from "./utils/connect";
import type {Api} from "./api";
import {makeFetcher} from "./fetcher";

describe("fetcher", () => {
  const chain = getChainData(100010);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and forwards all type of events to the remote service", async () => {
    // Arrange
    expect.assertions(8);
    const events: RawEvent[][] = [approvalEvents, configEvents, swapEvents].map(
      (json) => json.events,
    );
    const mockConnect: Connect = makeFakeConnect(chain, events);
    const mockGetHead = jest.fn(() => Promise.resolve(0));
    const mockForwardEvents = jest.fn(
      (eventType: EventType, events: RawEvent[]) => Promise.resolve(201),
    );
    const mockApi: Api = Object.freeze({
      getHead: mockGetHead,
      forwardEvents: mockForwardEvents,
    });
    const fetcher = makeFetcher(mockConnect, mockApi);

    // Act
    await fetcher((cycles) => cycles >= 1); // test one loop only

    // Assert
    expect(mockGetHead).toHaveBeenCalledTimes(1);
    expect(mockForwardEvents).toHaveBeenCalledTimes(3);
    expect(mockForwardEvents.mock.calls[0][0]).toBe(approvalEvents.eventType);
    expect(mockForwardEvents.mock.calls[1][0]).toBe(configEvents.eventType);
    expect(mockForwardEvents.mock.calls[2][0]).toBe(swapEvents.eventType);
    expect(mockForwardEvents.mock.calls[0][1]).toBe(approvalEvents.events);
    expect(mockForwardEvents.mock.calls[1][1]).toBe(configEvents.events);
    expect(mockForwardEvents.mock.calls[2][1]).toBe(swapEvents.events);
  });
});
