export type RawEvent = Connex.Thor.Filter.Row<
  "event",
  Connex.Thor.Account.WithDecoded
>

export type Filter = Connex.Thor.Filter<"event", Connex.Thor.Account.WithDecoded>;

export const EVENT_TYPES = ["APPROVAL", "CONFIG", "SWAP"] as const;

export type EventType = (typeof EVENT_TYPES)[number] // "APPROVAL" | "CONFIG" | "SWAP"
