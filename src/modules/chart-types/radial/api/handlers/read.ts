import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import {
    RadialChartSelect,
    FullRadialChartSelect,
} from "@/modules/chart-types/radial/schema/types";
import { RadialCharts } from "@/modules/chart-types/radial/schema";
import { CHART_TYPE_RADIAL } from "@/constants";
import {
    ChartMetadata,
    ChartTypography,
    ChartBoxModel,
    ChartColors,
    ChartVisual,
} from "@/modules/chart-attributes/schema";

// Fetch all radial charts for a given collection
export async function fetchRadialChartsByCollection(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullRadialChartSelect[];
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
                    eq(ChartMetadata.type, CHART_TYPE_RADIAL)
                )
            )
            .innerJoin(
                RadialCharts,
                eq(ChartMetadata.chartId, RadialCharts.chartId)
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

        return { ok: true, charts: charts as FullRadialChartSelect[] };
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

// Fetch a single radial chart (core only)
export async function fetchRadialChartById(chartId: string): Promise<
    | {
          ok: true;
          chart: RadialChartSelect;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const [chart] = await db
            .select()
            .from(RadialCharts)
            .where(eq(RadialCharts.chartId, chartId))
            .limit(1);

        if (!chart) {
            return { ok: false, error: "Radial chart not found" };
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

// Fetch a full radial chart (joined with metadata + styles)
export async function fetchFullRadialChartById(chartId: string): Promise<
    | {
          ok: true;
          chart: FullRadialChartSelect;
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
                    eq(ChartMetadata.type, CHART_TYPE_RADIAL)
                )
            )
            .innerJoin(
                RadialCharts,
                eq(ChartMetadata.chartId, RadialCharts.chartId)
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
            return { ok: false, error: "Radial chart not found" };
        }

        return { ok: true, chart: chart as FullRadialChartSelect };
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
