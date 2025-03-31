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
    DonutChartSchema,
    HeatmapChartSchema,
    RadarChartSchema,
} from "@/modules/charts/schema";
import {
    AREA,
    BAR,
    DONUT,
    RADAR,
    HEATMAP,
    ChartType,
} from "@/modules/charts/constants";

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

export async function updateAreaChart({
    chart_id,
    user_id,
    data,
}: {
    chart_id: string;
    user_id: string;
    data: z.infer<typeof AreaChartSchema.Update>;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field?:
              | keyof z.infer<typeof BasicChartSchema.Select>
              | keyof z.infer<typeof AreaChartSchema.Select>
              | "root";
      }
> {
    try {
        // First check permission
        const permission = await checkPermission({ user_id, chart_id });
        if (!permission.ok) {
            return permission;
        }

        // Verify chart type
        if (permission.record.chart.type !== AREA) {
            return {
                ok: false,
                error: "Chart is not an Area chart",
                field: "type",
            };
        }

        // Find the specific chart data
        const existingChart = await db
            .select()
            .from(AreaCharts)
            .where(eq(AreaCharts.chart_id, chart_id))
            .then((charts) => charts[0]);

        if (!existingChart) {
            return {
                ok: false,
                error: "Area chart data not found",
                field: "chart_id",
            };
        }

        // Update the chart with explicitly listed fields
        await db
            .update(AreaCharts)
            .set({
                x_axis: data.x_axis,
                y_axis: data.y_axis,
                group_by: data.group_by,
                sort_by: data.sort_by,
                background_color: data.background_color,
                text_color: data.text_color,
                grid_color: data.grid_color,
                show_tooltip: data.show_tooltip,
                show_legend: data.show_legend,
                show_grid: data.show_grid,
                border: data.border,
                omitZeroValues: data.omitZeroValues,
                cumulative: data.cumulative,
                filters: data.filters,
                colors: data.colors,
            })
            .where(eq(AreaCharts.chart_id, chart_id));

        return {
            ok: true,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred updating area chart",
        };
    }
}

export async function updateBarChart({
    chart_id,
    user_id,
    data,
}: {
    chart_id: string;
    user_id: string;
    data: z.infer<typeof BarChartSchema.Update>;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field?:
              | keyof z.infer<typeof BasicChartSchema.Select>
              | keyof z.infer<typeof BarChartSchema.Select>
              | "root";
      }
> {
    try {
        // First check permission
        const permission = await checkPermission({ user_id, chart_id });
        if (!permission.ok) {
            return permission;
        }

        // Verify chart type
        if (permission.record.chart.type !== BAR) {
            return {
                ok: false,
                error: "Chart is not a Bar chart",
                field: "type",
            };
        }

        // Find the specific chart data
        const existingChart = await db
            .select()
            .from(BarCharts)
            .where(eq(BarCharts.chart_id, chart_id))
            .then((charts) => charts[0]);

        if (!existingChart) {
            return {
                ok: false,
                error: "Bar chart data not found",
                field: "chart_id",
            };
        }

        // Update the chart with explicitly listed fields
        await db
            .update(BarCharts)
            .set({
                x_axis: data.x_axis,
                y_axis: data.y_axis,
                group_by: data.group_by,
                sort_by: data.sort_by,
                background_color: data.background_color,
                text_color: data.text_color,
                grid_color: data.grid_color,
                show_tooltip: data.show_tooltip,
                show_legend: data.show_legend,
                show_grid: data.show_grid,
                border: data.border,
                omitZeroValues: data.omitZeroValues,
                cumulative: data.cumulative,
                filters: data.filters,
                colors: data.colors,
                barSize: data.barSize,
                barGap: data.barGap,
            })
            .where(eq(BarCharts.chart_id, chart_id));

        return {
            ok: true,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred updating bar chart",
        };
    }
}

export async function updateDonutChart({
    chart_id,
    user_id,
    data,
}: {
    chart_id: string;
    user_id: string;
    data: z.infer<typeof DonutChartSchema.Update>;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field?:
              | keyof z.infer<typeof BasicChartSchema.Select>
              | keyof z.infer<typeof DonutChartSchema.Select>
              | "root";
      }
> {
    try {
        // First check permission
        const permission = await checkPermission({ user_id, chart_id });
        if (!permission.ok) {
            return permission;
        }

        // Verify chart type
        if (permission.record.chart.type !== DONUT) {
            return {
                ok: false,
                error: "Chart is not a Donut chart",
                field: "type",
            };
        }

        // Find the specific chart data
        const existingChart = await db
            .select()
            .from(DonutCharts)
            .where(eq(DonutCharts.chart_id, chart_id))
            .then((charts) => charts[0]);

        if (!existingChart) {
            return {
                ok: false,
                error: "Donut chart data not found",
                field: "chart_id",
            };
        }

        await db
            .update(DonutCharts)
            .set({
                x_axis: data.x_axis,
                sort_by: data.sort_by,
                omitZeroValues: data.omitZeroValues,
                filters: data.filters,
                background_color: data.background_color,
                text_color: data.text_color,
                show_tooltip: data.show_tooltip,
                show_legend: data.show_legend,
                border: data.border,
                colors: data.colors,
            })
            .where(eq(DonutCharts.chart_id, chart_id));

        return {
            ok: true,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred updating donut chart",
        };
    }
}

export async function updateRadarChart({
    chart_id,
    user_id,
    data,
}: {
    chart_id: string;
    user_id: string;
    data: z.infer<typeof RadarChartSchema.Update>;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field?:
              | keyof z.infer<typeof BasicChartSchema.Select>
              | keyof z.infer<typeof RadarChartSchema.Select>
              | "root";
      }
> {
    try {
        // First check permission
        const permission = await checkPermission({ user_id, chart_id });
        if (!permission.ok) {
            return permission;
        }

        // Verify chart type
        if (permission.record.chart.type !== RADAR) {
            return {
                ok: false,
                error: "Chart is not a Radar chart",
                field: "type",
            };
        }

        // Find the specific chart data
        const existingChart = await db
            .select()
            .from(RadarCharts)
            .where(eq(RadarCharts.chart_id, chart_id))
            .then((charts) => charts[0]);

        if (!existingChart) {
            return {
                ok: false,
                error: "Radar chart data not found",
                field: "chart_id",
            };
        }

        // Update the chart with explicitly listed fields
        await db
            .update(RadarCharts)
            .set({
                x_axis: data.x_axis,
                y_axis: data.y_axis,
                group_by: data.group_by,
                sort_by: data.sort_by,
                background_color: data.background_color,
                text_color: data.text_color,
                grid_color: data.grid_color,
                show_tooltip: data.show_tooltip,
                show_legend: data.show_legend,
                show_grid: data.show_grid,
                border: data.border,
                omitZeroValues: data.omitZeroValues,
                cumulative: data.cumulative,
                filters: data.filters,
                colors: data.colors,
            })
            .where(eq(RadarCharts.chart_id, chart_id));

        return {
            ok: true,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred updating radar chart",
        };
    }
}

export async function updateHeatmapChart({
    chart_id,
    user_id,
    data,
}: {
    chart_id: string;
    user_id: string;
    data: z.infer<typeof HeatmapChartSchema.Update>;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field?:
              | keyof z.infer<typeof BasicChartSchema.Select>
              | keyof z.infer<typeof HeatmapChartSchema.Select>
              | "root";
      }
> {
    try {
        // First check permission
        const permission = await checkPermission({ user_id, chart_id });
        if (!permission.ok) {
            return permission;
        }

        // Verify chart type
        if (permission.record.chart.type !== HEATMAP) {
            return {
                ok: false,
                error: "Chart is not a Heatmap chart",
                field: "type",
            };
        }

        // Find the specific chart data
        const existingChart = await db
            .select()
            .from(HeatmapCharts)
            .where(eq(HeatmapCharts.chart_id, chart_id))
            .then((charts) => charts[0]);

        if (!existingChart) {
            return {
                ok: false,
                error: "Heatmap chart data not found",
                field: "chart_id",
            };
        }

        // Update the chart with explicitly listed fields
        await db
            .update(HeatmapCharts)
            .set({
                metric: data.metric,
                streak: data.streak,
                longest_streak: data.longest_streak,
                sum_of_all_entries: data.sum_of_all_entries,
                average_of_all_entries: data.average_of_all_entries,
                number_of_entries: data.number_of_entries,
                toggle_button_hover: data.toggle_button_hover,
                default_box_color: data.default_box_color,
                accent: data.accent,
                icon_colors: data.icon_colors,
                background_color: data.background_color,
                text_color: data.text_color,
                show_tooltip: data.show_tooltip,
                show_legend: data.show_legend,
                border: data.border,
            })
            .where(eq(HeatmapCharts.chart_id, chart_id));

        return {
            ok: true,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred updating heatmap chart",
        };
    }
}
