import axios, {AxiosError} from "axios";
import {ChainData} from "@vearnfi/config";
import type {RawEvent} from "@vearnfi/wrapped-connex";
import type {EventType} from "../typings/types";

export type EventsDb = Readonly<{
  insert: (eventType: EventType, events: RawEvent[]) => Promise<RawEvent[]>;
}>;

export function makeEventsDb(chain: ChainData): EventsDb {
  /**
   * Forwards events to the remote service.
   * @param {EventType} eventType Event type.
   * @param {RawEvent[]} events List of events.
   */
  async function insert(
    eventType: EventType,
    events: RawEvent[],
  ): Promise<RawEvent[]> {
    const response = await axios
      .post(`${chain.registerEventsEndpoint}?eventType=${eventType}`, {events}, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error: AxiosError) => {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          `Error forwarding events to the remote service. Status: ${error?.response?.status}`,
        );
      });

    const data = response.data as {inserted: RawEvent[]};

    return data.inserted;
  }

  return Object.freeze({
    insert,
  });
}
