import type {Contract } from '../blockchain/connex-utils'
import { fetchEvents } from './fetch-events';
import type { Callback, Range } from './fetch-events';

export async function fetchConfigs(
  trader: Contract,
  range: Range,
  callback: Callback,
): Promise<void> {

  // Fetch `Config` events emitted by the `Trader` contract.
  const filter = trader.events.Config
    .filter([{}])
    .order("asc")
    .range({unit: "block", ...range})

  await fetchEvents(filter, callback)
}
