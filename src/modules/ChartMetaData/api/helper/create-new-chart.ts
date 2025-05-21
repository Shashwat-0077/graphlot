import {
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
    CHART_TYPE_RADIAL,
    CHART_TYPES,
    ChartType,
} from "@/constants";
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
import { ChartMetadataInsert } from "@/modules/ChartMetaData/schema";

export async function createNewChart(
    data: ChartMetadataInsert,
    extras?: {
        chartId?: string;
        createdAt?: number;
        updatedAt?: number;
    }
): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        // Validate chart type
        if (!CHART_TYPES.includes(data.type)) {
            return {
                ok: false,
                error: `Invalid chart type: ${data.type}`,
            };
        }

        await db.transaction(async (tx) => {
            const { chartId } = await tx
                .insert(ChartMetadata)
                .values({
                    ...data,
                    chartId: extras?.chartId,
                    createdAt: extras?.createdAt ?? Date.now(),
                    updatedAt: extras?.updatedAt ?? Date.now(),
                })
                .returning({
                    chartId: ChartMetadata.chartId,
                })
                .then(([res]) => res);

            const createOperation = [];

            // Define which types use which shared tables - using type guards for type safety
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
                    chartType === CHART_TYPE_RADAR
                );
            };

            // Create type-specific table entry
            switch (data.type) {
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
                    tx.rollback();
                    throw new Error(`Invalid chart type: ${data.type}`);
            }

            // Add shared table entries based on chart type
            if (usesBoxModel(data.type)) {
                createOperation.push(
                    tx.insert(ChartBoxModel).values({
                        chartId,
                    })
                );
            }

            if (usesColors(data.type)) {
                createOperation.push(
                    tx.insert(ChartColors).values({
                        chartId,
                    })
                );
            }

            if (usesTypography(data.type)) {
                createOperation.push(
                    tx.insert(ChartTypography).values({
                        chartId,
                    })
                );
            }

            if (usesVisual(data.type)) {
                createOperation.push(
                    tx.insert(ChartVisual).values({
                        chartId,
                    })
                );
            }

            await Promise.all(createOperation);
        });

        return {
            ok: true,
        };
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("UNIQUE")) {
                return {
                    ok: false,
                    error: "UNIQUE constraint violation",
                    details: error.message,
                };
            }
        }

        return {
            ok: false,
            error: "Unknown error occurred during chart creation",
            details: error,
        };
    }
}
