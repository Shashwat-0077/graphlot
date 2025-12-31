import { createAuthClient } from 'better-auth/react';
import { genericOAuthClient } from 'better-auth/client/plugins';

import { clientEnv } from '../../lib/env/client-env';

export const authClient = createAuthClient({
    baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
    plugins: [genericOAuthClient()],
});
