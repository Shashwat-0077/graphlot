import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { headers } from "next/headers";

import { auth } from "..";

export const authMiddleWare = async (c: Context, next: () => Promise<void>) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new HTTPException(401, {
            res: c.json({ error: "Unauthorized" }, 401),
        });
    }
    const { user } = session;

    if (!user) {
        throw new HTTPException(401, {
            res: c.json({ error: "Unauthorized" }, 401),
        });
    }

    c.set("userId", user.id);
    await next();
};
