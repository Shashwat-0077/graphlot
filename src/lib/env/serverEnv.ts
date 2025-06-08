import { z } from "zod";

// Define server-only environment variables
const serverEnvSchema = z.object({
    NODE_ENV: z.string(),
    TURSO_CONNECTION_URL: z.string().url(),
    TURSO_AUTH_TOKEN: z.string(),

    AUTH_SECRET: z.string(),
    AUTH_URL: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    AUTH_NOTION_ID: z.string(),
    AUTH_NOTION_SECRET: z.string(),
    AUTH_NOTION_REDIRECT_URI: z.string().url(),
    AUTH_DRIZZLE_URL: z.string().url(),
});

// Parse and validate server environment variables
const parsedServerEnv = serverEnvSchema.safeParse(process.env);
// Handle validation errors with detailed messages
if (!parsedServerEnv.success) {
    const formattedErrors = parsedServerEnv.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n\t");

    // eslint-disable-next-line no-console
    console.error(
        `Server environment variables validation failed: \n\t${formattedErrors}`
    );

    throw new Error(
        `Invalid server environment variables: \n\t${formattedErrors}`
    );
}

// Export validated server environment variables
export const envServer = parsedServerEnv.data;
