import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
    CHART_BOX_MODEL_TABLE_NAME,
    CHART_COLOR_TABLE_NAME,
    CHART_TYPOGRAPHY_TABLE_NAME,
    CHART_VISUAL_TABLE_NAME,
    ChartBoxModel,
    ChartColors,
    ChartMetadata,
    ChartTypography,
    ChartVisual,
} from "@/db/schema";
import {
    ChartBoxModelSelect,
    ChartColorSelect,
    ChartMetadataSelect,
    ChartTypographySelect,
    ChartVisualSelect,
    FullChartType,
} from "@/modules/ChartMetaData/schema";
import {
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
    CHART_TYPE_RADIAL,
    DATABASE_NOTION,
    DATABASE_UPLOAD,
    NotionPropertyData,
    NotionPropertySchema,
} from "@/constants";
import { fetchFullAreaChartById } from "@/modules/Area/api/helper/fetch-area-charts";
import { fetchFullBarChartById } from "@/modules/Bar/api/helpers/fetch-bar-charts";
import { fetchFullRadarChartById } from "@/modules/Radar/api/helper/fetch-radar-chart";
import { fetchFullHeatmapById } from "@/modules/Heatmap/api/helper/fetch-heatmap";
import { fetchFullRadialChartById } from "@/modules/Radial/api/helper/fetch-radial-chart";
import { fetchNotionTableSchema } from "@/modules/notion/api/helper/fetch-notion-table-schema";
import { fetchNotionTableData } from "@/modules/notion/api/helper/fetch-notion-table-data";

type ChartPropertiesSelect = {
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSelect | undefined;
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSelect | undefined;
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySelect | undefined;
    [CHART_COLOR_TABLE_NAME]: ChartColorSelect | undefined;
};

export async function fetchChartMetadataByCollection(
    collectionId: string
): Promise<
    | {
          ok: true;
          charts: ChartMetadataSelect[];
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const charts = await db
            .select()
            .from(ChartMetadata)
            .where(eq(ChartMetadata.collectionId, collectionId));

        return { ok: true, charts };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
            details: error,
        };
    }
}

export async function fetchChartMetadataById(chartId: string): Promise<
    | {
          ok: true;
          chart: ChartMetadataSelect;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const [chart] = await db
            .select()
            .from(ChartMetadata)
            .where(eq(ChartMetadata.chartId, chartId))
            .limit(1);

        if (!chart) {
            return { ok: false, error: "Chart not found" };
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
                    : "An unknown error occurred",
            details: error,
        };
    }
}

export async function fetchFullChartById(chartId: string): Promise<
    | FullChartType
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        return await db.transaction(
            async (
                tx
            ): Promise<
                | FullChartType
                | {
                      ok: false;
                      error: string;
                      details?: unknown;
                  }
            > => {
                const [chart] = await tx
                    .select()
                    .from(ChartMetadata)
                    .where(eq(ChartMetadata.chartId, chartId))
                    .limit(1);

                switch (chart.type) {
                    case CHART_TYPE_AREA:
                        const areaRes = await fetchFullAreaChartById(
                            chart.chartId
                        );
                        if (!areaRes.ok) {
                            return areaRes;
                        }
                        return {
                            ok: true,
                            type: CHART_TYPE_AREA,
                            chart: areaRes.chart,
                        };
                    case CHART_TYPE_BAR:
                        const barRes = await fetchFullBarChartById(
                            chart.chartId
                        );
                        if (!barRes.ok) {
                            return barRes;
                        }
                        return {
                            ok: true,
                            type: CHART_TYPE_BAR,
                            chart: barRes.chart,
                        };
                    case CHART_TYPE_RADAR:
                        const radarRes = await fetchFullRadarChartById(
                            chart.chartId
                        );
                        if (!radarRes.ok) {
                            return radarRes;
                        }
                        return {
                            ok: true,
                            type: CHART_TYPE_RADAR,
                            chart: radarRes.chart,
                        };
                    case CHART_TYPE_HEATMAP:
                        const heatmapRes = await fetchFullHeatmapById(
                            chart.chartId
                        );
                        if (!heatmapRes.ok) {
                            return heatmapRes;
                        }
                        return {
                            ok: true,
                            type: CHART_TYPE_HEATMAP,
                            chart: heatmapRes.chart,
                        };
                    case CHART_TYPE_RADIAL:
                        const radialRes = await fetchFullRadialChartById(
                            chart.chartId
                        );
                        if (!radialRes.ok) {
                            return radialRes;
                        }
                        return {
                            ok: true,
                            type: CHART_TYPE_RADIAL,
                            chart: radialRes.chart,
                        };
                    default:
                        return {
                            ok: false,
                            error: "Chart type not supported",
                            details: new Error("Chart type not supported"),
                        };
                }
            }
        );
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
            details: error,
        };
    }
}

export async function fetchChartPropertiesById(chartId: string): Promise<
    | {
          ok: true;
          properties: ChartPropertiesSelect;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const properties = await db.transaction(
            async (tx): Promise<ChartPropertiesSelect> => {
                const [chart] = await tx
                    .select()
                    .from(ChartMetadata)
                    .where(eq(ChartMetadata.chartId, chartId))
                    .limit(1);

                if (!chart) {
                    throw new Error("Chart not found");
                }

                const [visual] = await tx
                    .select()
                    .from(ChartVisual)
                    .where(eq(ChartVisual.chartId, chart.chartId))
                    .limit(1);
                const [boxModel] = await tx
                    .select()
                    .from(ChartBoxModel)
                    .where(eq(ChartBoxModel.chartId, chart.chartId))
                    .limit(1);
                const [typography] = await tx
                    .select()
                    .from(ChartTypography)
                    .where(eq(ChartTypography.chartId, chart.chartId))
                    .limit(1);
                const [color] = await tx
                    .select()
                    .from(ChartColors)
                    .where(eq(ChartColors.chartId, chart.chartId))
                    .limit(1);

                return {
                    [CHART_VISUAL_TABLE_NAME]: visual,
                    [CHART_BOX_MODEL_TABLE_NAME]: boxModel,
                    [CHART_TYPOGRAPHY_TABLE_NAME]: typography,
                    [CHART_COLOR_TABLE_NAME]: color,
                };
            }
        );

        return {
            ok: true,
            properties,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
            details: error,
        };
    }
}

export async function fetchChartSchema({
    chartId,
    userId,
}: {
    chartId: string;
    userId: string;
}): Promise<
    | {
          ok: true;
          databaseProvider: typeof DATABASE_NOTION;
          schema: NotionPropertySchema;
      }
    | {
          ok: true;
          databaseProvider: typeof DATABASE_UPLOAD;
          schema: null;
      }
    | { ok: false; error: string; details?: unknown }
> {
    const chart = await db
        .select()
        .from(ChartMetadata)
        .where(eq(ChartMetadata.chartId, chartId))
        .get();

    if (!chart) {
        return {
            ok: false,
            error: "Chart not found",
        };
    }

    if (!chart.databaseId) {
        return {
            ok: false,
            error: "Chart does not have a database associated",
        };
    }

    switch (chart.databaseProvider) {
        case DATABASE_NOTION:
            const response = await fetchNotionTableSchema({
                databaseId: chart.databaseId,
                userId,
            });

            if (!response.ok) {
                return {
                    ok: false,
                    error: "Failed to fetch database schema",
                    details: response.error,
                };
            }

            if (!response.schema) {
                return {
                    ok: false,
                    error: "Database schema is empty",
                };
            }

            const schema = response.schema;

            return {
                ok: true,
                databaseProvider: DATABASE_NOTION,
                schema: schema,
            };
            break;
        case DATABASE_UPLOAD:
            return {
                ok: true,
                databaseProvider: DATABASE_UPLOAD,
                schema: null,
            };
            break;
        default:
            return {
                ok: false,
                error: `Unsupported database provider: ${chart.databaseProvider}`,
            };
    }
}

export async function fetchChartData({
    chartId,
    userId,
}: {
    chartId: string;
    userId: string;
}): Promise<
    | {
          ok: true;
          data: NotionPropertyData[] | null; // Replace null with the Upload schema that you will generate
      }
    | { ok: false; error: string; details?: unknown }
> {
    const chart = await db
        .select()
        .from(ChartMetadata)
        .where(eq(ChartMetadata.chartId, chartId))
        .get();

    if (!chart) {
        return {
            ok: false,
            error: "Chart not found",
        };
    }

    if (!chart.databaseId) {
        return {
            ok: false,
            error: "Chart does not have a database associated",
        };
    }

    switch (chart.databaseProvider) {
        case DATABASE_NOTION:
            const response = await fetchNotionTableData({
                databaseId: chart.databaseId,
                userId,
            });

            if (!response.ok) {
                return {
                    ok: false,
                    error: "Failed to fetch chart data",
                    details: response.error,
                };
            }

            return {
                ok: true,
                data: response.data,
            };
        case DATABASE_UPLOAD:
            // For uploaded databases, we assume the data is not available
            return {
                ok: true,
                data: null,
            };
        default:
            return {
                ok: false,
                error: `Unsupported database provider: ${chart.databaseProvider}`,
            };
    }
}
