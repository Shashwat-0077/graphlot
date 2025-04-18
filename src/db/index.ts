import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { env } from "@/lib/env";
import * as schema from "@/db/schema";

console.log("here");

const client = createClient({
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN, // TODO : Uncomment this line if you are pushing it to production
});

console.log(client);

export const db = drizzle(client, { schema });
