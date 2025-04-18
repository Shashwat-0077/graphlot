import { eq } from "drizzle-orm";

import { db } from "@/db";
import { DonutCharts } from "@/db/schema";
import { DonutUpdate } from "@/modules/Donut/schema";

export async function updateDonutChart({
    chart_id,
    data,
}: {
    chart_id: string;
    data: DonutUpdate;
}): Promise<
    | {
          ok: true;
      }
    | { ok: false; error: string }
> {
    try {
        const updated = await db
            .update(DonutCharts)
            .set({
                background_color: data.background_color,
                text_color: data.text_color,
                tooltip_enabled: data.tooltip_enabled,
                legend_enabled: data.legend_enabled,
                label_enabled: data.label_enabled,
                has_border: data.has_border,
                color_palette: data.color_palette,
                x_axis: data.x_axis,
                sort_by: data.sort_by,
                omit_zero_values: data.omit_zero_values,
                filters: data.filters,
            })
            .where(eq(DonutCharts.chart_id, chart_id))
            .returning({ chart_id: DonutCharts.chart_id })
            .then((res) => res[0]);

        if (!updated) {
            return { ok: false, error: "Donut chart not found" };
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
