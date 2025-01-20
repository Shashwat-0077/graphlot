import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { InsertCollection } from "@/db/types";
import { Collections } from "@/db/schema";
// import { createClient } from "@/utils/supabase/server";

export const createCollection = async (
    newCollection: z.infer<typeof InsertCollection>
) => {
    // IMPORTANT : This is commented out because the testing cant be done with auth providers, in production this should be uncommented

    // TODO : Uncomment this in production
    // const supabase = await createClient();
    // const {
    //     data: { user },
    // } = await supabase.auth.getUser();

    // if (!user) {
    //     throw new HTTPException(401, {
    //         message: "User not found",
    //     });
    // }

    // TODO : Remove this in production
    const user = {
        id: "1",
    };

    const [collection] = await db
        .select()
        .from(Collections)
        .where(
            and(
                eq(Collections.userId, user.id),
                eq(Collections.name, newCollection.name)
            )
        );

    if (collection) {
        throw new HTTPException(400, {
            message: `Collection with name "${newCollection.name}" already exists`,
        });
    }

    const [{ id }] = await db
        .insert(Collections)
        .values({
            description: newCollection.description,
            name: newCollection.name,
            userId: user.id,
        })
        .returning({ id: Collections.id });

    return id;
};
