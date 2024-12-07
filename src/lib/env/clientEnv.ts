import { z } from "zod";

// Define client-accessible environment variables
const clientEnvSchema = z.object({
    NEXT_PUBLIC_PORT: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

// Parse and validate client environment variables
const parsedClientEnv = clientEnvSchema.safeParse({
    NEXT_PUBLIC_PORT: process.env.NEXT_PUBLIC_PORT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

// Handle validation errors with detailed messages
if (!parsedClientEnv.success) {
    const formattedErrors = parsedClientEnv.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n\t");

    // eslint-disable-next-line no-console
    console.error(
        "Client environment variables validation failed:",
        formattedErrors
    );

    throw new Error(
        `Invalid client environment variables: \n\t${formattedErrors}`
    );
}

// Export validated client environment variables
export const envClient = parsedClientEnv.data;
