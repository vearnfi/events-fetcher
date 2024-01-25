import {chain} from "../config";
import {makeApi} from "./api";

export const api = makeApi(chain);

export type {Api} from "./api";
