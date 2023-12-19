// import { ChainData } from "@vearnfi/config";
// import type { RawEvent } from "@vearnfi/wrapped-connex";
// import type { EventType } from "../typings/types";

// /**
//  * Class to interact with the remote service.
//  */
// export class Api {
//   constructor(private readonly chain: ChainData) {}

//   /**
//    * Fetch latest block number from the remote service.
//    * @return {number} Latest block number.
//    */
//   async getHead(): Promise<number> {
//     // try {
//     const response = await fetch(this.chain.getHeadEndpoint);

//     if (!response.ok) {
//       throw new Error("Error fetching head from remote service");
//     }

//     const json = (await response.json()) as { lastBlockNumber: number };

//     return json.lastBlockNumber;
//     // } catch (error) {
//     //   console.error(error);
//     //   return 0;
//     // }
//   }

//   /**
//    * Make a POST request to forward events to the remote service.
//    * @param {EventType} eventType Event type.
//    * @param {RawEvent[]} events List of events.
//    */
//   async forwardEvents(eventType: EventType, events: RawEvent[]): Promise<void> {
//     const response = await fetch(
//       `${this.chain.registerEventsEndpoint}?eventType=${eventType}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(events),
//       },
//     );

//     if (!response.ok) {
//       throw new Error("Error forwarding event to the remote service");
//     }

//     // return response.text();
//   }
// }

import axios from "axios";
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
    const response = await axios.get(this.chain.getHeadEndpoint);

    if (response.status !== 200) {
      throw new Error("Error fetching head from remote service");
    }

    const data = response.data as { lastBlockNumber: number };

    return data.lastBlockNumber;
  }

  /**
   * Make a POST request to forward events to the remote service.
   * @param {EventType} eventType Event type.
   * @param {RawEvent[]} events List of events.
   */
  async forwardEvents(eventType: EventType, events: RawEvent[]): Promise<void> {
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

    if (!response.ok) {
      throw new Error("Error forwarding event to the remote service");
    }

    // return response.text();
  }
}
