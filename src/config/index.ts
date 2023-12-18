import { getChainData } from "@vearnfi/config";
import { getEnvVars } from "./get-env-vars";

const { chainId } = getEnvVars();

export const chain = getChainData(chainId);
