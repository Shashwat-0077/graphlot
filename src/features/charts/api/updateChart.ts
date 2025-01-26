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
import { CollectionSchema } from "@/features/collections/schema";
import { FieldError } from "@/utils/FieldError";

import {
    AreaChartSchema,
    BarChartSchema,
    BasicChartSchema,
    ChartsTypesSchema,
    DonutChartSchema,
    HeatmapChartSchema,
    RadarChartSchema,
} from "../schema";

type ErrorType = FieldError<z.infer<typeof BasicChartSchema.Select>>;

async function CheckPermission({
    userId,
    chartId,
}: {
    userId: string;
    chartId: string;
}): Promise<
    | {
          ok: true;
          record: {
              chart: z.infer<typeof BasicChartSchema.Select>;
              collection: z.infer<typeof CollectionSchema.Select>;
          };
      }
    | {
          ok: false;
          error: ErrorType;
      }
> {
    return await db
        .select()
        .from(Charts)
        .fullJoin(
            Collections,
            eq(Collections.collection_id, Charts.collection_id)
        )
        .where(eq(Charts.chart_id, chartId))
        .then(([record]) => {
            if (!record || !record.charts) {
                return {
                    ok: false,
                    error: new FieldError({
                        field: "chart_id",
                        message: "Chart not found.",
                    }),
                };
            }

            if (!record.collections) {
                return {
                    ok: false,
                    error: new FieldError({
                        field: "chart_id",
                        message: `Cannot find corresponding Collection to given Chart ID : ${chartId}`,
                    }),
                };
            }

            if (record.collections.user_id !== userId) {
                return {
                    ok: false,
                    error: new FieldError({
                        field: "root",
                        message:
                            "You do not have permission to update this chart.",
                    }),
                };
            }

            return {
                ok: true,
                record: {
                    chart: record.charts,
                    collection: record.collections,
                },
            };
        });
}

export async function UpdateChartType({
    userId,
    chartId,
    type,
}: {
    userId: string;
    chartId: string;
    type: z.infer<typeof ChartsTypesSchema>;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: ErrorType;
      }
> {
    try {
        const response = await CheckPermission({ userId, chartId });

        if (!response.ok) {
            return response;
        }

        const { record } = response;

        const previousChartType = record.chart.type;

        await db
            .update(Charts)
            .set({
                type: type,
            })
            .where(eq(Charts.chart_id, chartId));

        switch (previousChartType) {
            case "Bar":
                await db
                    .delete(BarCharts)
                    .where(eq(BarCharts.chart_id, chartId));
                break;
            case "Area":
                await db
                    .delete(AreaCharts)
                    .where(eq(AreaCharts.chart_id, chartId));
                break;
            case "Donut":
                await db
                    .delete(DonutCharts)
                    .where(eq(DonutCharts.chart_id, chartId));
                break;
            case "Heatmap":
                await db
                    .delete(HeatmapCharts)
                    .where(eq(HeatmapCharts.chart_id, chartId));
                break;
            case "Radar":
                await db
                    .delete(RadarCharts)
                    .where(eq(RadarCharts.chart_id, chartId));
                break;
            default:
                break;
        }

        switch (type) {
            case "Bar":
                await db.insert(BarCharts).values({
                    chart_id: chartId,
                });
                break;
            case "Area":
                await db.insert(AreaCharts).values({
                    chart_id: chartId,
                });
                break;
            case "Donut":
                await db.insert(DonutCharts).values({
                    chart_id: chartId,
                });
                break;
            case "Heatmap":
                await db.insert(HeatmapCharts).values({
                    chart_id: chartId,
                });
                break;
            case "Radar":
                await db.insert(RadarCharts).values({
                    chart_id: chartId,
                });
                break;
            default:
                break;
        }

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}

export async function MoveChartBetweenCollections({
    userId,
    chartId,
    newCollectionId,
}: {
    userId: string;
    chartId: string;
    newCollectionId: string;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: ErrorType;
      }
> {
    try {
        const response = await CheckPermission({ userId, chartId });

        if (!response.ok) {
            return response;
        }

        const { collection: previousCollection } = response.record;

        const destinationCollection = await db
            .select()
            .from(Collections)
            .where(eq(Collections.collection_id, newCollectionId))
            .then(([collection]) => collection);

        if (!destinationCollection) {
            return {
                ok: false,
                error: new FieldError({
                    field: "root",
                    message: `New Collection ID is invalid, or Collection with ID ${newCollectionId} does not exists`,
                }),
            };
        }

        await db
            .update(Collections)
            .set({
                chart_count: sql`${Collections.chart_count} - 1`,
            })
            .where(
                eq(Collections.collection_id, previousCollection.collection_id)
            );

        await db
            .update(Charts)
            .set({
                collection_id: newCollectionId,
            })
            .where(eq(Charts.chart_id, chartId));

        await db
            .update(Collections)
            .set({
                chart_count: sql`${Collections.chart_count} + 1`,
            })
            .where(eq(Collections.collection_id, newCollectionId));

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

export async function UpdateChart({
    newChart,
    chartId,
    userId,
}: {
    newChart: z.infer<typeof BasicChartSchema.Update>;
    chartId: string;
    userId: string;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: ErrorType;
      }
> {
    try {
        const response = await CheckPermission({ userId, chartId });
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
            .where(eq(Charts.chart_id, chartId));

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}

export async function UpdateSpecificChart({
    type,
    chart,
    chartId,
    userId,
}:
    | {
          type: "Area";
          chart: z.infer<typeof AreaChartSchema.Update>;
          chartId: string;
          userId: string;
      }
    | {
          type: "Bar";
          chart: z.infer<typeof BarChartSchema.Update>;
          chartId: string;
          userId: string;
      }
    | {
          type: "Radar";
          chart: z.infer<typeof RadarChartSchema.Update>;
          chartId: string;
          userId: string;
      }
    | {
          type: "Donut";
          chart: z.infer<typeof DonutChartSchema.Update>;
          chartId: string;
          userId: string;
      }
    | {
          type: "Heatmap";
          chart: z.infer<typeof HeatmapChartSchema.Update>;
          chartId: string;
          userId: string;
      }): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: ErrorType;
      }
> {
    try {
        const response = await CheckPermission({ userId, chartId });
        if (!response.ok) {
            return response;
        }

        if (type === "Area") {
            const response = await db
                .select()
                .from(Charts)
                .fullJoin(AreaCharts, eq(AreaCharts.chart_id, Charts.chart_id))
                .where(eq(Charts.chart_id, chartId))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: ErrorType;
                          } => {
                        if (!result || !result.area_chart) {
                            return {
                                ok: false,
                                error: new FieldError({
                                    field: "root",
                                    message: "Chart not found.",
                                }),
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
                .where(eq(Charts.chart_id, chartId))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: ErrorType;
                          } => {
                        if (!result || !result.bar_chart) {
                            return {
                                ok: false,
                                error: new FieldError({
                                    field: "root",
                                    message: "Chart not found.",
                                }),
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
                .where(eq(Charts.chart_id, chartId))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: ErrorType;
                          } => {
                        if (!result || !result.radar_chart) {
                            return {
                                ok: false,
                                error: new FieldError({
                                    field: "root",
                                    message: "Chart not found.",
                                }),
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
                .where(eq(Charts.chart_id, chartId))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: ErrorType;
                          } => {
                        if (!result || !result.donut_chart) {
                            return {
                                ok: false,
                                error: new FieldError({
                                    field: "root",
                                    message: "Chart not found.",
                                }),
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
                .where(eq(Charts.chart_id, chartId))
                .then(
                    ([result]):
                        | {
                              ok: true;
                              id: string;
                          }
                        | {
                              ok: false;
                              error: ErrorType;
                          } => {
                        if (!result || !result.heatmap_chart) {
                            return {
                                ok: false,
                                error: new FieldError({
                                    field: "root",
                                    message: "Chart not found.",
                                }),
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
                error: new FieldError({
                    field: "root",
                    message: "Invalid Chart Type",
                }),
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
