import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Charts } from "@/db/schema";
import { SelectChart } from "@/db/types";

export async function getAllChartsWithCollectionId(
    collectionId: string
): Promise<
    | {
          ok: true;
          charts: Zod.infer<typeof SelectChart>[];
      }
    | {
          ok: false;
          error: string;
      }
> {
    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collectionId));

        return {
            ok: true,
            charts,
        };
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
