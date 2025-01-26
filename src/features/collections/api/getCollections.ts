import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { FieldError } from "@/utils/FieldError";

import { CollectionSchema } from "../schema";

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
          error: FieldError<Zod.infer<typeof CollectionSchema.Select>>;
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
                error: new FieldError({
                    field: "collection_id",
                    message: "Collection not found.",
                }),
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
