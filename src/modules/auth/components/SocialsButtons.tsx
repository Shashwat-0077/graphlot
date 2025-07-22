'use client';
import { FcGoogle } from 'react-icons/fc';
import { SiNotion } from 'react-icons/si';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';

export function GoogleButton() {
    return (
        <Button
            className="w-full bg-primary text-foreground cursor-pointer"
            type="button"
            onClick={() => {
                authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/dashboard',
                });
            }}
        >
            Sign in with <FcGoogle />
        </Button>
    );
}

export function NotionButton() {
    return (
        <Button
            className="w-full bg-foreground text-background hover:bg-foreground-dark cursor-pointer"
            type="button"
            onClick={() => {
                authClient.signIn.oauth2({
                    providerId: 'notion',
                });
            }}
        >
            Sign in with <SiNotion />
        </Button>
    );
}
