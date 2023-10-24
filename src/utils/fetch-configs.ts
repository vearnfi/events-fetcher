import type {Contract } from '../blockchain/connex-utils'
import { fetchEvents } from './fetch-events';

export async function fetchConfigs(
  trader: Contract,
  range: { from: number, to: number },
): Promise<Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[]> {

  // Fetch `Config` events emitted by the `Trader` contract.
  const filter = trader.events.Config
    .filter([{}])
    .order("asc")
    .range({unit: "block", ...range})

  return fetchEvents(filter)
}
