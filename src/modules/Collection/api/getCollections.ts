import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { CollectionSchema } from "@/modules/Collection/schema";

export async function getCollection({
    collectionId,
}: {
    collectionId: string;
}): Promise<
    | {
          ok: true;
          collection: Zod.infer<typeof CollectionSchema.Select>;
      }
    | {
          ok: false;
          error: string;
          field: keyof Zod.infer<typeof CollectionSchema.Select> | "root";
      }
> {
    try {
        const collection = await db
            .select()
            .from(Collections)
            .where(eq(Collections.collection_id, collectionId))
            .then(([rows]) => rows);

        if (!collection) {
            return {
                ok: false,
                error: "Collection not found.",
                field: "collection_id",
            };
        }

        return { ok: true, collection };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}

export async function getAllCollections({
    userId,
}: {
    userId: string;
}): Promise<
    | {
          ok: true;
          collections: Zod.infer<typeof CollectionSchema.Select>[];
      }
    | {
          ok: false;
          error: string;
      }
> {
    try {
        const collections = await db
            .select()
            .from(Collections)
            .where(eq(Collections.user_id, userId))
            .all();

        return { ok: true, collections };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        };
    }
}
