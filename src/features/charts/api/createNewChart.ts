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
import { FieldError } from "@/utils/FieldError";

import { BasicChartSchema } from "../schema";

export async function CreateNewChart({
    chart,
}: {
    chart: Zod.infer<typeof BasicChartSchema.Insert>;
}): Promise<
    | {
          ok: true;
          newChart: z.infer<typeof BasicChartSchema.Select>;
      }
    | {
          ok: false;
          error: FieldError<z.infer<typeof BasicChartSchema.Select>>;
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
                error: new FieldError({
                    field: "name",
                    message: `Chart with name "${chart.name}" already exists`,
                }),
            };
        }

        const newChart = await db
            .insert(Charts)
            .values({
                collection_id: chart.collection_id,
                name: chart.name,
                description: chart.description,
                notion_database_url: chart.notion_database_url,
                type: chart.type,
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
