import type {FetchEvents} from "../use-cases";
import type {Logger} from "../utils/logger";

export type GetEvents = (
  stop: (blockNumber: number) => boolean,
) => Promise<void>;

export function makeGetEvents(
  fetchEvents: FetchEvents,
  logger: Logger,
): GetEvents {
  return async function getEvents(
    stop: (blockNumber: number) => boolean,
  ): Promise<void> {
    try {
      await fetchEvents(stop);
    } catch (error: any) {
      await logger({
        status: "ERROR",
        data: `getEvents: ${error?.message || "Unknown error occurred"}`,
      });

      // Bubble error up
      throw new Error(error);
    }
  };
}
