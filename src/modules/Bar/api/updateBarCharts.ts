import { eq } from "drizzle-orm";

import { db } from "@/db";
import { BarCharts } from "@/db/schema";
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
        const updated = await db
            .update(BarCharts)
            .set({
                background_color: data.background_color,
                text_color: data.text_color,
                tooltip_enabled: data.tooltip_enabled,
                legend_enabled: data.legend_enabled,
                has_border: data.has_border,
                color_palette: data.color_palette,
                x_axis: data.x_axis,
                y_axis: data.y_axis,
                sort_x: data.sort_x,
                sort_y: data.sort_y,
                omit_zero_values: data.omit_zero_values,
                cumulative: data.cumulative,
                filters: data.filters,
                grid_color: data.grid_color,
                grid_type: data.grid_type,
                bar_gap: data.bar_gap,
                bar_size: data.bar_size,
            })
            .where(eq(BarCharts.chart_id, chart_id))
            .returning({ chart_id: BarCharts.chart_id })
            .then((res) => res[0]);

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
