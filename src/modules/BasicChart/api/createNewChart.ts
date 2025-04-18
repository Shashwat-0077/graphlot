import { and, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { AREA, BAR, DONUT, HEATMAP, RADAR } from "@/constants";
import { ChartInsert } from "@/modules/BasicChart/schema";
import {
    Charts,
    BarCharts,
    AreaCharts,
    RadarCharts,
    Collections,
    DonutCharts,
    HeatmapCharts,
} from "@/db/schema";

export async function createNewChart({
    chart,
}: {
    chart: ChartInsert;
}): Promise<
    | {
          ok: true;
          newChart: ChartInsert;
      }
    | {
          ok: false;
          error: string;
          field: keyof ChartInsert | "root";
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

        const collection = await db
            .select()
            .from(Collections)
            .where(eq(Collections.collection_id, chart.collection_id));

        if (collection.length === 0) {
            return {
                ok: false,
                error: `Collection with id "${chart.collection_id}" does not exist`,
                field: "collection_id",
            };
        }

        const newChart = await db.transaction(async (tx) => {
            const newChart = await tx
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
                case AREA:
                    await tx.insert(BarCharts).values({
                        chart_id: newChart.chart_id,
                    });
                    break;
                case BAR:
                    await tx.insert(AreaCharts).values({
                        chart_id: newChart.chart_id,
                    });
                    break;
                case HEATMAP:
                    await tx.insert(HeatmapCharts).values({
                        chart_id: newChart.chart_id,
                    });
                    break;
                case DONUT:
                    await tx.insert(DonutCharts).values({
                        chart_id: newChart.chart_id,
                    });
                    break;
                case RADAR:
                    await tx.insert(RadarCharts).values({
                        chart_id: newChart.chart_id,
                    });
                    break;
                default:
                    tx.rollback();
                    break;
            }

            await tx
                .update(Collections)
                .set({
                    chart_count: sql`${Collections.chart_count} + 1`,
                })
                .where(eq(Collections.collection_id, chart.collection_id));

            return newChart;
        });

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
