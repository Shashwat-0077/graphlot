import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
    AreaCharts,
    BarCharts,
    ChartBoxModel,
    ChartColors,
    ChartMetadata,
    ChartTypography,
    ChartVisual,
    HeatmapCharts,
    RadarCharts,
    RadialCharts,
} from "@/db/schema";
import { ChartMetadataUpdate } from "@/modules/Chart/schema";
import {
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
    CHART_TYPE_RADIAL,
    ChartType,
} from "@/constants";

export async function updateChartMetadata({
    chartId,
    data,
}: {
    chartId: string;
    data: ChartMetadataUpdate;
}): Promise<
    | {
          ok: true;
          chartId: string;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const { type: _, ...rest } = data;

        const { updatedChartId } = await db
            .update(ChartMetadata)
            .set({
                ...rest,
                updatedAt: Date.now(),
            })
            .where(eq(ChartMetadata.chartId, chartId))
            .returning({ updatedChartId: ChartMetadata.chartId })
            .then(([res]) => res);

        return { ok: true, chartId: updatedChartId };
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

export async function updateChartType({
    chartId,
    type,
}: {
    chartId: string;
    type: ChartType;
}): Promise<
    | {
          ok: true;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        await db.transaction(async (tx) => {
            // Check if chart exists
            const [prevChart] = await tx
                .select()
                .from(ChartMetadata)
                .where(eq(ChartMetadata.chartId, chartId))
                .limit(1);

            if (!prevChart) {
                throw new Error(`Chart with ID ${chartId} not found`);
            }

            // If chart type hasn't changed, no need to proceed
            if (prevChart.type === type) {
                return; // Exit early if type is the same
            }

            // Update chart metadata
            await tx
                .update(ChartMetadata)
                .set({
                    type,
                    updatedAt: Date.now(),
                })
                .where(eq(ChartMetadata.chartId, chartId));

            // Define which types use which shared tables
            // Using explicit type guards to avoid TypeScript errors
            const usesBoxModel = (chartType: ChartType): boolean => {
                return (
                    chartType === CHART_TYPE_AREA ||
                    chartType === CHART_TYPE_BAR ||
                    chartType === CHART_TYPE_RADAR ||
                    chartType === CHART_TYPE_RADIAL
                );
            };

            const usesColors = (chartType: ChartType): boolean => {
                return (
                    chartType === CHART_TYPE_AREA ||
                    chartType === CHART_TYPE_BAR ||
                    chartType === CHART_TYPE_RADAR ||
                    chartType === CHART_TYPE_RADIAL
                );
            };

            const usesTypography = (chartType: ChartType): boolean => {
                return (
                    chartType === CHART_TYPE_AREA ||
                    chartType === CHART_TYPE_BAR ||
                    chartType === CHART_TYPE_RADAR ||
                    chartType === CHART_TYPE_RADIAL
                );
            };

            const usesVisual = (chartType: ChartType): boolean => {
                return (
                    chartType === CHART_TYPE_AREA ||
                    chartType === CHART_TYPE_BAR ||
                    chartType === CHART_TYPE_RADAR ||
                    chartType === CHART_TYPE_RADIAL
                );
            };

            // Clean up type-specific tables for previous type
            switch (prevChart.type) {
                case CHART_TYPE_AREA:
                    await tx
                        .delete(AreaCharts)
                        .where(eq(AreaCharts.chartId, chartId));
                    break;
                case CHART_TYPE_BAR:
                    await tx
                        .delete(BarCharts)
                        .where(eq(BarCharts.chartId, chartId));
                    break;
                case CHART_TYPE_HEATMAP:
                    await tx
                        .delete(HeatmapCharts)
                        .where(eq(HeatmapCharts.chartId, chartId));
                    break;
                case CHART_TYPE_RADAR:
                    await tx
                        .delete(RadarCharts)
                        .where(eq(RadarCharts.chartId, chartId));
                    break;
                case CHART_TYPE_RADIAL:
                    await tx
                        .delete(RadialCharts)
                        .where(eq(RadialCharts.chartId, chartId));
                    break;
                default:
                    throw new Error(
                        `Invalid previous chart type: ${prevChart.type}`
                    );
            }

            // Clean up shared tables if the new type doesn't need them
            // But keep them if the new type still uses them
            if (usesBoxModel(prevChart.type) && !usesBoxModel(type)) {
                await tx
                    .delete(ChartBoxModel)
                    .where(eq(ChartBoxModel.chartId, chartId));
            }

            if (usesColors(prevChart.type) && !usesColors(type)) {
                await tx
                    .delete(ChartColors)
                    .where(eq(ChartColors.chartId, chartId));
            }

            if (usesTypography(prevChart.type) && !usesTypography(type)) {
                await tx
                    .delete(ChartTypography)
                    .where(eq(ChartTypography.chartId, chartId));
            }

            if (usesVisual(prevChart.type) && !usesVisual(type)) {
                await tx
                    .delete(ChartVisual)
                    .where(eq(ChartVisual.chartId, chartId));
            }

            // Add new type-specific records
            const createOperation = [];

            // Create type-specific table entry
            switch (type) {
                case CHART_TYPE_AREA:
                    createOperation.push(
                        tx.insert(AreaCharts).values({
                            chartId,
                        })
                    );
                    break;
                case CHART_TYPE_BAR:
                    createOperation.push(
                        tx.insert(BarCharts).values({
                            chartId,
                        })
                    );
                    break;
                case CHART_TYPE_HEATMAP:
                    createOperation.push(
                        tx.insert(HeatmapCharts).values({
                            chartId,
                        })
                    );
                    break;
                case CHART_TYPE_RADAR:
                    createOperation.push(
                        tx.insert(RadarCharts).values({
                            chartId,
                        })
                    );
                    break;
                case CHART_TYPE_RADIAL:
                    createOperation.push(
                        tx.insert(RadialCharts).values({
                            chartId,
                        })
                    );
                    break;
                default:
                    throw new Error(`Invalid chart type: ${type}`);
            }

            // Now create shared tables if needed by new type but not by previous type

            // BoxModel table
            if (!usesBoxModel(prevChart.type) && usesBoxModel(type)) {
                createOperation.push(
                    tx.insert(ChartBoxModel).values({
                        chartId,
                    })
                );
            }

            // Colors table
            if (!usesColors(prevChart.type) && usesColors(type)) {
                createOperation.push(
                    tx.insert(ChartColors).values({
                        chartId,
                    })
                );
            }

            // Typography table
            if (!usesTypography(prevChart.type) && usesTypography(type)) {
                createOperation.push(
                    tx.insert(ChartTypography).values({
                        chartId,
                    })
                );
            }

            // Visual table
            if (!usesVisual(prevChart.type) && usesVisual(type)) {
                createOperation.push(
                    tx.insert(ChartVisual).values({
                        chartId,
                    })
                );
            }

            await Promise.all(createOperation);
        });

        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred during chart type update",
            details: error,
        };
    }
}
