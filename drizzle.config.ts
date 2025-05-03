import { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default {
    dialect: "turso",
    schema: "./src/db/schema.ts",
    out: "./drizzle/migrations",
    dbCredentials: {
        url: process.env.TURSO_CONNECTION_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!, // TODO : Uncomment this line if you are pushing it to production
    },
} satisfies Config;
