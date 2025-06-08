import { hc } from "hono/client";

import type { AppType } from "@/app/api/[[...route]]/route"; // eslint-disable-line
import { envClient } from "./env/clientEnv";

export const client = hc<AppType>(envClient.NEXT_PUBLIC_APP_URL);
