import { getChainData } from "@vearnfi/config";
import { getEnvVars } from "./get-env-vars";

const { CHAIN_ID } = getEnvVars();

export const chain = getChainData(CHAIN_ID);

console.log({CHAIN_ID, chain})

/**
 * List of domains that have been whitelisted for server interaction.
 */
// export const CORS = ["https://main--symphonious-macaron-41163f.netlify.app"];

// export type DexName = "verocket" | "vexchange"

// export type Dex = {
//    /** DEX name. */
//    name: DexName;
//    /** UniV2 router contract address. */
//    routerV2: Address;
//    /** VVET-VTHO pair contract address. */
//    pairVVET_VTHO: Address;
//  }

// export type NetworkConfig = {
//    /** Network name. */
//    name: string;
//    /** Vechain RPC endpoint. */
//    rpc: string;
//    /** VTHO/Energy contract address. */
//    vtho: Address;
//    /** VVET contract address. */
//    vvet: Address;
//    /** List of supported DEXs. */
//    dexs: Dex[];
//    /** Trader contract address. */
//    trader: Address;
//    /** Register events endpoint. */
//    registerEventsEndpoint: string;
//    /** Endpoint to fetch lastest block number. */
//    getHeadEndpoint: string;
//  }

// export type ChainId =  100009 | 100010 | 100011
// // ^ 100009 = production, 100010 = staging, 100011 = development

//  const networkConfig: Record<ChainId, NetworkConfig> = {
//    100009: {
//      name: "mainnet",
//      rpc: "https://mainnet.veblocks.net/",
//      vtho: "0x0000000000000000000000000000456E65726779", // token0
//      vvet: "0x45429a2255e7248e57fce99e7239aed3f84b7a53", // token1
//      dexs: [
//        {
//          name: "verocket",
//          routerV2: "0x576da7124c7bb65a692d95848276367e5a844d95",
//          pairVVET_VTHO: "0x29a996b0ebb7a77023d091c9f2ca34646bea6ede",
//        },
//        {
//          name: "vexchange",
//          routerV2: "0x6c0a6e1d922e0e63901301573370b932ae20dadb",
//          pairVVET_VTHO: "0x0000000000000000000000000000000000000000", // TODO
//        },
//      ],
//      trader: "0x0000000000000000000000000000000000000000", // TODO
//      getHeadEndpoint: "https://",
//      registerEventsEndpoint: "https://",
//    },
//    100010: {
//      name: "testnet",
//      rpc: "https://testnet.veblocks.net/",
//      vtho: "0x0000000000000000000000000000456E65726779", // token0
//      vvet: "0x86fb5343bbecffc86185c023a2a6ccc76fc0afd8", // token1
//      dexs: [
//        {
//          name: "verocket",
//          routerV2: "0x91e42759290239a62ac757cf85bb5b74ace57927",
//          pairVVET_VTHO: "0x1e5e9a6540b15a3efa8d4e8fadb82cc8e0e167ca",
//        },
//        {
//          name: "vexchange",
//          routerV2: "0x01d6b50b31c18d7f81ede43935cadf79901b0ea0",
//          pairVVET_VTHO: "0x0000000000000000000000000000000000000000",
//        },
//      ],
//      trader: "0x0317B19b8b94aE1D5Bfb4727b9064fe8118aA305",
//      getHeadEndpoint: "https://gethead-3co32ksh6a-uc.a.run.app",
//      registerEventsEndpoint: "https://registerevents-3co32ksh6a-uc.a.run.app",
//    },
//    100011: {
//      name: "testnet",
//      rpc: "https://testnet.veblocks.net/",
//      vtho: "0x0000000000000000000000000000456E65726779", // token0
//      vvet: "0x86fb5343bbecffc86185c023a2a6ccc76fc0afd8", // token1
//      dexs: [
//        {
//          name: "verocket",
//          routerV2: "0x91e42759290239a62ac757cf85bb5b74ace57927",
//          pairVVET_VTHO: "0x1e5e9a6540b15a3efa8d4e8fadb82cc8e0e167ca",
//        },
//        {
//          name: "vexchange",
//          routerV2: "0x01d6b50b31c18d7f81ede43935cadf79901b0ea0",
//          pairVVET_VTHO: "0x0000000000000000000000000000000000000000",
//        },
//      ],
//      trader: "0x0317B19b8b94aE1D5Bfb4727b9064fe8118aA305",
//      getHeadEndpoint: "http://127.0.0.1:5001/vefarmdev/us-central1/gethead",
//      registerEventsEndpoint: "http://127.0.0.1:5001/vefarmdev/us-central1/registerevents",
//    },
//  };

//  /**
//   * Get network configuration associated to the given chainId.
//   * @param {ChainId} chainId Chain id.
//   * @return {NetworkConfig} Network configuration.
//   */
//  export function getNetworkConfig(chainId: ChainId): NetworkConfig {
//    return networkConfig[chainId];
//  }
