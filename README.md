# connex-sync-event-fetch Module

connex-sync-event-fetch Module is a module that implements server environment for syncing event fetching using connex in VeChain.
This is most useful for backend developers who wants to fetch and handle events triggered in Smart Contract in VeChain.
The backend server is based on Express JS + Node JS.
Since it is working on VeChain, we recommend to use connex rather than Web3.js to connect to VeChain node.

# How to implement
This module implements the following logic to update the attribute of metadata in Pinata.
1. Get the latest Blocknumber that was previously saved in the internal db
2. Use endless loop for fetching events and repeat it every 10 seconds or custom delay.
3. In the loop, following logic is required.
    - Filter the events from the Chain with "from" and "to" parameters using connex.
    - Get the events within the range of "from" block and "to" block. Refer to the code in index.js.
    - Then loop the gained events array and use conditions to find a specific event occured.
    - Set custom delay of repeated loop.

## Packages

As it works with connex to sync the backend and the VeChain node, it always works along with the package [@vechain/connex-driver, @vechain/connex-framework](https://github.com/vechain/connex/tree/master/packages/driver).

```sh
npm i @vechain/connex-framework @vechain/connex-driver thor-devkit
```


## Code Structure

To create a Framework instance:

```typescript
import { Framework } from '@vechain/connex-framework'
import { Driver, SimpleNet } from '@vechain/connex-driver'

//Create a connex instance
const net = new SimpleNet('https://testnet.veblocks.net/');
const driver = await Driver.connect(net, wallet);
const connex = new Framework(driver)

// Get latest Block number in the Internal DB
let latestBlocknumber = await getHead();

for(;;){
    await new Promise(async (resolve,reject)=>{
        //Filter the events from the latest event fetched to the latest event triggered in the chain
        //latestBlocknumber: Latest Block number in the Internal DB
        //latestBlockNum: Latest Block number in Chain
        const filter = connex.thor.filter('event', [{ "address": SC_ADDRESS }]).range({ unit: "block", from: latestBlocknumber + 1, to: latestBlockNum });

        //Get events from the filter
        let offset = 0;
        let events = [];
        const decoder = newEventsDecoder(SC_ABI);
        for (; ;) {
            const newOutput = await filter.apply(offset, step).then(events => events.map(x => decoder.decode(x)));
            events = [...events, ...newOutput];
            if (newOutput.length == 0) {
            break;
            }
            offset += step
        }

        //Do actions
        for (let i = 0; i < events.length; i++) {
            console.log("New Event: ", events[i].event)
            if (events[i].event === "EventName") {
            //Do some actions when this event triggered. This action must include inserting event into internal DB so that next time you can fetch latest event from DB
            console.log("event happened");
            }
        }
        resolve();
    });

    //Create a Delay for block creation
    await new Promise((resolve) => {
        setTimeout(resolve, 10 * 1000)
    })
}
```

# Usage / Installation
- Installation
    ```sh

    npm i connex-sync-event-fetch

    ```
- Usage
    ```typescript

    var myBackend = require('connex-sync-event-fetch');
    myBackend.syncBackend();

    ```


# Warning
This framework should be modified before using it.
Insert your Smart Contract Address and ABI, Insert your logic to get events.



## License

This package is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.html), also included
in *LICENSE* file in the repository.


## Google Cloud Deploy

```
gcloud app deploy
```

## Google Cloud Engine Logs

```
gcloud app logs tail -s default
```

## Deploy to production server

1. Clone repo
2. Login into docker hub
3. Create container from image:
```
docker-compose -f docker-compose.yaml -f docker-compose.[stag|prod].yaml up -d
```
