import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { Charts } from "@/db/schema";
import { ChartSelect } from "@/modules/BasicChart/schema";
import { FullAreaSelect } from "@/modules/Area/schema";
import { FullBarSelect } from "@/modules/Bar/schema";
import { FullHeatmapSelect } from "@/modules/Heatmap/schema";
import { FullRadarSelect } from "@/modules/Radar/schema";
import { FullDonutSelect } from "@/modules/Donut/schema";
import { AREA, BAR, DONUT, HEATMAP, RADAR } from "@/constants";
import { getAreaChartWithId } from "@/modules/Area/api/getAreaCharts";
import { getBarChartWithId } from "@/modules/Bar/api/getBarCharts";
import { getHeatmapChartWithId } from "@/modules/Heatmap/api/getHeatmap";
import { getRadarChartWithId } from "@/modules/Radar/api/getRadarCharts";
import { getDonutChartWithId } from "@/modules/Donut/api/getDonutCharts";

export async function getAllChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: ChartSelect[];
      }
    | {
          ok: false;
          error: string;
      }
> {
    // TODO : make this also return the collection name so that it can be displayed on the page

    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collection_id));

        return {
            ok: true,
            charts,
        };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}

export async function getChartWithId({
    chart_id,
}: {
    chart_id: string;
}): Promise<
    | {
          ok: true;
          chart: ChartSelect;
      }
    | {
          ok: false;
          error: string;
      }
> {
    try {
        const chart = await db
            .select()
            .from(Charts)
            .where(and(eq(Charts.chart_id, chart_id)))
            .then(([record]) => record);

        if (!chart) {
            return {
                ok: false,
                error: "Chart not found",
            };
        }

        return {
            ok: true,
            chart,
        };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}

type FullChartReturn =
    | {
          ok: true;
          chart:
              | FullAreaSelect
              | FullBarSelect
              | FullHeatmapSelect
              | FullRadarSelect
              | FullDonutSelect;
      }
    | {
          ok: false;
          error: string;
      };
export const getFullChartWithId = async ({
    chart_id,
}: {
    chart_id: string;
}): Promise<FullChartReturn> => {
    try {
        return await db.transaction(async (tx): Promise<FullChartReturn> => {
            const basicChart = await tx
                .select()
                .from(Charts)
                .where(and(eq(Charts.chart_id, chart_id)))
                .then(([record]) => record);

            if (!basicChart) {
                return {
                    ok: false,
                    error: "Chart not found",
                };
            }
            const chartType = basicChart.type;

            switch (chartType) {
                case AREA:
                    return await getAreaChartWithId({
                        chart_id: basicChart.chart_id,
                    });
                case BAR:
                    return await getBarChartWithId({
                        chart_id: basicChart.chart_id,
                    });
                case HEATMAP:
                    return await getHeatmapChartWithId({
                        chart_id: basicChart.chart_id,
                    });
                case RADAR:
                    return await getRadarChartWithId({
                        chart_id: basicChart.chart_id,
                    });
                case DONUT:
                    return await getDonutChartWithId({
                        chart_id: basicChart.chart_id,
                    });
                default:
                    return {
                        ok: false,
                        error: "Chart type not supported",
                    };
            }
        });
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
};
