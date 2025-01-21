import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

import { createClient } from "@/utils/supabase/server";

export const authMiddleWare = async (c: Context, next: () => Promise<void>) => {
    // TODO : Uncomment this code in production

    // const supabase = await createClient();
    // const {
    //     data: { user },
    // } = await supabase.auth.getUser();

    // if (!user) {
    //     throw new HTTPException(401, {
    //         res: c.json({ error: "Unauthorized" }, 401),
    //     });
    // }
    c.set("userId", "5a81fc9a-78f5-4faa-8c03-acf73104d4ae");
    await next();
};
