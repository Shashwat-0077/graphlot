import { FcGoogle } from "react-icons/fc";
import { SiNotion } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { signIn } from "@/modules/auth";

export default function SocialsButton() {
    return (
        <div className="z-50 mt-5 flex gap-5">
            <form
                action={async () => {
                    "use server";
                    await signIn("google", {
                        callbackUrl: "/api/auth/callback/google",
                    });
                }}
            >
                <Button className="w-full bg-primary text-foreground">
                    Sign in with <FcGoogle />
                </Button>
            </form>
            <form
                action={async () => {
                    "use server";
                    await signIn("notion", {
                        callbackUrl: "/api/auth/callback/notion",
                    });
                }}
            >
                <Button className="w-full bg-foreground text-background hover:bg-foreground-dark">
                    Sign in with <SiNotion />
                </Button>
            </form>
        </div>
    );
}
