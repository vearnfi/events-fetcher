import type {Filter} from "@vearnfi/wrapped-connex";
import type {EventType} from "./typings/types";
import {EVENT_TYPES} from "./typings/types";
import type {Connect, Logger} from "./utils";
import type {Api} from "./api";

export type Fetcher = (stop: (cycles: number) => boolean) => Promise<void>;

/**
 * Infinite loop for fetching and forwarding events from
 * the blockchain to a remote service.
 */
export function makeFetcher(
  connect: Connect,
  api: Api,
  logger: Logger,
): Fetcher {
  return async function fetcher(stop: (cycles: number) => boolean) {
    try {
      const {wConnex, vtho, trader} = await connect();

      // Define filters for each event type.
      const filters: Record<EventType, Filter> = {
        APPROVAL: vtho.events.Approval.filter([
          {_spender: trader.getAddress()},
        ]),
        CONFIG: trader.events.Config.filter([{}]),
        SWAP: trader.events.Swap.filter([{}]),
      };

      // Get latest inspected block from remote service.
      let lastBlockNumber = await api.getHead();

      // Listen to new blocks being inserted into the blockchain.
      const ticker = wConnex.getTicker();

      while (!stop(lastBlockNumber)) {
        // Get latest block data.
        const currentBlock = await ticker.next();

        if (currentBlock == null) {
          throw new Error("Couldn't get current block");
        }

        console.log(`Block number: ${currentBlock.number}`);

        // Fetch events from the chain and forward them to the remote service.
        for (const eventType of EVENT_TYPES) {
          const filter = filters[eventType].order("asc").range({
            unit: "block",
            from: lastBlockNumber,
            to: currentBlock.number,
          });

          await wConnex.fetchEvents(filter, async (events) => {
            await api.forwardEvents(eventType, events);
          });
        }

        lastBlockNumber = currentBlock.number;

        // Update head every 36 blocks (1 hour).
        if (lastBlockNumber % 36 === 0) {
          await api.setHead(lastBlockNumber);
        }
      }
    } catch (error: any) {
      await logger({
        status: "ERROR",
        data: `fetcher: ${error?.message || "Unknown error occurred"}`,
      });
    }
  };
}
