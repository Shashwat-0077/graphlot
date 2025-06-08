import { eq } from "drizzle-orm";

import { db } from "@/db";
import { ChartMetadata } from "@/db/schema";

export async function deleteChart(chartId: string): Promise<
    | {
          ok: true;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        await db.transaction(async (tx) => {
            // Delete from the specific chart table based on the chart type
            const chartMetadata = await tx
                .select()
                .from(ChartMetadata)
                .where(eq(ChartMetadata.chartId, chartId))
                .limit(1)
                .then(([res]) => res);

            if (!chartMetadata) {
                throw new Error("Chart metadata not found");
            }

            // Delete from the ChartMetadata table
            await tx
                .delete(ChartMetadata)
                .where(eq(ChartMetadata.chartId, chartId));
        });

        return { ok: true };
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
