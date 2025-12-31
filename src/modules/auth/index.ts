import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { genericOAuth } from 'better-auth/plugins';

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
    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: 'notion',
                    authentication: 'basic',
                    clientId: env.NOTION_CLIENT_ID,
                    clientSecret: env.NOTION_CLIENT_SECRET,
                    authorizationUrl: env.NOTION_AUTHORIZATION_URL,
                    tokenUrl: 'https://api.notion.com/v1/oauth/token',
                    redirectURI: env.NOTION_REDIRECT_URI,
                    responseType: 'code',
                    getUserInfo: async (token) => {
                        const response = await fetch('https://api.notion.com/v1/users/me', {
                            headers: {
                                Authorization: `Bearer ${token.accessToken}`,
                                'Notion-Version': '2022-06-28',
                            },
                        });

                        if (!response.ok) {
                            throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
                        }

                        const data = await response.json();
                        const notionBotId = data.id;
                        const user = data.bot.owner.user;

                        return {
                            id: user.id,
                            email: user.person.email,
                            emailVerified: true,
                            notionBotId: notionBotId,
                            notionUserId: user.id,
                            image: user.avatar_url,
                            name: user.name || user.person.email.split('@')[0],
                            accessToken: token.accessToken,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                    },
                },
            ],
        }),

        nextCookies(),
    ], // NOTE : Make sure to use nextCookies() at the end
    trustedOrigins: [env.BETTER_AUTH_URL],
});
