import axios from "axios";
import type {AxiosError} from "axios";
import type {ChainData} from "@vearnfi/config";

export type CountersDb = Readonly<{
  find: () => Promise<number>;
  update: (blockNumber: number) => Promise<number>;
}>;

export function makeCountersDb(chain: ChainData): CountersDb {
  /**
   * Fetches latest block number from the remote service.
   * @return {number} Latest block number.
   */
  async function find(): Promise<number> {
    const response = await axios
      .get(chain.getHeadEndpoint)
      .catch((error: AxiosError) => {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          `Error fetching head from remote service. Status: ${error?.response?.status}`,
        );
      });

    const data = response.data as {lastBlockNumber: number};

    return data.lastBlockNumber;
  }

  /**
   * Updates counters to the latest block number.
   * @param {number} lastBlockNumber Block number.
   * @return {number} Latest block number.
   */
  async function update(lastBlockNumber: number): Promise<number> {
    const response = await axios
      .post(
        chain.setHeadEndpoint,
        {lastBlockNumber},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .catch((error: AxiosError) => {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          `Error setting head on remote service. Status: ${error?.response?.status}`,
        );
      });

    const data = response.data as {lastBlockNumber: number};

    return data.lastBlockNumber;
  }

  return Object.freeze({
    find,
    update,
  });
}
