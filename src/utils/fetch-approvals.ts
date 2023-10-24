import type { Contract } from '../blockchain/connex-utils'
import type { NetworkConfig } from '../config/index';
import { fetchEvents } from './fetch-events';
import type { Callback, Range } from './fetch-events';

export async function fetchApprovals(
  networkConfig: NetworkConfig,
  vtho: Contract,
  range: Range,
  callback: Callback,
): Promise<void> {

  // Fetch `Approval` events emitted by the `VTHO` contract.
  const filter = vtho.events.Approval
    .filter([{_spender: networkConfig.trader}])
    .order("asc")
    .range({unit: "block", ...range})

  await fetchEvents(filter, callback)
}
