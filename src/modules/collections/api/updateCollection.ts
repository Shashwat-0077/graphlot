import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { FieldError } from "@/utils/FieldError";

import { CollectionSchema } from "../schema";

export default async function UpdateCollection({
    userId,
    collectionId,
    newCollection,
}: {
    userId: string;
    collectionId: string;
    newCollection: z.infer<typeof CollectionSchema.Update>;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: FieldError<z.infer<typeof CollectionSchema.Update>>;
      }
> {
    try {
        const [collection] = await db
            .select()
            .from(Collections)
            .where(eq(Collections.collection_id, collectionId));

        if (!collection) {
            return {
                ok: false,
                error: new FieldError({
                    field: "root",
                    message: "Collection not found.",
                }),
            };
        }

        if (collection.user_id !== userId) {
            return {
                ok: false,
                error: new FieldError({
                    field: "root",
                    message:
                        "You do not have permission to delete this collection.",
                }),
            };
        }

        await db
            .update(Collections)
            .set({
                description: newCollection.description,
                name: newCollection.name,
            })
            .where(eq(Collections.collection_id, collectionId));

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}
