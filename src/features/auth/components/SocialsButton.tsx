"use client";

import { FcGoogle } from "react-icons/fc";
import { SiNotion } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { envClient } from "@/lib/env/clientEnv";

export default function SocialsButton() {
    const supabase = createClient();

    const handleGoogleSignIn = () => {
        supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo:
                    envClient.NEXT_PUBLIC_APP_URL + "/api/auth/callback",
            },
        });
    };

    const handleNotionSignIn = () => {
        supabase.auth.signInWithOAuth({
            provider: "notion",
            options: {
                redirectTo:
                    envClient.NEXT_PUBLIC_APP_URL + "/api/auth/callback",
            },
        });
    };

    return (
        <div className="z-50 mt-5 flex gap-5">
            <Button
                className="w-full bg-primary text-foreground hover:bg-primary"
                onClick={handleGoogleSignIn}
            >
                Sign in with <FcGoogle />
            </Button>
            <Button
                className="hover:bg-foreground-dark w-full bg-foreground text-background"
                onClick={handleNotionSignIn}
            >
                Sign in with <SiNotion />
            </Button>
        </div>
    );
}
