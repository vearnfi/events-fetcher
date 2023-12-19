import axios from "axios";
// import fetch, { Response } from 'node-fetch';
import { getChainData } from "@vearnfi/config";
import { Api } from "./index";

const chain = getChainData(100011); // dev

jest.mock("axios");
// jest.mock('node-fetch', () => jest.fn());

describe("Api class", () => {
  let api: Api;

  beforeEach(() => {
    api = new Api(chain);
  });

  describe("getHead", () => {
    it("returns the head from the remote service", async () => {
      // Arrange
      const expected = 12345;
      const response = {
        status: 200,
        data: {
          lastBlockNumber: expected,
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(response);

      // Act
      const actual = await api.getHead();

      // Assert
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(expected).toBe(actual);
    });

    it("throws when there is an error fetching the head", async () => {
      // Arrange
      const response = {
        status: 500,
      };
      (axios.get as jest.Mock).mockResolvedValue(response);
      // (axios.get as jest.Mock).mockRejectedValue(new Error());

      // Act

      // Assert
      await expect(api.getHead()).rejects.toThrow("Error fetching head from remote service");
    });
  });

  describe("forwardEvents", () => {
    it("forwards events to the remote service", async () => {});

    it("throws when there is an error forwarding the events", async () => {});
  });
});
