import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as schema from "@/db/schema";
import { envServer } from "@/lib/env";

const client = createClient({
    url: envServer.TURSO_CONNECTION_URL,
    // authToken: envServer.TURSO_AUTH_TOKEN, // TODO : Uncomment this line if you are pushing it to production
});

export const db = drizzle(client, { schema });
