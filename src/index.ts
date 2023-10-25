import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex-driver'
import {getNetworkConfig} from './config/index';
import {getEnvVars} from './config/get-env-vars'
import {ConnexUtils } from './blockchain/connex-utils'
import * as vthoArtifact from "./abis/Energy.json";
import * as traderArtifact from "./abis/Trader.json";
import {AbiItem} from "./typings/types";
import { getHead } from './utils/get-head';
import { setHead } from './utils/set-head';
import { fetchApprovals } from './utils/fetch-approvals';
import { fetchConfigs } from './utils/fetch-configs';
import { fetchSwaps } from './utils/fetch-swaps';
import { registerEvents } from './utils/register-events';


const app = express();
app.use(cors());

const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(CHAIN_ID);

async function main() {
  // Establish connection.
  const net = new SimpleNet(networkConfig.rpc)
  const driver = await Driver.connect(net);
  const connex = new Framework(driver);
  const connexUtils = new ConnexUtils(connex);

  // TODO: check blockchain connection.

  // Create a reference to the `VTHO` contract.
  const vtho = connexUtils.getContract(
    vthoArtifact.abi as AbiItem[],
    networkConfig.vtho,
  );

  // Create a reference to the `Trader` contract.
  const trader = connexUtils.getContract(
    traderArtifact.abi as AbiItem[],
    networkConfig.trader,
  );

  // Get latest block number internal DB.
  let lastBlockNumber = await getHead();
  console.log({lastBlockNumber})

  // Endless loop for fetching events from the chain.
  for (;;) {
    const currentBlock = await connexUtils.getCurrentBlock();
    console.log({curBlockNumber: currentBlock.number})
    try {
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
    }

    // Sleep for 10 seconds (1 block).
    await new Promise((resolve) => {
      setTimeout(resolve, 10_000)
    })
  }
}

app.listen(process.env.PORT || 5000, main)

//----------------------------
// const { Framework } = require('@vechain/connex-framework');
// const { Driver, SimpleNet, SimpleWallet } = require('@vechain/connex-driver')
// const { abi } = require('thor-devkit')

// const { SC_ABI, SC_ADDRESS } = require('./config');

// //Server Environment Setup
// const express = require('express');
// const cors = require('cors');
// const app = express();
// app.use(cors());

// //Run server in https://localhost:5000
// app.listen(process.env.PORT || 5000, async function () {

//   const getHead = async () => {
//     try {
//       //Find the latest event item and return its Block number from Internal DB
//     } catch (error) {
//       console.error("GetHead Event Err: add event info", error);
//     }
//   }

//   const newEventsDecoder = (abiDefs) => {
//     const coders = {}

//     for (const def of abiDefs) {
//       if (def.type === 'event') {
//         const ev = new abi.Event(def)
//         coders[ev.signature] = ev
//       }
//     }

//     return {
//       decode: (output) => {
//         const ev = coders[output.topics[0]]
//         if (!!ev) {
//           output.decoded = ev.decode(output.data, output.topics)
//           output.event = ev.definition.name
//         }

//         return output
//       }
//     }

//   }

//   const net = new SimpleNet('https://testnet.veblocks.net/')
//   const driver = await Driver.connect(net);
//   const connex = new Framework(driver)

//   const step = 20;
//   let lastBlockNumber = await getHead() || 0; // Latest Block number in the Internal DB
//   //Endless Loop for fetching event from the Chain
//   for (; ;) {
//     // const blk = connex.thor.block()
//     // let latestBlockNum;
//     // await blk.get().then(block => {
//     //   latestBlockNum = block.number; //Latest Block number in Chain
//     // })
//     const block = await connex.thor.block().get();
//     const curBlockNumber = block.number;
//     console.log({curBlockNumber})
//     try {
//       await new Promise(async (resolve, reject) => {
//         if (curBlockNumber <= lastBlockNumber + 1) {
//           // Loop again from start when the block in chain hasn't been created yet but in the internal db
//           resolve();
//         }
//         try {
//           const filter = connex.thor.filter('event', [{ "address": SC_ADDRESS }]).range({ unit: "block", from: lastBlockNumber + 1, to: curBlockNumber });
//           let offset = 0;
//           let events = [];
//           const decoder = newEventsDecoder(SC_ABI);
//           for (; ;) {
//             const newOutput = await filter.apply(offset, step).then(events => events.map(x => decoder.decode(x)));
//             events = [...events, ...newOutput];
//             if (newOutput.length === 0) {
//               break;
//             }
//             offset += step
//           }

//           for (let i = 0; i < events.length; i++) {
//             console.log("New Event: ", events[i].event)
//             if (events[i].event === "EventName") {
//               //Do some actions when this event triggered. This action must include inserting event into internal DB so that next time you can fetch latest event from DB
//               console.log("event happened");
//             }
//           }
//           resolve();
//         } catch (error) {
//           reject(error);
//         }
//       })
//     } catch (error) {
//       console.error("Event Fetching error" + error);
//     }

//     await new Promise((resolve) => {
//       setTimeout(resolve, 10 * 1000)
//     })
//   }
// });
