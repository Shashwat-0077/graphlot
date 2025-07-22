import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_PORT: z.string({ error: 'Required' }),
    NEXT_PUBLIC_APP_URL: z.url('Invalid URL'),
    TURSO_CONNECTION_URL: z.url('Invalid URL'),
    TURSO_AUTH_TOKEN: z.string({ error: 'Required' }),
    BETTER_AUTH_SECRET: z.string({ error: 'Required' }),
    BETTER_AUTH_URL: z.url('Invalid URL'),
    GOOGLE_CLIENT_ID: z.string({ error: 'Required' }),
    GOOGLE_CLIENT_SECRET: z.string({ error: 'Required' }),
    NOTION_CLIENT_ID: z.string({ error: 'Required' }),
    NOTION_CLIENT_SECRET: z.string({ error: 'Required' }),
    // AUTH_NOTION_REDIRECT_URI: z.url('Invalid URL'),
    // AUTH_DRIZZLE_URL: z.url('Invalid URL'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const formatted = parsed.error.format();

    // eslint-disable-next-line no-console
    console.error('\x1b[31m%s\x1b[0m', '\n❌ Invalid or missing environment variables:\n');

    let errorCount = 0;

    for (const key in formatted) {
        if (key === '_errors') continue;

        const issues = (formatted as Record<string, { _errors?: string[] }>)[key]?._errors;
        if (issues && issues.length > 0) {
            errorCount++;
            // eslint-disable-next-line no-console
            console.error(`  ❌ ${key}: \x1b[90m${issues[0]}\x1b[0m`);
        }
    }
    // eslint-disable-next-line no-console
    console.error(`\n\x1b[31m✘ ${errorCount} variable(s) failed validation.\x1b[0m`);
    throw new Error('❌ Env validation failed.\n');
}

const env = parsed.data;

// Auto-split into client and server
const clientEnv: Record<string, string> = {};
const serverEnv: Record<string, string> = {};

for (const key in env) {
    if (key.startsWith('NEXT_PUBLIC_')) {
        clientEnv[key] = env[key as keyof typeof env];
    } else {
        serverEnv[key] = env[key as keyof typeof env];
    }
}

export { env, clientEnv, serverEnv };
