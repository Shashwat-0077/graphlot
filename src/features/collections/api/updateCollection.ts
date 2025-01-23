import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { Collections } from "@/db/schema";

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

        await db
            .update(Collections)
            .set({
                chartCount: newCollection.chartCount,
                description: newCollection.description,
                name: newCollection.name,
            })
            .where(eq(Collections.id, collectionId));

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
