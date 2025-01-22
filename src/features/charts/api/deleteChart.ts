import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { Charts, Collections } from "@/db/schema";

export async function DeleteChart({
    userId,
    chartId,
}: {
    userId: string;
    chartId: string;
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
        const [record] = await db
            .select()
            .from(Charts)
            .fullJoin(Collections, eq(Collections.id, Charts.collection_id))
            .where(eq(Charts.id, chartId));

        if (!record || !record.charts) {
            return {
                ok: false,
                error: "Chart not found.",
            };
        }

        if (!record.collections) {
            return {
                ok: false,
                error: `Cannot find corresponding Collection to given Chart ID : ${chartId}`,
            };
        }

        if (record.collections.userId !== userId) {
            return {
                ok: false,
                error: "You do not have permission to delete this chart.",
            };
        }

        await db.delete(Charts).where(eq(Charts.id, chartId));
        await db
            .update(Collections)
            .set({
                chartCount: sql`${Collections.chartCount} - 1`,
            })
            .where(eq(Collections.id, record.collections.id));

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
