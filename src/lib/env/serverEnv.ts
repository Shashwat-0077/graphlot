import { z } from "zod";

// Define server-only environment variables
const serverEnvSchema = z.object({});

// Parse and validate server environment variables
const parsedServerEnv = serverEnvSchema.safeParse(process.env);

// Handle validation errors with detailed messages
if (!parsedServerEnv.success) {
    const formattedErrors = parsedServerEnv.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n\t");

    // eslint-disable-next-line no-console
    console.error(
        "Server environment variables validation failed:",
        formattedErrors
    );

    throw new Error(
        `Invalid server environment variables: \n\t${formattedErrors}`
    );
}

// Export validated server environment variables
export const envServer = parsedServerEnv.data;
