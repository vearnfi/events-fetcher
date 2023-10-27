import type { Contract } from '../blockchain/connex-utils'
import {getNetworkConfig} from '../config/index';
import {getEnvVars} from '../config/get-env-vars'
import { fetchEvents } from './fetch-events';
import type { Callback, Range } from './fetch-events';

const {CHAIN_ID} = getEnvVars();

const networkConfig = getNetworkConfig(CHAIN_ID);

/**
 * Fetch Approval events from the VTHO contract and pass them
 * to the callback function.
 * @param {Contract} vtho VTHO contract.
 * @param {Range} range Blocks from and to to filter events.
 * @param {Callback} callback Callback function to process events.
 */
export async function fetchApprovals(
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
