export const EVENT_TYPES = ["APPROVAL", "CONFIG", "SWAP"] as const;

export type EventType = (typeof EVENT_TYPES)[number]; // "APPROVAL" | "CONFIG" | "SWAP"
