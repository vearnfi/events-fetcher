import {getChainData} from "@vearnfi/config";
import type {RawEvent} from "@vearnfi/wrapped-connex";
import * as approvalEvents from "../__tests__/fixtures/approval-events.json";
import * as configEvents from "../__tests__/fixtures/config-events.json";
import * as swapEvents from "../__tests__/fixtures/swap-events.json";
import {makeFakeConnect} from "../__tests__/fixtures/connect";
import type {EventType} from "../typings/types";
import type {Connect} from "../utils/connect";
import type {CountersDb, EventsDb} from "../data-access";
import {makeFetchEvents} from "./fetch-events";

describe("fetch events use case", () => {
  const chain = getChainData(100010);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and forwards all type of events to the remote service", async () => {
    // Arrange
    expect.assertions(9);
    const events: RawEvent[][] = [approvalEvents, configEvents, swapEvents].map(
      (json) => json.events,
    );
    const head = 0;
    const mockFindCounters = jest.fn(() => Promise.resolve(head));
    const mockUpdateCounters = jest.fn((block) => Promise.resolve(block));
    const mockInsertEvents = jest.fn(
      (eventType: EventType, events: RawEvent[]) => Promise.resolve(events),
    );
    const mockConnect: Connect = makeFakeConnect(chain, events, head + 1);
    const mockCountersDb: CountersDb = Object.freeze({
      find: mockFindCounters,
      update: mockUpdateCounters,
    });
    const mockEventsDb: EventsDb = Object.freeze({
      insert: mockInsertEvents,
    });
    const fetchEvents = makeFetchEvents(
      mockConnect,
      mockCountersDb,
      mockEventsDb,
    );

    // Act
    await fetchEvents((blockNumber: number) => blockNumber >= head + 1); // test one loop only

    // Assert
    expect(mockFindCounters).toHaveBeenCalledTimes(1);
    expect(mockUpdateCounters).toHaveBeenCalledTimes(0);
    expect(mockInsertEvents).toHaveBeenCalledTimes(3);
    expect(mockInsertEvents.mock.calls[0][0]).toBe(approvalEvents.eventType);
    expect(mockInsertEvents.mock.calls[1][0]).toBe(configEvents.eventType);
    expect(mockInsertEvents.mock.calls[2][0]).toBe(swapEvents.eventType);
    expect(mockInsertEvents.mock.calls[0][1]).toBe(approvalEvents.events);
    expect(mockInsertEvents.mock.calls[1][1]).toBe(configEvents.events);
    expect(mockInsertEvents.mock.calls[2][1]).toBe(swapEvents.events);
  });

  it("sets head every 360 blocks", async () => {
    // Arrange
    expect.assertions(2);
    const events: RawEvent[][] = [approvalEvents, configEvents, swapEvents].map(
      (json) => json.events,
    );
    const head = 359;
    const mockFindCounters = jest.fn(() => Promise.resolve(head));
    const mockUpdateCounters = jest.fn((block) => Promise.resolve(block));
    const mockInsertEvents = jest.fn(
      (eventType: EventType, events: RawEvent[]) => Promise.resolve(events),
    );
    const mockConnect: Connect = makeFakeConnect(chain, events, head + 1);
    const mockCountersDb: CountersDb = Object.freeze({
      find: mockFindCounters,
      update: mockUpdateCounters,
    });
    const mockEventsDb: EventsDb = Object.freeze({
      insert: mockInsertEvents,
    });
    const fetchEvents = makeFetchEvents(
      mockConnect,
      mockCountersDb,
      mockEventsDb,
    );

    // Act
    await fetchEvents((blockNumber: number) => blockNumber >= head + 1); // test one loop only

    // Assert
    expect(mockFindCounters).toHaveBeenCalledTimes(1);
    expect(mockUpdateCounters).toHaveBeenCalledTimes(1);
  });
});
