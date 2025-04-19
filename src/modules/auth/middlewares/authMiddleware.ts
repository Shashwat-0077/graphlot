import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

import { createClient } from "@/lib/supabase/server";
// import { HTTPException } from "hono/http-exception";

// import { createClient } from "@/utils/supabase/server";

export const authMiddleWare = async (c: Context, next: () => Promise<void>) => {
    // TODO : Uncomment this code in production

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new HTTPException(401, {
            res: c.json({ error: "Unauthorized" }, 401),
        });
    }

    c.set("userId", user.id);
    await next();
};
