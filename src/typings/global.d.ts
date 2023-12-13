import { ChainId } from "@vearnfi/config"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      CHAIN_ID: ChainId;
    }
  }

  // type Address = `0x${string}`;
}

export {};
