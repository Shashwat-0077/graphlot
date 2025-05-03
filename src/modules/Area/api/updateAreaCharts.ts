import { eq } from "drizzle-orm";

import { db } from "@/db";
import { AreaCharts } from "@/db/schema";
import { AreaUpdate } from "@/modules/Area/schema";

export async function updateAreaChart({
    chart_id,
    data,
}: {
    chart_id: string;
    data: AreaUpdate;
}): Promise<
    | {
          ok: true;
      }
    | { ok: false; error: string }
> {
    try {
        const updated = await db
            .update(AreaCharts)
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
                label_enabled: data.label_enabled,
                omit_zero_values: data.omit_zero_values,
                cumulative: data.cumulative,
                filters: data.filters,
                grid_color: data.grid_color,
                grid_type: data.grid_type,
            })
            .where(eq(AreaCharts.chart_id, chart_id))
            .returning({ chart_id: AreaCharts.chart_id })
            .then((res) => res[0]);

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
