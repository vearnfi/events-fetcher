import type { Contract } from '../blockchain/connex-utils'
import {getNetworkConfig} from '../config/index';
import { fetchEvents } from './fetch-events';

const networkConfig = getNetworkConfig(100010); // testnet

export async function fetchApprovals(
  vtho: Contract,
  range: { from: number, to: number },
): Promise<Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[]> {

  // Fetch `Approval` events emitted by the `VTHO` contract.
  const filter = vtho.events.Approval
    .filter([{_spender: networkConfig.trader}])
    .order("asc")
    .range({unit: "block", ...range})

  return fetchEvents(filter)
}
