import { chain } from "../config/index";
import type { RawEvent, EventType } from "../typings/types";

/**
 * Forward events via endpoint call to consumer service.
 * @param {EventType} eventType Event type.
 * @return {string} Response.
 */
export async function forwardEvents(
  eventType: EventType,
  events: RawEvent[],
): Promise<string> {
  const url = `${chain.registerEventsEndpoint}?eventType=${eventType}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(events),
  });

  return response.text();
}
