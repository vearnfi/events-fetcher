import { ChainData } from "@vearnfi/config";
import type { RawEvent } from "@vearnfi/wrapped-connex";
import type { EventType } from "../typings/types";

/**
 * Class to interact with the remote service.
 */
export class Api {
  constructor(private readonly chain: ChainData) {}

  /**
   * Fetch latest block number from the remote service.
   * @return {number} Latest block number.
   */
  async getHead(): Promise<number> {
    try {
      const response = await fetch(this.chain.getHeadEndpoint);

      const json = (await response.json()) as { lastBlockNumber: number };

      return json.lastBlockNumber;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  /**
   * Make a POST request to forward events to the remote service.
   * @param {EventType} eventType Event type.
   * @param {RawEvent[]} events List of events.
   * @return {string} Response.
   */
  async forwardEvents(
    eventType: EventType,
    events: RawEvent[],
  ): Promise<string> {
    const response = await fetch(
      `${this.chain.registerEventsEndpoint}?eventType=${eventType}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(events),
      },
    );

    return response.text();
  }
}
