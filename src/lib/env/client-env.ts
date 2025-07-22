import { z } from 'zod';

// Define client-accessible environment variables
const clientEnvSchema = z.object({
    NODE_ENV: z.string(),
    NEXT_PUBLIC_PORT: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
});

// Parse and validate client environment variables
const parsedClientEnv = clientEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_PORT: process.env.NEXT_PUBLIC_PORT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

// Handle validation errors with detailed messages
if (!parsedClientEnv.success) {
    const formattedErrors = parsedClientEnv.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n\t');

    // eslint-disable-next-line no-console
    console.error('Client environment variables validation failed:', formattedErrors);

    throw new Error(`Invalid client environment variables: \n\t${formattedErrors}`);
}

// Export validated client environment variables
export const clientEnv = parsedClientEnv.data;
