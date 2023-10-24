// export const SC_ADDRESS = '0xC8e27e7CC8EC21A0CE6921148Ab2EcC9E3536233';  //Testnet MP Address
// export const SC_ABI = [
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": true,
//                 "internalType": "uint256",
//                 "name": "tokenId",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": true,
//                 "internalType": "address",
//                 "name": "lister",
//                 "type": "address"
//             },
//             {
//                 "components": [
//                     {
//                         "internalType": "address",
//                         "name": "tokenOwner",
//                         "type": "address"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "itemId",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "tokenId",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "startTime",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "endTime",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "reserveTokenPrice",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "buyoutTokenPrice",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "enum IMarketplace.ListingType",
//                         "name": "listingType",
//                         "type": "uint8"
//                     }
//                 ],
//                 "indexed": false,
//                 "internalType": "struct IMarketplace.MarketItem",
//                 "name": "newItem",
//                 "type": "tuple"
//             }
//         ],
//         "name": "EventName",
//         "type": "event"
//     }
// ]
import { Address } from "../typings/types";

/**
 * List of domains that have been whitelisted for server interaction.
 */
 export const CORS = ["https://main--symphonious-macaron-41163f.netlify.app"];

export type DexName = "verocket" | "vexchange"

export type Dex = {
   /** DEX name. */
   name: DexName;
   /** UniV2 router contract address. */
   routerV2: Address;
   /** VVET-VTHO pair contract address. */
   pairVVET_VTHO: Address;
 }

export type NetworkConfig = {
   /** Network name. */
   name: string;
   /** Vechain RPC endpoint. */
   rpc: string;
   /** VTHO/Energy contract address. */
   vtho: Address;
   /** VVET contract address. */
   vvet: Address;
   /** List of supported DEXs. */
   dexs: Dex[];
   /** Trader contract address. */
   trader: Address;
 }

export type ChainId = 100010 | 100009

 const networkConfig: Record<ChainId, NetworkConfig> = {
   100009: {
     name: "mainnet",
     rpc: "https://mainnet.veblocks.net/",
     vtho: "0x0000000000000000000000000000456E65726779", // token0
     vvet: "0x45429a2255e7248e57fce99e7239aed3f84b7a53", // token1
     dexs: [
       {
         name: "verocket",
         routerV2: "0x576da7124c7bb65a692d95848276367e5a844d95",
         pairVVET_VTHO: "0x29a996b0ebb7a77023d091c9f2ca34646bea6ede",
       },
       {
         name: "vexchange",
         routerV2: "0x6c0a6e1d922e0e63901301573370b932ae20dadb",
         pairVVET_VTHO: "0x0000000000000000000000000000000000000000", // TODO
       },
     ],
     trader: "0x0000000000000000000000000000000000000000", // TODO
   },
   100010: {
     name: "testnet",
     rpc: "https://testnet.veblocks.net/",
     vtho: "0x0000000000000000000000000000456E65726779", // token0
     vvet: "0x86fb5343bbecffc86185c023a2a6ccc76fc0afd8", // token1
     dexs: [
       {
         name: "verocket",
         routerV2: "0x91e42759290239a62ac757cf85bb5b74ace57927",
         pairVVET_VTHO: "0x1e5e9a6540b15a3efa8d4e8fadb82cc8e0e167ca",
       },
       {
         name: "vexchange",
         routerV2: "0x01d6b50b31c18d7f81ede43935cadf79901b0ea0",
         pairVVET_VTHO: "0x0000000000000000000000000000000000000000",
       },
     ],
     trader: "0x0317B19b8b94aE1D5Bfb4727b9064fe8118aA305",
   },
 };

 /**
  * Get network configuration associated to the given chainId.
  * @param {ChainId} chainId Chain id.
  * @return {NetworkConfig} Network configuration.
  */
 export function getNetworkConfig(chainId: ChainId): NetworkConfig {
   return networkConfig[chainId];
 }
