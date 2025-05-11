import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Charts, HeatmapCharts } from "@/db/schema";
import { HeatmapUpdate } from "@/modules/Heatmap/schema";

export async function updateHeatmapChart({
    chart_id,
    data,
}: {
    chart_id: string;
    data: HeatmapUpdate;
}): Promise<
    | {
          ok: true;
      }
    | { ok: false; error: string }
> {
    try {
        const updated = await db.transaction(async (tx) => {
            const updated = await tx
                .update(HeatmapCharts)
                .set({
                    background_color: data.background_color,
                    text_color: data.text_color,
                    tooltip_enabled: data.tooltip_enabled,
                    label_enabled: data.label_enabled,
                    has_border: data.has_border,
                    metric: data.metric,
                    streak: data.streak,
                    longest_streak: data.longest_streak,
                    sum_of_all_entries: data.sum_of_all_entries,
                    average_of_all_entries: data.average_of_all_entries,
                    number_of_entries: data.number_of_entries,
                    button_hover_enabled: data.button_hover_enabled,
                    default_box_color: data.default_box_color,
                    accent: data.accent,
                    average_of_all_entries_color:
                        data.average_of_all_entries_color,
                    number_of_entries_color: data.number_of_entries_color,
                    sum_of_all_entries_color: data.sum_of_all_entries_color,
                    longest_streak_color: data.longest_streak_color,
                    streak_color: data.streak_color,
                    average_of_all_entries_enabled:
                        data.average_of_all_entries_enabled,
                    longest_streak_enabled: data.longest_streak_enabled,
                    number_of_entries_enabled: data.number_of_entries_enabled,
                    sum_of_all_entries_enabled: data.sum_of_all_entries_enabled,
                    streak_enabled: data.streak_enabled,
                })
                .where(eq(HeatmapCharts.chart_id, chart_id))
                .returning({ chart_id: HeatmapCharts.chart_id })
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
            return { ok: false, error: "Heatmap chart not found" };
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
