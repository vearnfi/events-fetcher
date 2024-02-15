[![test](https://github.com/vearnfi/events-fetcher/workflows/test/badge.svg)](https://github.com/vearnfi/events-fetcher/actions/workflows/test.yml) [![coverage](https://coveralls.io/repos/github/vearnfi/events-fetcher/badge.svg)](https://coveralls.io/github/vearnfi/events-fetcher) [![Maintainability](https://api.codeclimate.com/v1/badges/32602854cda29c7727e8/maintainability)](https://codeclimate.com/github/vearnfi/events-fetcher/maintainability)

# @vearnfi/events-fetcher

This service listens to events associated with the vearn.finance protocol and forwards them to the backend.

## Acknowledgement

This service was inspired by the excellent work of Exo Worlds [Exo Worlds Connex Sync Event Fetch](https://bitbucket.org/exoworldsnft/connex-sync-event-fetch/src/master/)

## Overview

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
make [env]-build
docker push [username]/events-fetcher
```

2. SSH into the server.
3. Install docker:

```
curl -fsSL https://get.docker.com -o install-docker.sh
sh install-docker.sh
```

4. Install docker-compose:

```
curl -SL https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

5. Set you env vars.
6. Clone the repository:

```
mkdir app
cd app
git clone https://github.com/vearnfi/events-fetcher.git .
```

6. Log into Docker Hub.
7. Create a container from the image:

```
docker-compose -f docker-compose.yaml -f docker-compose.[stag|prod].yaml pull
docker-compose -f docker-compose.yaml -f docker-compose.[stag|prod].yaml up -d
```

For an in-depth explanation of how it works, please refer to [Learn Docker - DevOps with Node.js & Express](https://youtu.be/9zUHg7xjIqQ?si=sNNowbp_vrTIkq-O)

8. Stream container logs :)

```
docker container logs --follow CONTAINER
```
