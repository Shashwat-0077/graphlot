import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { db } from '@/db';
import * as schema from '@/modules/auth/schema';
import { env } from '@/lib/env';

export const auth = betterAuth({
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },

    database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema: schema,
    }),
    plugins: [nextCookies()], // NOTE : Make sure to use nextCookies() at the end
});
