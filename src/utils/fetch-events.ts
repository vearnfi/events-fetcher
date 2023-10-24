export type Filter = Connex.Thor.Filter<"event", Connex.Thor.Account.WithDecoded>;

export type Callback = (events: Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[]) => Promise<void>

export type Range = { from: number, to: number }

const STEP = 20;
// const STEP = 1;

/**
 * Fetch events based on filter and handle said events to the callback for processing.
 * @param {Filter} filter Filter to be applied.
 * @param {Callback} callback Callback function to handle events.
 */
export async function fetchEvents(filter: Filter, callback: Callback): Promise<void> {
  let offset = 0;

  for (;;) {
    const events = await filter.apply(offset, STEP);

    if (events.length === 0) break;

    await callback(events);

    offset += STEP;
  }
}

// const STEP = 20;

// export async function fetchEvents(
//   filter: Connex.Thor.Filter<"event", Connex.Thor.Account.WithDecoded>,
// ): Promise<Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[]> {
//   return new Promise(async (resolve, reject) => {
//       try {
//         let events: Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[] = [];

//         let offset = 0;
//         for (;;) {
//           const output = await filter.apply(offset, STEP)
//           if (output.length === 0) break;
//           events = [...events, ...output];
//           offset += STEP;
//         }

//         resolve(events);
//       } catch (error) {
//         reject(error);
//       }
//     })
// }
