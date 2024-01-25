import axios, {AxiosError} from "axios";
import {ChainData} from "@vearnfi/config";
import type {RawEvent} from "@vearnfi/wrapped-connex";
import type {EventType} from "../typings/types";

export type Api = Readonly<{
  getHead: () => Promise<number>;
  forwardEvents: (eventType: EventType, events: RawEvent[]) => Promise<number>;
}>;

export function makeApi(chain: ChainData): Api {
  /**
   * Fetch latest block number from the remote service.
   * @return {number} Latest block number.
   */
  async function getHead(): Promise<number> {
    const response = await axios
      .get(chain.getHeadEndpoint)
      .catch((error: AxiosError) => {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          `Error fetching head from remote service. Status: ${error?.response?.status}`,
        );
      });

    const data = response.data as {lastBlockNumber: number};

    return data.lastBlockNumber;
  }

  /**
   * Make a POST request to forward events to the remote service.
   * @param {EventType} eventType Event type.
   * @param {RawEvent[]} events List of events.
   */
  async function forwardEvents(
    eventType: EventType,
    events: RawEvent[],
  ): Promise<number> {
    const response = await axios
      .post(`${chain.registerEventsEndpoint}?eventType=${eventType}`, events, {
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

    return response.status;
  }

  return Object.freeze({
    getHead,
    forwardEvents,
  });
}
