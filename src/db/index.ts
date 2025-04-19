import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { env } from "@/lib/env";
import * as schema from "@/db/schema";

const client = createClient({
    url: env.TURSO_CONNECTION_URL,
    // authToken: env.TURSO_AUTH_TOKEN, // TODO : Uncomment this line if you are pushing it to production
});

export const db = drizzle(client, { schema });
