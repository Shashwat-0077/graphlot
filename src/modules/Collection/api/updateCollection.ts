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
          error: string;
          field:
              | FieldError<keyof z.infer<typeof CollectionSchema.Update>>
              | "root";
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
                error: "Collection not found.",
                field: "root",
            };
        }

        if (collection.user_id !== userId) {
            return {
                ok: false,
                error: "You do not have permission to delete this collection.",
                field: "root",
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
