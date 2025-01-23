import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Charts } from "@/db/schema";

import { BasicChartSchema } from "../schema";

export async function getAllChartsWithCollectionId(
    collectionId: string
): Promise<
    | {
          ok: true;
          charts: Zod.infer<typeof BasicChartSchema.Select>[];
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
