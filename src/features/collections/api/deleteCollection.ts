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
          error: string;
      }
> {
    try {
        const [collection] = await db
            .select()
            .from(Collections)
            .where(eq(Collections.id, collectionId));

        if (!collection) {
            return {
                ok: false,
                error: "Collection not found.",
            };
        }

        if (collection.userId !== userId) {
            return {
                ok: false,
                error: "You do not have permission to delete this collection.",
            };
        }

        await db.delete(Collections).where(eq(Collections.id, collectionId));

        return { ok: true };
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
