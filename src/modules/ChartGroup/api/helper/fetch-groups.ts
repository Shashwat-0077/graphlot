import { eq } from "drizzle-orm";

import { db } from "@/db";
import { ChartGroup, ChartGroupCharts } from "@/db/schema";
import { ChartGroupSelect } from "@/modules/ChartGroup/schema";
import {
    ChartMetadataSelect,
    FullChartType,
} from "@/modules/ChartMetaData/schema";
import {
    fetchChartMetadataById,
    fetchFullChartById,
} from "@/modules/ChartMetaData/api/helper/fetch-chart";

export const fetchAllGroups = async (
    collection_id: string
): Promise<
    | { ok: true; groups: ChartGroupSelect[] }
    | { ok: false; error: string; details?: unknown }
> => {
    try {
        const groups = await db
            .select()
            .from(ChartGroup)
            .where(eq(ChartGroup.collectionId, collection_id))
            .all();

        return { ok: true, groups };
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
};

export const fetchGroupWithId = async (
    group_id: string
): Promise<
    | { ok: true; group: ChartGroupSelect }
    | { ok: false; error: string; details?: unknown }
> => {
    try {
        const group = await db
            .select()
            .from(ChartGroup)
            .where(eq(ChartGroup.groupId, group_id))
            .limit(1)
            .get();

        if (!group) {
            return { ok: false, error: "Group not found" };
        }

        return { ok: true, group };
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
};

type ChartsInGroupReturn =
    | {
          ok: true;
          charts: ChartMetadataSelect[];
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      };

export const fetchChartsInGroupsById = async (
    group_id: string
): Promise<ChartsInGroupReturn> => {
    try {
        const chart_ids = await db
            .select()
            .from(ChartGroupCharts)
            .where(eq(ChartGroupCharts.groupId, group_id))
            .all();

        const charts = await Promise.all(
            chart_ids.map(async (chart) => {
                const response = await fetchChartMetadataById(chart.chartId);
                if (!response.ok) {
                    return null;
                }
                return response.chart;
            })
        ).then((res) => res.filter((chart) => chart !== null));

        return { ok: true, charts };
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
};

export const fetchFullChartsInGroupById = async (
    group_id: string
): Promise<
    | {
          ok: true;
          charts: FullChartType["chart"][];
      }
    | { ok: false; error: string; details?: unknown }
> => {
    try {
        const chartIds = await db
            .select()
            .from(ChartGroupCharts)
            .where(eq(ChartGroupCharts.groupId, group_id));

        const charts = await Promise.all(
            chartIds.map(async (chart) => {
                const response = await fetchFullChartById(chart.chartId);
                if (!response.ok) {
                    return null;
                }
                return response.chart;
            })
        ).then((res) => res.filter((chart) => chart !== null));

        return { ok: true, charts };
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
};
