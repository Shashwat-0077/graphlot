import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import {
    AreaCharts,
    BarCharts,
    Charts,
    Collections,
    DonutCharts,
    HeatmapCharts,
    RadarCharts,
} from "@/db/schema";
import { BasicChartSchema } from "@/modules/charts/schema";

export async function createNewChart({
    chart,
}: {
    chart: z.infer<typeof BasicChartSchema.Insert>;
}): Promise<
    | {
          ok: true;
          newChart: z.infer<typeof BasicChartSchema.Select>;
      }
    | {
          ok: false;
          error: string;
          field: keyof Zod.infer<typeof BasicChartSchema.Insert> | "root";
      }
> {
    try {
        const existingChart = await db
            .select()
            .from(Charts)
            .where(
                and(
                    eq(Charts.collection_id, chart.collection_id),
                    eq(Charts.name, chart.name)
                )
            );

        if (existingChart.length > 0) {
            return {
                ok: false,
                error: `Chart with name "${chart.name}" already exists`,
                field: "name",
            };
        }

        const newChart = await db
            .insert(Charts)
            .values({
                collection_id: chart.collection_id,
                type: chart.type,
                name: chart.name,
                description: chart.description,
                notion_database_id: chart.notion_database_id,
                notion_database_name: chart.notion_database_name,
            })
            .returning()
            .then(([record]) => record);

        switch (chart.type) {
            case "Bar":
                await db.insert(BarCharts).values({
                    chart_id: newChart.chart_id,
                });
                break;
            case "Area":
                await db.insert(AreaCharts).values({
                    chart_id: newChart.chart_id,
                });
                break;
            case "Heatmap":
                await db.insert(HeatmapCharts).values({
                    chart_id: newChart.chart_id,
                });
                break;
            case "Donut":
                await db.insert(DonutCharts).values({
                    chart_id: newChart.chart_id,
                });
                break;
            case "Radar":
                await db.insert(RadarCharts).values({
                    chart_id: newChart.chart_id,
                });
                break;
            default:
                break;
        }

        await db
            .update(Collections)
            .set({
                chart_count: sql`${Collections.chart_count} + 1`,
            })
            .where(eq(Collections.collection_id, chart.collection_id));

        return { ok: true, newChart };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
