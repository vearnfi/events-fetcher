import {getChainData} from "@vearnfi/config";
import {makeGetEvents} from "./get-events";

const mockLogger = jest.fn(({status, data}) => Promise.resolve());

describe("get events controller", () => {
  const chain = getChainData(100010);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("forwards errors to logger", async () => {
    // Arrange
    expect.assertions(4);
    const mockFetchEvents = () => {
      throw new Error("Bam!");
    };
    const getEvents = makeGetEvents(mockFetchEvents, mockLogger);

    // Act
    await expect(getEvents(() => false /* Infinite loop */)).rejects.toThrow(
      "Bam!",
    );

    // Assert
    expect(mockLogger.mock.calls).toHaveLength(1);
    expect(mockLogger.mock.calls[0][0].status).toBe("ERROR");
    expect(mockLogger.mock.calls[0][0].data).toEqual("getEvents: Bam!");
  });
});
