import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { Charts, Collections } from "@/db/schema";

export async function deleteChart({
    user_id,
    chart_id,
}: {
    user_id: string;
    chart_id: string;
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
        const record = await db
            .select()
            .from(Charts)
            .fullJoin(
                Collections,
                eq(Collections.collection_id, Charts.collectionId)
            )
            .where(eq(Charts.chartId, chart_id))
            .then(([record]) => record);

        if (!record || !record.charts) {
            return {
                ok: false,
                error: "Chart not found",
            };
        }

        if (!record.collections) {
            return {
                ok: false,
                error: `Cannot find corresponding Collection to given Chart ID : ${chart_id}`,
            };
        }

        if (record.collections.user_id !== user_id) {
            return {
                ok: false,
                error: "You do not have permission to delete this chart.",
            };
        }

        await db.transaction(async (tx) => {
            if (!record.collections) {
                tx.rollback();
                return;
            }

            await tx.delete(Charts).where(eq(Charts.chartId, chart_id));

            await tx
                .update(Collections)
                .set({
                    chart_count: sql`${Collections.chart_count} - 1`,
                })
                .where(
                    eq(
                        Collections.collection_id,
                        record.collections.collection_id
                    )
                );
        });

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
