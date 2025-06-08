import { eq } from "drizzle-orm";

import { db } from "@/db";
import { RadialCharts } from "@/modules/Radial/schema/db";
import { FullRadialChartUpdate } from "@/modules/Radial/schema";
import {
    ChartBoxModel,
    ChartColors,
    ChartMetadata,
    ChartTypography,
} from "@/modules/Chart/schema/db";

type UpdateResult =
    | { ok: true; chartId: string }
    | { ok: false; error: string; details?: unknown };

// TODO: we can make a route so that we only update what is needed
export async function updateRadialChart({
    chartId,
    data,
    options = { validateBeforeUpdate: false },
}: {
    chartId: string;
    data: FullRadialChartUpdate;
    options?: {
        validateBeforeUpdate?: boolean;
    };
}): Promise<UpdateResult> {
    if (!chartId?.trim()) {
        return { ok: false, error: "Chart ID is required" };
    }

    if (!data) {
        return { ok: false, error: "Update data is required" };
    }

    const { radial_chart, chart_box_model, chart_colors, chart_typography } =
        data;

    try {
        if (options.validateBeforeUpdate) {
            const chartExists = await db
                .select({ id: ChartMetadata.chartId })
                .from(ChartMetadata)
                .where(eq(ChartMetadata.chartId, chartId))
                .then((results) => results.length > 0);

            if (!chartExists) {
                return {
                    ok: false,
                    error: `Chart with ID ${chartId} not found`,
                };
            }
        }

        await db.transaction(async (tx) => {
            const updateOperations = [];

            if (radial_chart) {
                updateOperations.push(
                    tx
                        .update(RadialCharts)
                        .set(radial_chart)
                        .where(eq(RadialCharts.chartId, chartId))
                );
            }

            if (chart_box_model) {
                updateOperations.push(
                    tx
                        .update(ChartBoxModel)
                        .set(chart_box_model)
                        .where(eq(ChartBoxModel.chartId, chartId))
                );
            }

            if (chart_colors) {
                updateOperations.push(
                    tx
                        .update(ChartColors)
                        .set(chart_colors)
                        .where(eq(ChartColors.chartId, chartId))
                );
            }

            if (chart_typography) {
                updateOperations.push(
                    tx
                        .update(ChartTypography)
                        .set(chart_typography)
                        .where(eq(ChartTypography.chartId, chartId))
                );
            }

            updateOperations.push(
                tx
                    .update(ChartMetadata)
                    .set({ updatedAt: Date.now() })
                    .where(eq(ChartMetadata.chartId, chartId))
            );

            await Promise.all(updateOperations);
        });

        return { ok: true, chartId };
    } catch (error) {
        if (error instanceof Error) {
            if (
                error.message.includes("CONSTRAINT") ||
                error.message.includes("FOREIGN KEY")
            ) {
                return {
                    ok: false,
                    error: "Database constraint violation",
                    details: error.message,
                };
            }

            if (error.message.includes("SQLITE_BUSY")) {
                return {
                    ok: false,
                    error: "Database is busy, please try again",
                    details: error.message,
                };
            }

            return {
                ok: false,
                error: error.message,
                details: error.stack,
            };
        }

        return {
            ok: false,
            error: "Unknown error occurred during chart update",
            details: error,
        };
    }
}

export async function updateRadialChartWithRetry({
    chartId,
    data,
    maxRetries = 3,
    retryDelay = 200,
}: {
    chartId: string;
    data: FullRadialChartUpdate;
    maxRetries?: number;
    retryDelay?: number;
}): Promise<UpdateResult> {
    let lastError: UpdateResult | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await updateRadialChart({ chartId, data });
            if (result.ok) {
                return result;
            }

            if (
                result.error.includes("busy") ||
                result.error.includes("SQLITE_BUSY")
            ) {
                lastError = result;
                await new Promise((resolve) =>
                    setTimeout(resolve, retryDelay * attempt)
                );
                continue;
            }

            return result;
        } catch (error) {
            lastError = {
                ok: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error during retry",
                details: error,
            };

            if (
                error instanceof Error &&
                (error.message.includes("busy") ||
                    error.message.includes("SQLITE_BUSY"))
            ) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryDelay * attempt)
                );
                continue;
            }

            break;
        }
    }

    return (
        lastError || {
            ok: false,
            error: `Failed to update chart after ${maxRetries} attempts`,
            details: "Max retries reached",
        }
    );
}
