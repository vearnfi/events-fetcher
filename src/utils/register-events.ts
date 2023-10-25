import {getNetworkConfig} from '../config/index';
import {getEnvVars} from '../config/get-env-vars'
import type {RawEvent} from "../typings/types"

const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(CHAIN_ID);

const postOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
}

export type EventType = "APPROVAL" | "CONFIG" | "SWAP"

export function registerEvents(
  eventType: EventType,
): (events: RawEvent[]) => Promise<void> {
  return async function(events: RawEvent[]): Promise<void> {
    console.log({events: JSON.stringify(events, null)});

    const url = `${networkConfig.registerEventsEndpoint}?eventType=${eventType}`

    const response = await fetch(url, {
      ...postOptions,
      body: JSON.stringify(events),
    });

    const body = await response.text();

    console.log(body);
  }
}
