import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { AreaChartSelect, FullAreaChartSelect } from "@/modules/Area/schema";
import { AreaCharts } from "@/modules/Area/schema/db";
import {
    ChartColors,
    ChartBoxModel,
    ChartMetadata,
    ChartTypography,
    ChartVisual,
} from "@/modules/Chart/schema/db";
import { CHART_TYPE_AREA } from "@/constants";

export async function fetchAreaChartsByCollection(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullAreaChartSelect[];
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
                    eq(ChartMetadata.type, CHART_TYPE_AREA)
                )
            )
            .innerJoin(
                AreaCharts,
                eq(ChartMetadata.chartId, AreaCharts.chartId)
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

        return { ok: true, charts: charts as FullAreaChartSelect[] };
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

export async function fetchAreaChartById(chartId: string): Promise<
    | {
          ok: true;
          chart: AreaChartSelect;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const [chart] = await db
            .select()
            .from(AreaCharts)
            .where(eq(AreaCharts.chartId, chartId))
            .limit(1);

        if (!chart) {
            return { ok: false, error: "Area chart not found" };
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

export async function fetchFullAreaChartById(chartId: string): Promise<
    | {
          ok: true;
          chart: FullAreaChartSelect;
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
                    eq(ChartMetadata.type, CHART_TYPE_AREA)
                )
            )
            .innerJoin(
                AreaCharts,
                eq(ChartMetadata.chartId, AreaCharts.chartId)
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
            return { ok: false, error: "Area chart not found" };
        }

        return {
            ok: true,
            chart: chart as FullAreaChartSelect,
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
