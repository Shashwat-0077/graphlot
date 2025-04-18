import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { HEATMAP } from "@/constants";
import { db } from "@/db";
import { HeatmapCharts, Charts } from "@/db/schema";
import { FullHeatmapSelect } from "@/modules/Heatmap/schema";

export async function getAllHeatmapChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullHeatmapSelect[];
      }
    | { ok: false; error: string }
> {
    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collection_id))
            .innerJoin(
                HeatmapCharts,
                eq(Charts.chart_id, HeatmapCharts.chart_id)
            )
            .then((charts) => {
                return charts.map((chart) => ({
                    ...chart.heatmap_charts,
                    ...chart.charts,
                    type: HEATMAP,
                }));
            });

        return { ok: true, charts };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}

export async function getHeatmapChartWithId({
    chart_id,
}: {
    chart_id: string;
}): Promise<
    | {
          ok: true;
          chart: FullHeatmapSelect;
      }
    | { ok: false; error: string }
> {
    try {
        const [chart] = await db
            .select()
            .from(Charts)
            .where(eq(Charts.chart_id, chart_id))
            .innerJoin(
                HeatmapCharts,
                eq(Charts.chart_id, HeatmapCharts.chart_id)
            );

        if (!chart) {
            return { ok: false, error: "Heatmap chart not found" };
        }

        return {
            ok: true,
            chart: {
                ...chart.heatmap_charts,
                ...chart.charts,
                type: HEATMAP,
            },
        };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
