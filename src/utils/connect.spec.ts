import {getChainData} from "@vearnfi/config";
import {Connect, makeConnect} from "./connect";

describe("connect", () => {
  const chain = getChainData(100011);
  let connect: Connect;

  beforeEach(async () => {
    connect = makeConnect(chain);
  });

  it("returns a connection object", async () => {
    // Arrange

    // Act
    const connection = await connect();

    // Assert
    expect(connection.wConnex).not.toBeUndefined();
    expect(connection.vtho).not.toBeUndefined();
    expect(connection.trader).not.toBeUndefined();
    expect(connection.vtho.getAddress()).toEqual(chain.vtho);
    expect(connection.trader.getAddress()).toEqual(chain.trader);
  });
});
