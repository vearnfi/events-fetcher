import type { Filter } from "../typings/types"

export type Callback = (events: Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[]) => Promise<void>

/**
 * Fetch events in batches by applying the given filter.
 * Pass resulting events back via callback.
 * @param {Filter} filter Filter.
 * @param {Callback} callback Callback function to handle events.
 * @param {number} limit Limit / batch size.
 */
export async function fetchEvents(
  filter: Filter,
  callback: Callback,
  limit: number = 20
): Promise<void> {
  let offset = 0;

  for (;;) {
    const events = await filter.apply(offset, limit);

    if (events.length === 0) break;

    await callback(events);

    offset += limit;
  }
}
