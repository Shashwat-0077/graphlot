import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import {
    AreaCharts,
    BarCharts,
    Charts,
    DonutCharts,
    HeatmapCharts,
    RadarCharts,
} from "@/db/schema";
import {
    BasicChartSchema,
    FullChartSelectSchema,
} from "@/modules/charts/schema";
import { AREA, BAR, DONUT, HEATMAP, RADAR } from "@/modules/charts/constants";

// Define the return type for the function
type GetFullChartResult =
    | {
          ok: true;
          chart: Zod.infer<typeof FullChartSelectSchema>;
      }
    | {
          ok: false;
          error: Error;
      };

export async function getAllChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: Zod.infer<typeof BasicChartSchema.Select>[];
      }
    | {
          ok: false;
          error: Error;
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
        return {
            ok: false,
            error: new Error(
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred."
            ),
        };
    }
}

export async function getChartWithId({
    chart_id,
}: {
    chart_id: string;
}): Promise<
    | {
          ok: true;
          chart: Zod.infer<typeof BasicChartSchema.Select>;
      }
    | {
          ok: false;
          error: Error;
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
                error: new Error("Chart not found."),
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

export async function getFullChart({
    chart_id,
}: {
    chart_id: string;
}): Promise<GetFullChartResult> {
    try {
        const chart = await db.transaction(async (tx) => {
            const baseChart = await tx
                .select()
                .from(Charts)
                .where(eq(Charts.chart_id, chart_id))
                .then(([record]) => record);

            if (!baseChart) {
                return null;
            }

            switch (baseChart.type) {
                case BAR: {
                    const barChart = await tx
                        .select()
                        .from(BarCharts)
                        .where(eq(BarCharts.chart_id, baseChart.chart_id))
                        .then(([record]) => record);

                    if (!barChart) {
                        return null;
                    }

                    return {
                        ...baseChart,
                        type: BAR,
                        ...barChart,
                    };
                }
                case AREA: {
                    const areaChart = await tx
                        .select()
                        .from(AreaCharts)
                        .where(eq(AreaCharts.chart_id, baseChart.chart_id))
                        .then(([record]) => record);

                    if (!areaChart) {
                        return null;
                    }

                    return {
                        ...baseChart,
                        type: AREA,
                        ...areaChart,
                    };
                }
                case RADAR: {
                    const radarChart = await tx
                        .select()
                        .from(RadarCharts)
                        .where(eq(RadarCharts.chart_id, baseChart.chart_id))
                        .then(([record]) => record);

                    if (!radarChart) {
                        return null;
                    }

                    return {
                        ...baseChart,
                        type: RADAR,
                        ...radarChart,
                    };
                }
                case DONUT: {
                    const donutChart = await tx
                        .select()
                        .from(DonutCharts)
                        .where(eq(DonutCharts.chart_id, baseChart.chart_id))
                        .then(([record]) => record);

                    if (!donutChart) {
                        return null;
                    }
                    return {
                        ...baseChart,
                        type: DONUT,
                        ...donutChart,
                    };
                }
                case HEATMAP: {
                    const heatmapChart = await tx
                        .select()
                        .from(HeatmapCharts)
                        .where(eq(HeatmapCharts.chart_id, baseChart.chart_id))
                        .then(([record]) => record);

                    if (!heatmapChart) {
                        return null;
                    }

                    return {
                        ...baseChart,
                        type: HEATMAP,
                        ...heatmapChart,
                    };
                }
                default:
                    return null;
            }
        });

        if (!chart) {
            return {
                ok: false,
                error: new Error("Chart not found."),
            };
        }

        return {
            ok: true,
            chart: chart as Zod.infer<typeof FullChartSelectSchema>,
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
