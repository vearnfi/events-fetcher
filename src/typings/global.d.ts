declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      GCLOUD_PROJECT: string;
      CHAIN_ID: 100010 | 100009;
      WALLET_PRIVATE_KEY: string;
    }
  }

  // type Address = `0x${string}`;
}

export {};
