import axios from "axios";
import { getChainData } from "@vearnfi/config";
import { Api } from "./index";
import * as approvalEvents from "../__tests__/fixtures/approval-events.json";

const chain = getChainData(100011); // dev

jest.mock("axios");

describe("Api class", () => {
  let api: Api;

  beforeEach(() => {
    api = new Api(chain);
  });

  describe("getHead", () => {
    it("fetches the head from the remote service", async () => {
      // Arrange
      const expected = 12345;
      const response = {
        status: 200,
        statusText: "OK",
        data: {
          lastBlockNumber: expected,
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(response);

      // Act
      const actual = await api.getHead();

      // Assert
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(expected).toEqual(actual);
    });

    it("throws when there is an error fetching the head", async () => {
      // Arrange
      const error = {
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Internal Server Error",
        },
      };
      (axios.get as jest.Mock).mockRejectedValue(error);

      // Act + Assert
      await expect(api.getHead()).rejects.toThrow(
        "Error fetching head from remote service. Status: 500",
      );
    });
  });

  describe("forwardEvents", () => {
    it("returns status 200 when the events are correctly sent", async () => {
      // Arrange
      const expected = 200;
      const response = {
        status: expected,
        statusText: "OK",
      };
      (axios.post as jest.Mock).mockResolvedValue(response);

      // Act
      const actual = await api.forwardEvents("APPROVAL", approvalEvents.events);

      // Assert
      expect(expected).toEqual(actual);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it("throws with a 400 status error when passing an empty array of events", async () => {
      // Arrange
      const error = {
        response: {
          status: 400,
          statusText: "Bad Request",
          data: "Bad request",
        },
      };
      (axios.post as jest.Mock).mockRejectedValue(error);

      // Act + Assert
      await expect(api.forwardEvents("APPROVAL", [])).rejects.toThrow(
        "Error forwarding events to the remote service. Status: 400",
      );
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it("throws with a 500 status error when there is an internal server error", async () => {
      // Arrange
      const error = {
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Internal Server Error",
        },
      };
      (axios.post as jest.Mock).mockRejectedValue(error);

      // Act + Assert
      await expect(
        api.forwardEvents("APPROVAL", approvalEvents.events),
      ).rejects.toThrow(
        "Error forwarding events to the remote service. Status: 500",
      );
    });
  });
});
