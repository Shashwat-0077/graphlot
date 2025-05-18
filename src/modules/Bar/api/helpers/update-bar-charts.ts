import { eq } from "drizzle-orm";

import { db } from "@/db";
import { BarCharts, Charts } from "@/db/schema";
import { BarUpdate } from "@/modules/Bar/schema";

export async function updateBarChart({
    chart_id,
    data,
}: {
    chart_id: string;
    data: BarUpdate;
}): Promise<
    | {
          ok: true;
      }
    | { ok: false; error: string }
> {
    try {
        const updated = await db.transaction(async (tx) => {
            const updated = await tx
                .update(BarCharts)
                .set(data)
                .where(eq(BarCharts.chart_id, chart_id))
                .returning({ chart_id: BarCharts.chart_id })
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
            return { ok: false, error: "Bar chart not found" };
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
