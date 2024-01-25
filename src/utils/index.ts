import {chain} from "../config";
import {makeConnect} from "./connect";

export const connect = makeConnect(chain);

export type {Connect} from "./connect";
