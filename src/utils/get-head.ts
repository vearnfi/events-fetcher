/**
 * Fetch latest block number from the given url.
 * @param {string} url Target url
 * @return {number} Latest block number.
 */
export async function getHead(url: string): Promise<number> {
  try {
    const response = await fetch(url);

    const json = (await response.json()) as { lastBlockNumber: number };

    return json.lastBlockNumber;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
