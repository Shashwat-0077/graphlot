import { createAuthClient } from 'better-auth/client';
import { genericOAuthClient } from 'better-auth/client/plugins';

import { clientEnv } from '../env/client-env';

export const authClient = createAuthClient({
    baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
    plugins: [genericOAuthClient()],
});
