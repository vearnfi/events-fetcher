import axios from "axios";
import type {AxiosError} from "axios";
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
  console.log({status, data});

  if (status === "SUCCESS") {
    return;
  }

  try {
    await axios
      .post(DISCORD_WEBHOOK_URL, {
        content: JSON.stringify({status, data}, null, 2),
        username: "events-fetcher",
      })
      .catch((error: AxiosError) => {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          `Error sending alert to discord. Status: ${error?.response?.status}`,
        );
      });
  } catch (error) {
    console.log(error);
  }
}
