import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {makeFetcher} from "./fetcher";
import {connect} from "./utils";
import {api} from "./api";

/**
 * Entry point. Instantiate a node express server and call the fetcher
 * function to start fetching and forwarding events from the blockchain
 * to a remote service.
 */

const app = express();

app.use(cors());

const fetcher = makeFetcher(connect, api);

app.listen(process.env.PORT || 5000, () => {
  fetcher(() => false);
});
