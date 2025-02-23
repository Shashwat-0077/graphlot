import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

// Bruh this code is shit 😵😵😵😵😵
// This late at night i cant think shit, i will update/optimize it later, i cant think straight
// TODO : Improve this shitty ass code, all of it, so many switch/if-else statements 😵😵😵😵

import { db } from "@/db";
import {
    AreaCharts,
    BarCharts,
    Charts,
    Collections,
    DonutCharts,
    HeatmapCharts,
    RadarCharts,
} from "@/db/schema";
import { CollectionSchema } from "@/modules/collections/schema";
import {
    AreaChartSchema,
    BarChartSchema,
    BasicChartSchema,
    ChartType,
    DonutChartSchema,
    HeatmapChartSchema,
    RadarChartSchema,
} from "@/modules/charts/schema";

type ChartPermissionResult =
    | {
          ok: true;
          record: {
              chart: z.infer<typeof BasicChartSchema.Select>;
              collection: z.infer<typeof CollectionSchema.Select>;
          };
      }
    | {
          ok: false;
          error: string;
          field: keyof z.infer<typeof BasicChartSchema.Select> | "root";
      };

type ChartResponse =
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field: keyof z.infer<typeof BasicChartSchema.Select> | "root";
      };

const CHART_TABLES = {
    Area: AreaCharts,
    Bar: BarCharts,
    Donut: DonutCharts,
    Heatmap: HeatmapCharts,
    Radar: RadarCharts,
} as const;

async function checkPermission({
    user_id,
    chart_id,
}: {
    user_id: string;
    chart_id: string;
}): Promise<ChartPermissionResult> {
    const record = await db
        .select()
        .from(Charts)
        .fullJoin(
            Collections,
            eq(Collections.collection_id, Charts.collection_id)
        )
        .where(eq(Charts.chart_id, chart_id))
        .then(([record]) => record);

    if (!record?.charts) {
        return { ok: false, error: "Chart not found", field: "chart_id" };
    }

    if (!record.collections) {
        return {
            ok: false,
            error: `Cannot find corresponding Collection for Chart ID: ${chart_id}`,
            field: "chart_id",
        };
    }

    if (record.collections.user_id !== user_id) {
        return {
            ok: false,
            error: "You do not have permission to update this chart.",
            field: "root",
        };
    }

    return {
        ok: true,
        record: {
            chart: record.charts,
            collection: record.collections,
        },
    };
}

export async function updateChartType({
    user_id,
    chart_id,
    type,
}: {
    user_id: string;
    chart_id: string;
    type: ChartType;
}): Promise<ChartResponse> {
    try {
        const response = await checkPermission({
            user_id: user_id,
            chart_id: chart_id,
        });
        if (!response.ok) {
            return response;
        }

        const { chart } = response.record;
        const previousTable = CHART_TABLES[chart.type as ChartType];
        const newTable = CHART_TABLES[type];

        await db.transaction(async (tx) => {
            await tx
                .update(Charts)
                .set({ type })
                .where(eq(Charts.chart_id, chart_id));

            await tx
                .delete(previousTable)
                .where(eq(previousTable.chart_id, chart_id));

            await tx.insert(newTable).values({ chart_id: chart_id });
        });

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
export async function moveChartBetweenCollections({
    user_id,
    chart_id,
    new_collection_id,
}: {
    user_id: string;
    chart_id: string;
    new_collection_id: string;
}): Promise<ChartResponse> {
    try {
        const response = await checkPermission({ user_id, chart_id });
        if (!response.ok) {
            return response;
        }

        const destinationCollection = await db
            .select()
            .from(Collections)
            .where(eq(Collections.collection_id, new_collection_id))
            .then(([collection]) => collection);

        if (!destinationCollection) {
            return {
                ok: false,
                error: `Collection with ID ${new_collection_id} does not exist`,
                field: "collection_id",
            };
        }

        await db.transaction(async (tx) => {
            await tx
                .update(Collections)
                .set({ chart_count: sql`${Collections.chart_count} - 1` })
                .where(
                    eq(
                        Collections.collection_id,
                        response.record.collection.collection_id
                    )
                );

            await tx
                .update(Charts)
                .set({ collection_id: new_collection_id })
                .where(eq(Charts.chart_id, chart_id));

            await tx
                .update(Collections)
                .set({ chart_count: sql`${Collections.chart_count} + 1` })
                .where(eq(Collections.collection_id, new_collection_id));
        });

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}

export async function updateChart({
    newChart,
    chart_id,
    user_id,
}: {
    newChart: z.infer<typeof BasicChartSchema.Update>;
    chart_id: string;
    user_id: string;
}): Promise<ChartResponse> {
    try {
        const response = await checkPermission({ user_id, chart_id });
        if (!response.ok) {
            return response;
        }

        await db
            .update(Charts)
            .set({
                name: newChart.name,
                description: newChart.description,
                x_axis: newChart.x_axis,
                y_axis: newChart.y_axis,
            })
            .where(eq(Charts.chart_id, chart_id));

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
export async function updateSpecificChart({
    type,
    chart,
    chart_id,
    user_id,
}:
    | {
          type: "Area";
          chart: z.infer<typeof AreaChartSchema.Update>;
          chart_id: string;
          user_id: string;
      }
    | {
          type: "Bar";
          chart: z.infer<typeof BarChartSchema.Update>;
          chart_id: string;
          user_id: string;
      }
    | {
          type: "Radar";
          chart: z.infer<typeof RadarChartSchema.Update>;
          chart_id: string;
          user_id: string;
      }
    | {
          type: "Donut";
          chart: z.infer<typeof DonutChartSchema.Update>;
          chart_id: string;
          user_id: string;
      }
    | {
          type: "Heatmap";
          chart: z.infer<typeof HeatmapChartSchema.Update>;
          chart_id: string;
          user_id: string;
      }): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field: keyof z.infer<typeof BasicChartSchema.Select> | "root";
      }
> {
    try {
        const response = await checkPermission({ user_id, chart_id });
        if (!response.ok) {
            return response;
        }

        if (type === "Area") {
            const response = await db
                .select()
                .from(Charts)
                .fullJoin(AreaCharts, eq(AreaCharts.chart_id, Charts.chart_id))
                .where(eq(Charts.chart_id, chart_id))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: string;
                              field:
                                  | keyof z.infer<
                                        typeof BasicChartSchema.Select
                                    >
                                  | "root";
                          } => {
                        if (!result || !result.area_chart) {
                            return {
                                ok: false,
                                error: "Chart not found.",
                                field: "root",
                            };
                        }

                        return { ok: true, id: result.area_chart.area_id };
                    }
                );

            if (!response.ok) {
                return response;
            }
            const { id } = response;
            await db
                .update(AreaCharts)
                .set(chart) // TODO : Change this to assign specific values, like {id : newChart.id}
                .where(eq(AreaCharts.chart_id, id));
        } else if (type === "Bar") {
            const response = await db
                .select()
                .from(Charts)
                .fullJoin(BarCharts, eq(BarCharts.chart_id, Charts.chart_id))
                .where(eq(Charts.chart_id, chart_id))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: string;
                              field:
                                  | keyof z.infer<
                                        typeof BasicChartSchema.Select
                                    >
                                  | "root";
                          } => {
                        if (!result || !result.bar_chart) {
                            return {
                                ok: false,
                                error: "Chart not found.",
                                field: "root",
                            };
                        }

                        return { ok: true, id: result.bar_chart.bar_id };
                    }
                );

            if (!response.ok) {
                return response;
            }
            const { id } = response;
            await db
                .update(BarCharts)
                .set(chart) // TODO : Change this to assign specific values, like {id : newChart.id}
                .where(eq(BarCharts.chart_id, id));
        } else if (type === "Radar") {
            const response = await db
                .select()
                .from(Charts)
                .fullJoin(
                    RadarCharts,
                    eq(RadarCharts.chart_id, Charts.chart_id)
                )
                .where(eq(Charts.chart_id, chart_id))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: string;
                              field:
                                  | keyof z.infer<
                                        typeof BasicChartSchema.Select
                                    >
                                  | "root";
                          } => {
                        if (!result || !result.radar_chart) {
                            return {
                                ok: false,
                                error: "Chart not found.",
                                field: "root",
                            };
                        }

                        return { ok: true, id: result.radar_chart.radar_id };
                    }
                );

            if (!response.ok) {
                return response;
            }
            const { id } = response;
            await db
                .update(RadarCharts)
                .set(chart) // TODO : Change this to assign specific values, like {id : newChart.id}
                .where(eq(RadarCharts.chart_id, id));
        } else if (type === "Donut") {
            const response = await db
                .select()
                .from(Charts)
                .fullJoin(
                    DonutCharts,
                    eq(DonutCharts.chart_id, Charts.chart_id)
                )
                .where(eq(Charts.chart_id, chart_id))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: string;
                              field:
                                  | keyof z.infer<
                                        typeof BasicChartSchema.Select
                                    >
                                  | "root";
                          } => {
                        if (!result || !result.donut_chart) {
                            return {
                                ok: false,
                                error: "Chart not found.",
                                field: "root",
                            };
                        }

                        return { ok: true, id: result.donut_chart.donut_id };
                    }
                );

            if (!response.ok) {
                return response;
            }
            const { id } = response;
            await db
                .update(DonutCharts)
                .set(chart) // TODO : Change this to assign specific values, like {id : newChart.id}
                .where(eq(DonutCharts.chart_id, id));
        } else if (type === "Heatmap") {
            const response = await db
                .select()
                .from(Charts)
                .fullJoin(
                    HeatmapCharts,
                    eq(HeatmapCharts.chart_id, Charts.chart_id)
                )
                .where(eq(Charts.chart_id, chart_id))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: string;
                              field:
                                  | keyof z.infer<
                                        typeof BasicChartSchema.Select
                                    >
                                  | "root";
                          } => {
                        if (!result || !result.heatmap_chart) {
                            return {
                                ok: false,
                                error: "Chart not found.",
                                field: "root",
                            };
                        }

                        return {
                            ok: true,
                            id: result.heatmap_chart.heatmap_id,
                        };
                    }
                );

            if (!response.ok) {
                return response;
            }
            const { id } = response;
            await db
                .update(HeatmapCharts)
                .set(chart) // TODO : Change this to assign specific values, like {id : newChart.id}
                .where(eq(HeatmapCharts.chart_id, id));
        } else {
            return {
                ok: false,
                error: "Invalid Chart Type",
                field: "root",
            };
        }

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
