declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      CHAIN_ID: 100010 | 100009;
    }
  }

  // type Address = `0x${string}`;
}

export {};
