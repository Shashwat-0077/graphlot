import { desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { ChartGroupSelect } from "@/modules/chartGroups/schema";
import { ChartGroup, ChartGroupCharts } from "@/modules/chartGroups/schema/db";
import {
    getChartWithId,
    getFullChartWithId,
} from "@/modules/BasicChart/api/getCharts";
import { FullAreaSelect } from "@/modules/Area/schema";
import { FullBarSelect } from "@/modules/Bar/schema";
import { FullHeatmapSelect } from "@/modules/Heatmap/schema";
import { FullRadarSelect } from "@/modules/Radar/schema";
import { FullDonutSelect } from "@/modules/Donut/schema";
import { ChartSelect } from "@/modules/BasicChart/schema";

export const getAllGroups = async (
    collection_id: string
): Promise<
    { ok: true; groups: ChartGroupSelect[] } | { ok: false; error: string }
> => {
    try {
        const groups = await db
            .select()
            .from(ChartGroup)
            .where(eq(ChartGroup.collection_id, collection_id))
            .orderBy(desc(ChartGroup.created_at));

        return { ok: true, groups };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
};

export const getGroupWithId = async (
    group_id: string
): Promise<
    { ok: true; group: ChartGroupSelect } | { ok: false; error: string }
> => {
    try {
        const group = await db
            .select()
            .from(ChartGroup)
            .where(eq(ChartGroup.group_id, group_id))
            .limit(1)
            .then(([res]) => res);

        if (!group) {
            return { ok: false, error: "Group not found" };
        }

        return { ok: true, group };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
};

type ChartsInGroupReturn =
    | {
          ok: true;
          charts: ChartSelect[];
      }
    | {
          ok: false;
          error: string;
      };

export const getChartsInGroup = async (
    group_id: string
): Promise<ChartsInGroupReturn> => {
    try {
        const chart_ids = await db
            .select()
            .from(ChartGroupCharts)
            .where(eq(ChartGroupCharts.group_id, group_id));

        const charts = await Promise.all(
            chart_ids.map(async (chart) => {
                const response = await getChartWithId({
                    chart_id: chart.chart_id,
                });
                if (response.ok) {
                    return response.chart;
                }
                return null;
            })
        ).then((res) => res.filter((chart) => chart !== null));

        return { ok: true, charts };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
};

type FullChartsInGroupsReturn =
    | {
          ok: true;
          charts: (
              | FullAreaSelect
              | FullBarSelect
              | FullHeatmapSelect
              | FullRadarSelect
              | FullDonutSelect
          )[];
      }
    | {
          ok: false;
          error: string;
      };
export const getFullChartsInGroup = async (
    group_id: string
): Promise<FullChartsInGroupsReturn> => {
    try {
        const chart_ids = await db
            .select()
            .from(ChartGroupCharts)
            .where(eq(ChartGroupCharts.group_id, group_id));

        const charts = await Promise.all(
            chart_ids.map(async (chart) => {
                const response = await getFullChartWithId({
                    chart_id: chart.chart_id,
                });
                if (response.ok) {
                    return response.chart;
                }
                return null;
            })
        ).then((res) => res.filter((chart) => chart !== null));

        return { ok: true, charts };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
};
