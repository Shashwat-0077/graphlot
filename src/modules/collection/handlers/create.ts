import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { CollectionSchema } from "@/modules/collection/schema/types";

export const createCollection = async ({
    userId,
    newCollection,
}: {
    userId: string;
    newCollection: z.infer<typeof CollectionSchema.Insert>;
}): Promise<
    | {
          ok: true;
          collection: {
              id: string;
              name: string;
          };
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> => {
    // Use a transaction to ensure database consistency
    try {
        // Start a transaction
        return await db.transaction(async (tx) => {
            // Check if collection already exists for this user
            const existingCollection = await tx
                .select({ id: Collections.collectionId })
                .from(Collections)
                .where(
                    and(
                        eq(Collections.userId, userId),
                        eq(Collections.name, newCollection.name)
                    )
                )
                .all();

            if (existingCollection && existingCollection.length > 0) {
                return {
                    ok: false,
                    error: `Collection with name "${newCollection.name}" already exists`,
                };
            }

            // Insert the new collection
            const result = await tx
                .insert(Collections)
                .values({
                    userId: userId,
                    name: newCollection.name.trim(),
                    description: newCollection.description?.trim(),
                })
                .returning({
                    id: Collections.collectionId,
                    name: Collections.name,
                })
                .get();

            return {
                ok: true,
                collection: { id: result.id, name: result.name },
            };
        });
    } catch (error) {
        // Handle specific database errors
        if (error instanceof Error) {
            if (error.message.includes("UNIQUE")) {
                // Unique violation
                return {
                    ok: false,
                    error: "A collection with this name already exists",
                    details: error,
                };
            }
        }

        // Generic error handler
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
            details: error,
        };
    }
};
