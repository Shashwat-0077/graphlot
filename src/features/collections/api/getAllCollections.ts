import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { SelectCollection } from "@/db/types";

export async function getAllCollections({
    userId,
}: {
    userId: string;
}): Promise<
    | {
          ok: true;
          collections: Zod.infer<typeof SelectCollection>[];
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
