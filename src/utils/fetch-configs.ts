import type { Contract } from '../blockchain/connex-utils'
import { fetchEvents } from './fetch-events';
import type { Callback, Range } from './fetch-events';

/**
 * Fetch Config events from the Trader contract and pass them
 * to the callback function.
 * @param {Contract} trader Trader contract.
 * @param {Range} range Blocks from and to to filter events.
 * @param {Callback} callback Callback function to process events.
 */
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
