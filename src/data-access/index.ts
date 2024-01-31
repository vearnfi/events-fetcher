import {chain} from "../config";
import {makeCountersDb} from "./counters-db";
import {makeEventsDb} from "./events-db";

export const countersDb = makeCountersDb(chain);
export const eventsDb = makeEventsDb(chain);

export type {CountersDb} from "./counters-db";
export type {EventsDb} from "./events-db";
