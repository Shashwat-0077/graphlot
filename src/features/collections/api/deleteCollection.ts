import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";

export async function DeleteCollection({
    userId,
    collectionId,
}: {
    userId: string;
    collectionId: string;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: Error;
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
                error: new Error("Collection not found."),
            };
        }

        if (collection.user_id !== userId) {
            return {
                ok: false,
                error: new Error(
                    "You do not have permission to delete this collection."
                ),
            };
        }

        await db
            .delete(Collections)
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
