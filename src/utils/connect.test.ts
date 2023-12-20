import { getChainData } from "@vearnfi/config"
import { connect } from "./connect"

describe("connect", () => {
  it("returns a connection object", async () => {
    // Arrange
    const chain = getChainData(100011)

    // Act
    const connection = await connect(chain)

    // Assert
    expect(connection.wConnex).not.toBeUndefined()
    expect(connection.vtho).not.toBeUndefined()
    expect(connection.trader).not.toBeUndefined()
    expect(connection.vtho.getAddress()).toEqual(chain.vtho)
    expect(connection.trader.getAddress()).toEqual(chain.trader)
  })
})
