import axios from "axios";
import {getEnvVars} from "../config/get-env-vars";

const {DISCORD_WEBHOOK_URL} = getEnvVars();

export type Logger = ({
  status,
  data,
}: {
  status: "SUCCESS" | "ERROR";
  data: unknown;
}) => Promise<void>;

export async function logger({
  status,
  data,
}: {
  status: "SUCCESS" | "ERROR";
  data: unknown;
}): Promise<void> {
  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: JSON.stringify({status, data}, null, 2),
      username: "events-fetcher",
    });
  } catch (error) {
    console.log(error);
  }
}
