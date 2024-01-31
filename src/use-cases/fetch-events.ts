import type {Filter} from "@vearnfi/wrapped-connex";
import type {EventType} from "../typings/types";
import {EVENT_TYPES} from "../typings/types";
import type {Connect} from "../utils/connect";
import type {CountersDb, EventsDb} from "../data-access";

export type Stop = (cycles: number) => boolean;
export type FetchEvents = (stop: Stop) => Promise<void>;

/**
 * Infinite loop for fetching and storing events from
 * the blockchain into a (remote) database.
 */
export function makeFetchEvents(
  connect: Connect,
  countersDb: CountersDb,
  eventsDb: EventsDb,
): FetchEvents {
  return async function fetchEvents(stop: Stop) {
    const {wConnex, vtho, trader} = await connect();

    // Define filters for each event type.
    const filters: Record<EventType, Filter> = {
      APPROVAL: vtho.events.Approval.filter([{_spender: trader.getAddress()}]),
      CONFIG: trader.events.Config.filter([{}]),
      SWAP: trader.events.Swap.filter([{}]),
    };

    // Get latest inspected block from remote service.
    let lastBlockNumber = await countersDb.find();

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
          await eventsDb.insert(eventType, events);
        });
      }

      lastBlockNumber = currentBlock.number;

      // Update head every 360 blocks (1 hour).
      if (lastBlockNumber % 360 === 0) {
        await countersDb.update(lastBlockNumber);
      }
    }
  };
}
