import { hc } from "hono/client";

import type { AppType } from "@/app/api/v1/[[...route]]/route";

import { clientEnv } from "./env/client-env";

export const client = hc<AppType>(clientEnv.NEXT_PUBLIC_APP_URL);
