import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { EVENT_TYPES, EventType, Filter } from './typings/types';
import { connect } from "./utils/connect"
import { getHead } from './utils/get-head';
import { forwardEvents } from './utils/forward-events';
import { fetchEvents } from './utils/fetch-events';

const app = express();
app.use(cors());

/**
 * Infinite loop for fetching and forwarding events to
 * the consumer service.
 */
async function main() {
  const connection = await connect();

  if (connection == null) {
    console.error('No connection')
    return;
  }

  const {
    networkConfig,
    connexUtils,
    vtho,
    trader,
  } = connection

  // List of filters based on event type.
  const filters: Record<EventType, Filter> = {
    "APPROVAL": vtho.events.Approval.filter([{_spender: networkConfig.trader}]),
    "CONFIG": trader.events.Config.filter([{}]),
    "SWAP": trader.events.Swap.filter([{}]),
  }

  // Get last inspected block from consumer service.
  let lastBlockNumber = await getHead();

  // Listen to new blocks being inserted into the blockchain.
  const ticker = connexUtils.ticker();

  for (;;) {
    try {
      const currentBlock = await ticker.next();

      console.log(`Block number: ${currentBlock.number}`)

      for (const eventType of EVENT_TYPES) {
        const filter = filters[eventType]
          .order("asc")
          .range({
            unit: "block",
            from: lastBlockNumber,
            to: currentBlock.number,
          })

          await fetchEvents(filter, async (events) => {
            await forwardEvents(eventType, events)
          })
      }

      lastBlockNumber = currentBlock.number;
    } catch (error) {
      console.error("ERROR fetching events " + error);
    }
  }
}

app.listen(process.env.PORT || 5000, main)
