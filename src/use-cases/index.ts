import {chain} from "../config";
import {countersDb, eventsDb} from "../data-access";
import {makeConnect} from "../utils/connect";
import {makeFetchEvents} from "./fetch-events";

const connect = makeConnect(chain);

export const fetchEvents = makeFetchEvents(connect, countersDb, eventsDb);

export type {Stop, FetchEvents} from "./fetch-events";
