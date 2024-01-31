import axios from "axios";
import {getChainData} from "@vearnfi/config";
import {makeFakeEvents} from "../__tests__/fixtures/events";
import {EVENT_TYPES} from "../typings/types";
import {makeEventsDb} from "./events-db";

jest.mock("axios");

describe("events db", () => {
  const chain = getChainData(100011); // dev
  const eventsDb = makeEventsDb(chain);

  EVENT_TYPES.forEach((eventType) => {
    it(`inserts events correctly - ${eventType}`, async () => {
      // Arrange
      expect.assertions(2);
      const events = makeFakeEvents(eventType);
      const response = {
        status: 201,
        statusText: "OK",
        data: {
          inserted: events,
        },
      };
      (axios.post as jest.Mock).mockResolvedValue(response);

      // Act
      const actual = await eventsDb.insert(eventType, events);

      // Assert
      expect(actual).toEqual(events);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  EVENT_TYPES.forEach((eventType) => {
    it(`throws with a 400 status error when passing an empty array of events - ${eventType}`, async () => {
      // Arrange
      expect.assertions(2);
      const error = {
        response: {
          status: 400,
          statusText: "Bad Request",
          data: "Bad request",
        },
      };
      (axios.post as jest.Mock).mockRejectedValue(error);

      // Act + Assert
      await expect(eventsDb.insert(eventType, [])).rejects.toThrow(
        "Error forwarding events to the remote service. Status: 400",
      );
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  EVENT_TYPES.forEach((eventType) => {
    it(`throws with a 500 status error when there is an internal server error - ${eventType}`, async () => {
      // Arrange
      expect.assertions(1);
      const events = makeFakeEvents(eventType);
      const error = {
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Internal Server Error",
        },
      };
      (axios.post as jest.Mock).mockRejectedValue(error);

      // Act + Assert
      await expect(eventsDb.insert(eventType, events)).rejects.toThrow(
        "Error forwarding events to the remote service. Status: 500",
      );
    });
  });
});
