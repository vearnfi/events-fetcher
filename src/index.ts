import dotenv from "dotenv";
dotenv.config();
import { makeApp } from "./app";
import { fetcher } from "./fetcher";

/**
 * Entry point. Instantiate a node express server and call the fetcher
 * function to start fetching and forwarding events from the blockchain
 * to a remote service.
 */
const app = makeApp();

app.listen(process.env.PORT || 5000, fetcher);
