import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { Charts } from "@/db/schema";
import { ChartMetadataSelect } from "@/modules/ChartMetaData/schema";
import { FullAreaSelect } from "@/modules/Area/schema";
import { FullBarSelect } from "@/modules/Bar/schema";
import { FullHeatmapSelect } from "@/modules/Heatmap/schema";
import { FullRadarSelect } from "@/modules/Radar/schema";
import { FullDonutSelect } from "@/modules/Radial/schema";
import { AREA, CHART_TYPE_BAR, DONUT, HEATMAP, RADAR } from "@/constants";
import { fetchFullAreaChartById } from "@/modules/Area/api/helper/fetch-area-charts";
import { getBarChartWithId } from "@/modules/Bar/api/helpers/fetch-bar-charts";
import { getHeatmapChartWithId } from "@/modules/Heatmap/api/helper/fetch-heatmap";
import { getRadarChartWithId } from "@/modules/Radar/api/helper/fetch-radar-chart";
import { getDonutChartWithId } from "@/modules/Radial/api/helper/fetch-radial-chart";

export async function getAllChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: ChartMetadataSelect[];
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
            .where(eq(Charts.collectionId, collection_id));

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
          chart: ChartMetadataSelect;
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
            .where(and(eq(Charts.chartId, chart_id)))
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
                .where(and(eq(Charts.chartId, chart_id)))
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
                    return await fetchFullAreaChartById({
                        chart_id: basicChart.chartId,
                    });
                case CHART_TYPE_BAR:
                    return await getBarChartWithId({
                        chart_id: basicChart.chartId,
                    });
                case HEATMAP:
                    return await getHeatmapChartWithId({
                        chart_id: basicChart.chartId,
                    });
                case RADAR:
                    return await getRadarChartWithId({
                        chart_id: basicChart.chartId,
                    });
                case DONUT:
                    return await getDonutChartWithId({
                        chart_id: basicChart.chartId,
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
