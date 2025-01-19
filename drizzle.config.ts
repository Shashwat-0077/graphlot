import { Config } from "drizzle-kit";

import { envServer } from "@/lib/env/serverEnv";

export default {
    dialect: "turso",
    schema: "./src/db/schema.ts",
    out: "./drizzle/migrations",
    dbCredentials: {
        url: envServer.TURSO_CONNECTION_URL,
        authToken: envServer.TURSO_AUTH_TOKEN,
    },
} satisfies Config;
