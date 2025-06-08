import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { ChartMetadata, HeatmapCharts } from "@/db/schema";
import { FullHeatmapSelect, HeatmapSelect } from "@/modules/Heatmap/schema";
import { CHART_TYPE_HEATMAP } from "@/constants";

export async function fetchHeatmapsByCollection(collectionId: string): Promise<
    | {
          ok: true;
          charts: FullHeatmapSelect[];
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const charts = await db
            .select()
            .from(ChartMetadata)
            .where(
                and(
                    eq(ChartMetadata.collectionId, collectionId),
                    eq(ChartMetadata.type, CHART_TYPE_HEATMAP)
                )
            )
            .innerJoin(
                HeatmapCharts,
                eq(ChartMetadata.chartId, HeatmapCharts.chartId)
            );

        return { ok: true, charts: charts as FullHeatmapSelect[] };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
}

export async function fetchHeatmapById(chartId: string): Promise<
    | {
          ok: true;
          chart: HeatmapSelect;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const [chart] = await db
            .select()
            .from(HeatmapCharts)
            .where(eq(HeatmapCharts.chartId, chartId))
            .limit(1);

        if (!chart) {
            return { ok: false, error: "Heatmap chart not found" };
        }

        return {
            ok: true,
            chart,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
}

export async function fetchFullHeatmapById(chartId: string): Promise<
    | {
          ok: true;
          chart: FullHeatmapSelect;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const [chart] = await db
            .select()
            .from(ChartMetadata)
            .where(
                and(
                    eq(ChartMetadata.chartId, chartId),
                    eq(ChartMetadata.type, CHART_TYPE_HEATMAP)
                )
            )
            .innerJoin(
                HeatmapCharts,
                eq(ChartMetadata.chartId, HeatmapCharts.chartId)
            );

        if (!chart) {
            return { ok: false, error: "Heatmap chart not found" };
        }

        return {
            ok: true,
            chart: chart as FullHeatmapSelect,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
}
