import axios from "axios";
import {getChainData} from "@vearnfi/config";
import {makeCountersDb} from "./counters-db";

jest.mock("axios");

describe("counters db", () => {
  const chain = getChainData(100011); // dev
  const countersDb = makeCountersDb(chain);

  it("fetches (finds) the head from the remote service", async () => {
    // Arrange
    expect.assertions(2)
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
    const actual = await countersDb.find();

    // Assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(expected).toEqual(actual);
  });

  it("throws when there is an error fetching the head", async () => {
    // Arrange
    expect.assertions(1);
    const error = {
      response: {
        status: 500,
        statusText: "Internal Server Error",
        data: "Internal Server Error",
      },
    };
    (axios.get as jest.Mock).mockRejectedValue(error);

    // Act + Assert
    await expect(countersDb.find()).rejects.toThrow(
      "Error fetching head from remote service. Status: 500",
    );
  });

  it("updates the head", async () => {
    // Arrange
    expect.assertions(2)
    const expected = 1234;
    const response = {
      status: expected,
      statusText: "OK",
      data: {
        lastBlockNumber: expected,
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(response);

    // Act
    const actual = await countersDb.update(expected);

    // Assert
    expect(actual).toEqual(expected);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

    it("throws when there is an error updating the head", async () => {
    // Arrange
    expect.assertions(1);
    const error = {
      response: {
        status: 500,
        statusText: "Internal Server Error",
        data: "Internal Server Error",
      },
    };
    (axios.post as jest.Mock).mockRejectedValue(error);

    // Act + Assert
    await expect(countersDb.update(1234)).rejects.toThrow(
      "Error setting head on remote service. Status: 500",
    );
  });
});
