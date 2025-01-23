import { and, eq, sql } from "drizzle-orm";

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

import { BasicChartSchema } from "../schema";

export async function CreateNewChart({
    chart,
}: {
    chart: Zod.infer<typeof BasicChartSchema.Insert>;
}): Promise<
    | {
          ok: true;
          newChartId: string;
      }
    | {
          ok: false;
          error: string;
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
            };
        }

        const id = await db
            .insert(Charts)
            .values({
                collection_id: chart.collection_id,
                name: chart.name,
                description: chart.description,
                notionDatabaseUrl: chart.notionDatabaseUrl,
                type: chart.type,
            })
            .returning({ id: Charts.id })
            .then(([{ id }]) => id);

        switch (chart.type) {
            case "Bar":
                await db.insert(BarCharts).values({
                    chart_id: id,
                });
                break;
            case "Area":
                await db.insert(AreaCharts).values({
                    chart_id: id,
                });
                break;
            case "Heatmap":
                await db.insert(HeatmapCharts).values({
                    chart_id: id,
                });
                break;
            case "Donut":
                await db.insert(DonutCharts).values({
                    chart_id: id,
                });
                break;
            case "Radar":
                await db.insert(RadarCharts).values({
                    chart_id: id,
                });
                break;
            default:
                break;
        }

        await db
            .update(Collections)
            .set({
                chartCount: sql`${Collections.chartCount} + 1`, // Use raw SQL expression
            })
            .where(eq(Collections.id, chart.collection_id));

        return { ok: true, newChartId: id };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        };
    }
}
