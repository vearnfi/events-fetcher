declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      CHAIN_ID?: string;
      DISCORD_WEBHOOK_URL?: string;
    }
  }

  // type Address = `0x${string}`;
}

export {};
