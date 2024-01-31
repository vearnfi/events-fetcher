[![test](https://github.com/vearnfi/events-fetcher/workflows/test/badge.svg)](https://github.com/vearnfi/events-fetcher/workflows/test.yml)

# @vearnfi/events-fetcher

This service listens to events associated with the vearn.finance protocol and forwards them to the backend.

## Acknowledgement

This service was inspired by the excellent work of Exo Worlds [Exo Worlds Connex Sync Event Fetch](https://bitbucket.org/exoworldsnft/connex-sync-event-fetch/src/master/)

## How it works

1. Retrieves the latest block number previously saved in the database.
2. Utilizes an endless loop for fetching events, repeating every time a new block is added to the chain.
3. In the loop, the following logic applies:
   - Filters events from the blockchain with "from" and "to" parameters using connex.
   - Retrieves events within the range of "from" block and "to" block. Refer to the code in /use-cases/fetcher.ts.
   - Loops through the gained events array and stores them in the database.
   - Every 360 blocks (approximately 1 hour), updates the latest block number in the database.

## Architecture

We employ clean architecture to organize the codebase, consisting of **entities** (enterprise business rules), **use-cases** (interactions between entities), and **controllers/adaptors** (isolating use cases from frameworks). For an in-depth explanation of how it works, please refer to [Using Clean Architecture for Microservice APIs in Node.js with MongoDB and Express3](https://youtu.be/CnailTcJV_U?si=NTq4-6Zh-ZaAhHi3)

## License

This package is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.html), also included
in _LICENSE_ file in the repository.

## Deployment

1. Create an image on the local computer and push it to Docker Hub:

```
docker push
```

2. SSH into the server.
3. Clone the repository.
4. Log into Docker Hub.
5. Create a container from the image:

```
docker-compose -f docker-compose.yaml -f docker-compose.[stag|prod].yaml up -d
```

For an in-depth explanation of how it works, please refer to [Learn Docker - DevOps with Node.js & Express](https://youtu.be/9zUHg7xjIqQ?si=sNNowbp_vrTIkq-O)
