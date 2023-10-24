import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex-driver'
import { abi } from 'thor-devkit'
import {ConnexUtils } from './blockchain/connex-utils'
import {getNetworkConfig} from './config/index';
import * as vthoArtifact from "./abis/Energy.json";
import {AbiItem} from "./typings/types";

//Server Environment Setup
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(100010); // testnet

// // Blockchain connection.
// const rpc = new SimpleNet(networkConfig.rpc);
// const driver = await Driver.connect(rpc);
// const connex = new Framework(driver);

// const connexUtils = new ConnexUtils(connex);

// Get current block from the blockchain.
// const currentBlock = await connexUtils.getCurrentBlock();

// // Get last inspected block from the approvals collection.
// const {lastBlockNumber} = await approvalsColl.getCounters();

// // Create a reference to the `VTHO` contract.
// const vtho = connexUtils.getContract(
//   vthoArtifact.abi as AbiItem[],
//   networkConfig.vtho,
// );

  //Run server in https://localhost:5000
app.listen(process.env.PORT || 5000, async function () {


  const getHead = async () => {
    try {
      //Find the latest event item and return its Block number from Internal DB
      return 0;
    } catch (error) {
      console.error("GetHead Event Err: add event info", error);
    }
  }

  // const newEventsDecoder = (abiDefs) => {
  //   const coders = {}

  //   for (const def of abiDefs) {
  //     if (def.type === 'event') {
  //       const ev = new abi.Event(def)
  //       coders[ev.signature] = ev
  //     }
  //   }

  //   return {
  //     decode: (output) => {
  //       const ev = coders[output.topics[0]]
  //       if (!!ev) {
  //         output.decoded = ev.decode(output.data, output.topics)
  //         output.event = ev.definition.name
  //       }

  //       return output
  //     }
  //   }

  // }

  const net = new SimpleNet(networkConfig.rpc)
  const driver = await Driver.connect(net);
  const connex = new Framework(driver);
  const connexUtils = new ConnexUtils(connex);

  // Create a reference to the `VTHO` contract.
  const vtho = connexUtils.getContract(
    vthoArtifact.abi as AbiItem[],
    networkConfig.vtho,
  );

  const step = 20;
  let lastBlockNumber = await getHead() || 0; // Latest Block number in the Internal DB
  //Endless Loop for fetching event from the Chain
  for (; ;) {
    // const blk = connex.thor.block()
    // let latestBlockNum;
    // await blk.get().then(block => {
    //   latestBlockNum = block.number; //Latest Block number in Chain
    // })
    // const block = await connex.thor.block().get();
    const block = await connexUtils.getCurrentBlock();
    const curBlockNumber = block.number;
    console.log({curBlockNumber})
    try {
      await new Promise(async (resolve, reject) => {
        if (curBlockNumber <= lastBlockNumber + 1) {
          // Loop again from start when the block in chain hasn't been created yet but in the internal db
          resolve(undefined);
        }
        try {
          let events: Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[] = [];
            // Fetch `Approval` events emitted by the `VTHO` contract.
  const filter = await vtho.events.Approval
    .filter([{_spender: networkConfig.trader}])
    .order("asc")
    .range({unit: "block", from: lastBlockNumber + 1, to: curBlockNumber})
    // .apply(0, MAX_EVENTS_COUNT);
          // const filter = connex.thor.filter('event', [{ "address": SC_ADDRESS }]).range({ unit: "block", from: lastBlockNumber + 1, to: curBlockNumber });
          let offset = 0;
          // const decoder = newEventsDecoder(SC_ABI);
          for (; ;) {
            // const newOutput = await filter.apply(offset, step).then(events => events.map(x => decoder.decode(x)));
            const output = await filter.apply(offset, step)
            if (output.length === 0) {
              break;
            }
            events = [...events, ...output];
            offset += step
          }

          for (let i = 0; i < events.length; i++) {
            console.log("New Event: ", events[i].meta)
            // if (events[i].event === "EventName") {
            //   //Do some actions when this event triggered. This action must include inserting event into internal DB so that next time you can fetch latest event from DB
            //   console.log("event happened");
            // }
          }
          resolve(undefined);
        } catch (error) {
          reject(error);
        }
      })
      lastBlockNumber = curBlockNumber;
    } catch (error) {
      console.error("Event Fetching error" + error);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 10 * 1000)
    })
  }
});

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
