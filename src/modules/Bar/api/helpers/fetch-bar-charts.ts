import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { BarChartSelect, FullBarChartSelect } from "@/modules/Bar/schema";
import { BarCharts } from "@/modules/Bar/schema/db";
import {
    ChartColors,
    ChartBoxModel,
    ChartMetadata,
    ChartTypography,
    ChartVisual,
} from "@/modules/Chart/schema/db";
import { CHART_TYPE_BAR } from "@/constants";

export async function fetchBarChartsByCollection(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullBarChartSelect[];
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
                    eq(ChartMetadata.type, CHART_TYPE_BAR)
                )
            )
            .innerJoin(BarCharts, eq(ChartMetadata.chartId, BarCharts.chartId))
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

        return { ok: true, charts: charts as FullBarChartSelect[] };
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

export async function fetchBarChartById(chartId: string): Promise<
    | {
          ok: true;
          chart: BarChartSelect;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const [chart] = await db
            .select()
            .from(BarCharts)
            .where(eq(BarCharts.chartId, chartId))
            .limit(1);

        if (!chart) {
            return { ok: false, error: "Bar chart not found" };
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

export async function fetchFullBarChartById(chartId: string): Promise<
    | {
          ok: true;
          chart: FullBarChartSelect;
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
                    eq(ChartMetadata.type, CHART_TYPE_BAR)
                )
            )
            .innerJoin(BarCharts, eq(ChartMetadata.chartId, BarCharts.chartId))
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
            return { ok: false, error: "Bar chart not found" };
        }

        return { ok: true, chart: chart as FullBarChartSelect };
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
