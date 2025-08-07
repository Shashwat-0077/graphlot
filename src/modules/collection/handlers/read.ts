import { eq } from "drizzle-orm";
import { z as Zod } from "zod";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { CollectionSchema } from "@/modules/collection/schema/types";

export async function fetchCollectionById(collection_id: string): Promise<
    | {
          ok: true;
          collection: Zod.infer<typeof CollectionSchema.Select>;
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        // Use prepared statement for better security and performance
        const collection = await db
            .select()
            .from(Collections)
            .where(eq(Collections.collectionId, collection_id.trim()))
            .get();

        if (!collection) {
            return {
                ok: false,
                error: "Collection not found",
            };
        }

        return {
            ok: true,
            collection,
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

export async function fetchAllCollections(userId: string): Promise<
    | {
          ok: true;
          collections: Zod.infer<typeof CollectionSchema.Select>[];
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        // Use prepared statement and add sorting for better UX
        const collections = await db
            .select()
            .from(Collections)
            .where(eq(Collections.userId, userId.trim()))
            .orderBy(Collections.name)
            .all();

        // Return empty array instead of null/undefined
        return {
            ok: true,
            collections: collections || [],
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
