import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import {
    RadarChartSelect,
    FullRadarChartSelect,
} from "@/modules/chart-types/radar/schema/types";
import { RadarCharts } from "@/modules/chart-types/radar/schema";
import { CHART_TYPE_RADAR } from "@/constants";

import {
    ChartColors,
    ChartBoxModel,
    ChartMetadata,
    ChartTypography,
    ChartVisual,
} from "@/modules/chart/chart-metadata/schema";

export async function fetchRadarChartsByCollection(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullRadarChartSelect[];
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const charts = await db
            .select()
            .from(ChartMetadata)
            .where(
                and(
                    eq(ChartMetadata.collectionId, collection_id),
                    eq(ChartMetadata.type, CHART_TYPE_RADAR)
                )
            )
            .innerJoin(
                RadarCharts,
                eq(ChartMetadata.chartId, RadarCharts.chartId)
            )
            .innerJoin(
                ChartVisual,
                eq(ChartMetadata.chartId, ChartVisual.chartId)
            )
            .innerJoin(
                ChartTypography,
                eq(ChartMetadata.chartId, ChartTypography.chartId)
            )
            .innerJoin(
                ChartBoxModel,
                eq(ChartMetadata.chartId, ChartBoxModel.chartId)
            )
            .innerJoin(
                ChartColors,
                eq(ChartMetadata.chartId, ChartColors.chartId)
            );

        return { ok: true, charts: charts as FullRadarChartSelect[] };
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

export async function fetchRadarChartById(chartId: string): Promise<
    | {
          ok: true;
          chart: RadarChartSelect;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const [chart] = await db
            .select()
            .from(RadarCharts)
            .where(eq(RadarCharts.chartId, chartId))
            .limit(1);

        if (!chart) {
            return { ok: false, error: "Radar chart not found" };
        }

        return { ok: true, chart };
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

export async function fetchFullRadarChartById(chartId: string): Promise<
    | {
          ok: true;
          chart: FullRadarChartSelect;
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
                    eq(ChartMetadata.type, CHART_TYPE_RADAR)
                )
            )
            .innerJoin(
                RadarCharts,
                eq(ChartMetadata.chartId, RadarCharts.chartId)
            )
            .innerJoin(
                ChartVisual,
                eq(ChartMetadata.chartId, ChartVisual.chartId)
            )
            .innerJoin(
                ChartTypography,
                eq(ChartMetadata.chartId, ChartTypography.chartId)
            )
            .innerJoin(
                ChartBoxModel,
                eq(ChartMetadata.chartId, ChartBoxModel.chartId)
            )
            .innerJoin(
                ChartColors,
                eq(ChartMetadata.chartId, ChartColors.chartId)
            )
            .limit(1);

        if (!chart) {
            return { ok: false, error: "Radar chart not found" };
        }

        return { ok: true, chart: chart as FullRadarChartSelect };
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
