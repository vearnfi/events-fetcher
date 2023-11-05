import {getNetworkConfig} from '../config/index';
import {getEnvVars} from '../config/get-env-vars'
import type {RawEvent, EventType} from "../typings/types"

const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(CHAIN_ID);

const postOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
}

/**
 * Forward events via endpoint call to consumer service.
 * @param {EventType} eventType Event type.
 * @return {string} Response.
 */
export async function forwardEvents(
  eventType: EventType,
  events: RawEvent[],
): Promise<string> {
    const url = `${networkConfig.registerEventsEndpoint}?eventType=${eventType}`

    const response = await fetch(url, {
      ...postOptions,
      body: JSON.stringify(events),
    });

    return response.text();
  }
