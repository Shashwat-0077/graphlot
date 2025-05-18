import { eq } from "drizzle-orm";

import { db } from "@/db";
import { AreaCharts, Charts } from "@/db/schema";
import { AreaChartUpdate } from "@/modules/Area/schema";

export async function updateAreaChart({
    chart_id,
    data,
}: {
    chart_id: string;
    data: AreaChartUpdate;
}): Promise<
    | {
          ok: true;
      }
    | { ok: false; error: string }
> {
    try {
        const updated = await db.transaction(async (tx) => {
            const updated = await tx
                .update(AreaCharts)
                .set(data)
                .where(eq(AreaCharts.chart_id, chart_id))
                .returning({ chart_id: AreaCharts.chart_id })
                .then(([res]) => res);

            await tx
                .update(Charts)
                .set({
                    updated_at: new Date(),
                })
                .where(eq(Charts.chart_id, chart_id));

            return updated;
        });

        if (!updated) {
            return { ok: false, error: "Area chart not found" };
        }

        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}
