import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import {getEnvVars} from "./config/get-env-vars"
import {connect} from "./utils/connect"
import { getHead } from './utils/get-head';
import { setHead } from './utils/set-head';
import { fetchApprovals } from './utils/fetch-approvals';
import { fetchConfigs } from './utils/fetch-configs';
import { fetchSwaps } from './utils/fetch-swaps';
import { registerEvents } from './utils/register-events';

const app = express();
app.use(cors());

const {CHAIN_ID} = getEnvVars();

async function main() {
  const connection = await connect();

  if (connection == null) {
    console.log('No connection')
    return;
  }

  const {connexUtils, vtho, trader} = connection

  let lastBlockNumber = await getHead();

  // Endless loop for fetching events from the chain and store them in the DB.
  for (;;) {
    try {
      const currentBlock = await connexUtils.getCurrentBlock();
      console.log(`Block number: ${currentBlock.number}`)
      // TODO: what happens if lastBlockNumber < currentBlock.number
      const range = {from: lastBlockNumber, to: currentBlock.number};

      await fetchApprovals(vtho, range, registerEvents("APPROVAL"))

      await fetchConfigs(trader, range, registerEvents("CONFIG"))

      await fetchSwaps(trader, range, registerEvents("SWAP"))

      lastBlockNumber = currentBlock.number;

      // Update lastBlockNumber once a day.
      if (currentBlock.number % 6 * 60 * 24 === 0) {
        await setHead(currentBlock.number)
      }
    } catch (error) {
      console.error("ERROR fetching events " + error);
      console.error("CHAIN_ID" + CHAIN_ID);
    }

    // Sleep for 10 seconds (1 block).
    await new Promise((resolve) => {
      setTimeout(resolve, 10_000)
    })
  }
}

app.listen(process.env.PORT || 5000, main)
