'use client';

import { FcGoogle } from 'react-icons/fc';
import { SiNotion } from 'react-icons/si';

import { Button } from '@/components/ui/button';
import { authClient } from '@/modules/auth/client';

export function GoogleButton() {
    return (
        <Button
            className="group relative w-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-200 ease-out hover:scale-[1.02] px-4 py-2 h-10 font-medium rounded-lg overflow-hidden text-sm cursor-pointer"
            type="button"
            onClick={() => {
                authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/dashboard',
                });
            }}
        >
            <div className="relative flex items-center justify-center gap-2">
                <FcGoogle className="h-4 w-4" />
                <span>Continue with Google</span>
            </div>
        </Button>
    );
}

export function NotionButton() {
    return (
        <Button
            className="group relative w-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-200 ease-out hover:scale-[1.02] px-4 py-2 h-10 font-medium rounded-lg overflow-hidden text-sm cursor-pointer"
            type="button"
            onClick={() => {
                authClient.signIn.oauth2({
                    providerId: 'notion',
                    callbackURL: '/dashboard',
                });
            }}
        >
            <div className="relative flex items-center justify-center gap-2">
                <SiNotion className="h-3.5 w-3.5" />
                <span>Continue with Notion</span>
            </div>
        </Button>
    );
}
