import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";

import { CollectionSchema } from "../schema";

export async function getAllCollections({
    userId,
}: {
    userId: string;
}): Promise<
    | {
          ok: true;
          collections: Zod.infer<typeof CollectionSchema.Insert>[];
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
            .where(eq(Collections.userId, userId))
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
