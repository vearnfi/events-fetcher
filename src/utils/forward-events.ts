import type { RawEvent, EventType } from "../typings/types";

/**
 * Make a POST request to forward events to the given endpoint url.
 * @param {string} url Endpoint URL.
 * @param {EventType} eventType Event type.
 * @param {RawEvent[]} events List of events.
 * @return {string} Response.
 */
export async function forwardEvents(
  url: string,
  eventType: EventType,
  events: RawEvent[],
): Promise<string> {
  const response = await fetch(`${url}?eventType=${eventType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(events),
  });

  return response.text();
}
