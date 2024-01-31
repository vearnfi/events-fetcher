import {fetchEvents} from "../use-cases";
import {logger} from "../utils/logger";
import {makeGetEvents} from "./get-events";

export const getEvents = makeGetEvents(fetchEvents, logger);

export type {GetEvents} from "./get-events";
