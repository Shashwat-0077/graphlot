import { Hono } from "hono";

import { env } from "@/lib/env";
import { createClient } from "@/utils/supabase/server";
import { DEFAULT_AUTH_REDIRECT_PATH } from "@/routes";

const app = new Hono().get("/callback", async (c) => {
    const { code, next } = c.req.query();

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const forwardedHost = c.req.header("x-forwarded-host"); // original origin before load balancer
            const isLocalEnv = env.NODE_ENV === "development";
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return c.redirect(
                    `${
                        env.NEXT_PUBLIC_APP_URL
                    }${next ?? DEFAULT_AUTH_REDIRECT_PATH}`
                );
            } else if (forwardedHost) {
                return c.redirect(
                    `https://${forwardedHost}${next ?? DEFAULT_AUTH_REDIRECT_PATH}`
                );
            } else {
                return c.redirect(
                    `${
                        env.NEXT_PUBLIC_APP_URL
                    }${next ?? DEFAULT_AUTH_REDIRECT_PATH}`
                );
            }
        }
    }

    // return the user to an error page with instructions
    return c.redirect("/error");
});

export default app;
