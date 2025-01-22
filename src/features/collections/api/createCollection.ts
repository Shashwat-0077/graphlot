import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";

import { InsertCollection } from "@/db/types";
// import { createClient } from "@/utils/supabase/server";

export const createCollection = async ({
    userId,
    newCollection,
}: {
    userId: string;
    newCollection: z.infer<typeof InsertCollection>;
}): Promise<
    | {
          ok: true;
          newCollectionId: string;
      }
    | {
          ok: false;
          error: string;
      }
> => {
    try {
        const [collection] = await db
            .select()
            .from(Collections)
            .where(
                and(
                    eq(Collections.userId, userId),
                    eq(Collections.name, newCollection.name)
                )
            );

        if (collection) {
            return {
                ok: false,
                error: `Collection with name "${newCollection.name}" already exists`,
            };
        }

        const [{ id }] = await db
            .insert(Collections)
            .values({
                description: newCollection.description,
                name: newCollection.name,
                userId: userId,
            })
            .returning({ id: Collections.id });

        return { ok: true, newCollectionId: id };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        };
    }
};
