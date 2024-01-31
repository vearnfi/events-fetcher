import {getChainData} from "@vearnfi/config";
import {getEnvVars} from "./get-env-vars";

const {CHAIN_ID} = getEnvVars();

export const chain = getChainData(CHAIN_ID);
