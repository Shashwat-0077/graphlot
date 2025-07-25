import { z } from 'zod';

// Define server-only environment variables
const serverEnvSchema = z.object({
    TURSO_CONNECTION_URL: z.url(),
    TURSO_AUTH_TOKEN: z.string(),

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NOTION_CLIENT_ID: z.string(),
    NOTION_CLIENT_SECRET: z.string(),
    NOTION_REDIRECT_URI: z.url(),
    NOTION_AUTHORIZATION_URL: z.url(),
});

// Parse and validate server environment variables
const parsedServerEnv = serverEnvSchema.safeParse(process.env);
// Handle validation errors with detailed messages
if (!parsedServerEnv.success) {
    const formattedErrors = parsedServerEnv.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n\t');

    // eslint-disable-next-line no-console
    console.error(`Server environment variables validation failed: \n\t${formattedErrors}`);

    throw new Error(`Invalid server environment variables: \n\t${formattedErrors}`);
}

// Export validated server environment variables
export const env = parsedServerEnv.data;
