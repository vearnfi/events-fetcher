declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      CHAIN_ID?: string;
    }
  }

  // type Address = `0x${string}`;
}

export {};
