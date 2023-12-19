import axios from "axios"
// import fetch, { Response } from 'node-fetch';
import { getChainData } from "@vearnfi/config"
import { Api } from "./index";

const chain = getChainData(100011) // dev

jest.mock('axios');
// jest.mock('node-fetch', () => jest.fn());

describe("Api class", () => {
  let api: Api

  beforeEach(() => {
    api = new Api(chain)
  })

  describe("getHead", () => {
    it.only("gets the head from the remote service", async () => {
      // Arrange
      const response = {
        status: 200,
        data: {
          lastBlockNumber: 12345,
        }
      };
      (axios.get as jest.Mock).mockResolvedValue(response);
      // (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new Response(JSON.stringify({hola: 1})));


      // Act
      await api.getHead()

      // Assert
        expect(axios.get).toHaveBeenCalledTimes(1);
  // expect(axios.get).toHaveBeenCalledWith('https://website.com/users', {
  //   method: 'POST',
  // });
    });

    it("throws when there is an error fetching the head", async () => {});
  });

  describe("forwardEvents", () => {
    it("forwards events to the remove service", async () => {});

    it("throws when there is an error forwarding the events", async () => {});
  });
});
