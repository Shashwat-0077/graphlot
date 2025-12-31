"use client";

import { FcGoogle } from "react-icons/fc";
import { SiNotion } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { authClient } from "@/modules/auth/client";

export function GoogleButton({ disabled }: { disabled?: boolean }) {
    return (
        <Button
            className="group relative h-10 w-full cursor-pointer overflow-hidden rounded-lg border border-gray-200/50 bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow-md backdrop-blur-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-white hover:shadow-lg"
            type="button"
            disabled={disabled}
            onClick={() => {
                authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/dashboard",
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
            className="group relative h-10 w-full cursor-pointer overflow-hidden rounded-lg border border-gray-200/50 bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow-md backdrop-blur-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-white hover:shadow-lg"
            type="button"
            onClick={() => {
                authClient.signIn.oauth2({
                    providerId: "notion",
                    callbackURL: "/dashboard",
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
