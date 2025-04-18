import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import SocialsButton from "@/modules/auth/components/SocialsButton";

export default async function Home() {
    const client = await createClient();

    const {
        data: { session },
    } = await client.auth.getSession();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <main className="grid h-dvh place-content-center overflow-hidden bg-background text-foreground">
            <h1 className="z-50 text-center font-play-write text-4xl text-primary">
                Momentum
            </h1>

            <SocialsButton />
        </main>
    );
}
