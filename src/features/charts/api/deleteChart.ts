import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

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
          error: Error;
      }
> {
    try {
        const record = await db
            .select()
            .from(Charts)
            .fullJoin(
                Collections,
                eq(Collections.collection_id, Charts.collection_id)
            )
            .where(eq(Charts.chart_id, chartId))
            .then(([record]) => record);

        if (!record || !record.charts) {
            return {
                ok: false,
                error: new Error("Chart not found."),
            };
        }

        if (!record.collections) {
            return {
                ok: false,
                error: new Error(
                    `Cannot find corresponding Collection to given Chart ID : ${chartId}`
                ),
            };
        }

        if (record.collections.user_id !== userId) {
            return {
                ok: false,
                error: new Error(
                    "You do not have permission to delete this chart."
                ),
            };
        }

        await db.delete(Charts).where(eq(Charts.chart_id, chartId));
        await db
            .update(Collections)
            .set({
                chart_count: sql`${Collections.chart_count} - 1`,
            })
            .where(
                eq(Collections.collection_id, record.collections.collection_id)
            );

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}
