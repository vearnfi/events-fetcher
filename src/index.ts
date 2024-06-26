import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {errorHandler} from "./utils/error-handler";
import {getEvents} from "./controllers";

/**
 * Entry point. Instantiate a node express server and call the getEvents
 * controller to start fetching and forwarding events from the blockchain
 * to a remote service.
 */

const app = express();

app.use(cors());

// Catch all errors
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  getEvents(() => false);
});
