// import type {BigNumber} from "bignumber.js";

export type Address = `0x${string}`;

export type AbiType =
  | "function"
  | "constructor"
  | "event"
  | "fallback"
  | "receive";

export type StateMutabilityType = "pure" | "view" | "nonpayable" | "payable";

export type AbiItem = {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: AbiInput[];
  name?: string;
  outputs?: AbiOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType;
  type: AbiType;
  gas?: number;
};

export type AbiInput = {
  name: string;
  type: string;
  indexed?: boolean;
  components?: AbiInput[];
  internalType?: string;
};

export type AbiOutput = {
  name: string;
  type: string;
  components?: AbiOutput[];
  internalType?: string;
};

export type RawEvent = Connex.Thor.Filter.Row<
  "event",
  Connex.Thor.Account.WithDecoded
>

export type Filter = Connex.Thor.Filter<"event", Connex.Thor.Account.WithDecoded>;

export const EVENT_TYPES = ["APPROVAL", "CONFIG", "SWAP"] as const;

export type EventType = (typeof EVENT_TYPES)[number] // "APPROVAL" | "CONFIG" | "SWAP"
