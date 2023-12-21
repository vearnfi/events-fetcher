import type { Filter } from "@vearnfi/wrapped-connex";
import type { EventType } from "./typings/types";
import { EVENT_TYPES } from "./typings/types";
import type { Connection } from "./utils/connect";
import type { Api } from "./api";

/**
 * Infinite loop for fetching and forwarding events from
 * the blockchain to a remote service.
 */
export async function fetcher(
  stopCondition: (cycles: number) => boolean,
  connection: Connection,
  api: Api,
) {
  const { wConnex, vtho, trader } = connection;

  // Define filters for each event type.
  const filters: Record<EventType, Filter> = {
    APPROVAL: vtho.events.Approval.filter([{ _spender: trader.getAddress() }]),
    CONFIG: trader.events.Config.filter([{}]),
    SWAP: trader.events.Swap.filter([{}]),
  };

  // Get latest inspected block from remote service.
  let lastBlockNumber = await api.getHead();
  console.log({ lastBlockNumber });

  // Listen to new blocks being inserted into the blockchain.
  const ticker = wConnex.getTicker();

  let cyclesCount = 0;
  console.log({ cyclesCount });

  while (stopCondition(cyclesCount)) {
    console.log("IN loop");

    try {
      // Get latest block data.
      const currentBlock = await ticker.next();
      console.log({ currentBlock });

      if (currentBlock == null) {
        throw new Error("Could get current block");
      }

      console.log(`Block number: ${currentBlock.number}`);

      // Fetch events from the chain and forward them to the remote service.
      for (const eventType of EVENT_TYPES) {
        console.log({ eventType });
        const filter = filters[eventType].order("asc").range({
          unit: "block",
          from: lastBlockNumber,
          to: currentBlock.number,
        });

        await wConnex.fetchEvents(filter, async (events) => {
          // console.log({ events: JSON.stringify(events, null, 2) });
          await api.forwardEvents(eventType, events);
        });
      }

      lastBlockNumber = currentBlock.number;
      cyclesCount++;
    } catch (error) {
      console.error("ERROR fetching events " + error);
    }
  }
}
