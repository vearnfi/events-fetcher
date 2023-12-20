import dotenv from "dotenv";
dotenv.config();
import { makeApp } from "./app";
import { chain } from "./config";
import { connect } from "./utils/connect";
import { Api } from "./api";
import { fetcher } from "./fetcher";

/**
 * Entry point. Instantiate a node express server and call the fetcher
 * function to start fetching and forwarding events from the blockchain
 * to a remote service.
 */
const app = makeApp();

async function main() {
  const connection = await connect(chain);

  const api = new Api(chain);

  await fetcher(connection, api);
}

app.listen(process.env.PORT || 5000, main);
