import type {RawEvent} from "@vearnfi/wrapped-connex";
import type {EventType} from "../../typings/types";
import * as approvalEvents from "./approval-events.json";
import * as configEvents from "./config-events.json";
import * as swapEvents from "./swap-events.json";

/**
 * Return set of events based on the given event type.
 * @param {EventType} eventType Event type.
 * @returns {RawEvent[]} events.
 */
export function makeFakeEvents(eventType: EventType): RawEvent[] {
  const map: Record<EventType, RawEvent[]> = {
    APPROVAL: approvalEvents.events,
    CONFIG: configEvents.events,
    SWAP: swapEvents.events,
  };

  return map[eventType];
}
