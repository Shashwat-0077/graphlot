import { headers } from 'next/headers';

import { db } from '@/db';
import { auth } from '@/modules/auth';

export async function createContext() {
    const response = await auth.api.getSession({
        headers: await headers(), // you need to pass the headers object.
    });

    if (!(response && response?.session && response?.user)) {
        throw new Error('Unauthorized');
    }

    const user = response.user;

    return {
        db,
        user,
    };
}

export type YogaContext = Awaited<ReturnType<typeof createContext>>;
