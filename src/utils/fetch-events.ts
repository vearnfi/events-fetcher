const STEP = 20;

export async function fetchEvents(
  filter: Connex.Thor.Filter<"event", Connex.Thor.Account.WithDecoded>,
): Promise<Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[]> {
  return new Promise(async (resolve, reject) => {
      try {
        let events: Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[] = [];

        let offset = 0;
        for (;;) {
          const output = await filter.apply(offset, STEP)
          if (output.length === 0) break;
          events = [...events, ...output];
          offset += STEP;
        }

        resolve(events);
      } catch (error) {
        reject(error);
      }
    })
}
