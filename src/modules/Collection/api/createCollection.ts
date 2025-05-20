import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { CollectionSchema } from "@/modules/Collection/schema";

export const createCollection = async ({
    userId,
    newCollection,
}: {
    userId: string;
    newCollection: z.infer<typeof CollectionSchema.Insert>;
}): Promise<
    | {
          ok: true;
          newCollection: {
              id: string;
              name: string;
          };
      }
    | {
          ok: false;
          error: string;
          field: keyof z.infer<typeof CollectionSchema.Insert>;
      }
> => {
    try {
        const [collection] = await db
            .select()
            .from(Collections)
            .where(
                and(
                    eq(Collections.user_id, userId),
                    eq(Collections.name, newCollection.name)
                )
            );

        if (collection) {
            return {
                ok: false,
                error: `Collection with name "${newCollection.name}" already exists`,
                field: "name",
            };
        }

        const [{ id, name }] = await db
            .insert(Collections)
            .values({
                user_id: userId,
                name: newCollection.name,
                description: newCollection.description,
                created_at: new Date(),
            })
            .returning({
                id: Collections.collection_id,
                name: Collections.name,
            });

        return { ok: true, newCollection: { id, name } };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
};
