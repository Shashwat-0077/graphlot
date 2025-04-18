import { eq } from "drizzle-orm";

import { db } from "@/db";
import { RadarCharts } from "@/db/schema";
import { RadarUpdate } from "@/modules/Radar/schema";

export async function updateRadarChart({
    chart_id,
    data,
}: {
    chart_id: string;
    data: RadarUpdate;
}): Promise<
    | {
          ok: true;
      }
    | { ok: false; error: string }
> {
    try {
        const updated = await db
            .update(RadarCharts)
            .set({
                background_color: data.background_color,
                text_color: data.text_color,
                tooltip_enabled: data.tooltip_enabled,
                legend_enabled: data.legend_enabled,
                has_border: data.has_border,
                color_palette: data.color_palette,
                x_axis: data.x_axis,
                y_axis: data.y_axis,
                group_by: data.group_by,
                sort_by: data.sort_by,
                omit_zero_values: data.omit_zero_values,
                cumulative: data.cumulative,
                filters: data.filters,
                grid_color: data.grid_color,
                grid_enabled: data.grid_enabled,
            })
            .where(eq(RadarCharts.chart_id, chart_id))
            .returning({ chart_id: RadarCharts.chart_id })
            .then((res) => res[0]);

        if (!updated) {
            return { ok: false, error: "Radar chart not found" };
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
