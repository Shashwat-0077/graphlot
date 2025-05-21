import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";

export async function deleteCollection({
    userId,
    collectionId,
}: {
    userId: string;
    collectionId: string;
}): Promise<
    | {
          ok: true;
          collectionId: string;
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        // Use a transaction to ensure consistency
        const result = await db.transaction(async (tx) => {
            // Combine the fetch and permission check into a single query
            const collection = await tx
                .select({
                    id: Collections.collectionId,
                    userId: Collections.userId,
                })
                .from(Collections)
                .where(eq(Collections.collectionId, collectionId))
                .get();

            if (!collection) {
                throw new Error("Collection not found");
            }

            if (collection.userId !== userId) {
                throw new Error(
                    "You do not have permission to delete this collection."
                );
            }

            await tx
                .delete(Collections)
                .where(
                    and(
                        eq(Collections.collectionId, collectionId),
                        eq(Collections.userId, userId)
                    )
                )
                .run();
            return collection.id;
        });

        return {
            ok: true,
            collectionId: result,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
}
