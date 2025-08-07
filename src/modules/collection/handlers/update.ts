import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { CollectionSchema } from "@/modules/collection/schema/types";

export async function updateCollection({
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
          collectionId: string;
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        // Use a single query to verify ownership and update in one transaction
        const result = await db.transaction(async (tx) => {
            const collection = await tx
                .select()
                .from(Collections)
                .where(eq(Collections.collectionId, collectionId))
                .get();

            if (!collection) {
                throw new Error("Collection not found.");
            }

            if (collection.userId !== userId) {
                throw new Error(
                    "You do not have permission to update this collection."
                );
            }

            const updates: Partial<typeof newCollection> = {};

            if (
                !(
                    newCollection.name === collection.name &&
                    newCollection.description === collection.description
                )
            ) {
                if (Object.keys(updates).length > 0) {
                    await tx
                        .update(Collections)
                        .set({
                            ...updates,
                            updatedAt: Date.now(),
                        })
                        .where(eq(Collections.collectionId, collectionId))
                        .run();
                }
            }
            return collection.collectionId;
        });

        return { ok: true, collectionId: result };
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
