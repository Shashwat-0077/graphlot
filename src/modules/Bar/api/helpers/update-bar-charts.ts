import { eq } from "drizzle-orm";

import { db } from "@/db";
import { BarCharts } from "@/db/schema";
import { FullBarChartUpdate } from "@/modules/Bar/schema";
import {
    ChartBoxModel,
    ChartColors,
    ChartMetadata,
    ChartTypography,
    ChartVisual,
} from "@/modules/Chart/schema/db";

type UpdateResult =
    | { ok: true; chartId: string }
    | { ok: false; error: string; details?: unknown };

// TODO : we can make a route so that we only update what is needed
export async function updateBarChart({
    chartId,
    data,
    options = { validateBeforeUpdate: false },
}: {
    chartId: string;
    data: FullBarChartUpdate;
    options?: {
        validateBeforeUpdate?: boolean;
    };
}): Promise<UpdateResult> {
    // Validate inputs
    if (!chartId?.trim()) {
        return { ok: false, error: "Chart ID is required" };
    }

    if (!data) {
        return { ok: false, error: "Update data is required" };
    }

    const {
        bar_chart,
        chart_box_model,
        chart_colors,
        chart_typography,
        chart_visual,
    } = data;

    try {
        // Optional validation step
        if (options.validateBeforeUpdate) {
            // Check if chart exists before attempting update
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

        // Perform all database operations in a transaction
        await db.transaction(async (tx) => {
            // Create an array of update operations to perform
            const updateOperations = [];

            // Only update tables with provided data
            if (bar_chart) {
                updateOperations.push(
                    tx
                        .update(BarCharts)
                        .set(bar_chart)
                        .where(eq(BarCharts.chartId, chartId))
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

            if (chart_visual) {
                updateOperations.push(
                    tx
                        .update(ChartVisual)
                        .set(chart_visual)
                        .where(eq(ChartVisual.chartId, chartId))
                );
            }

            // Always update the metadata timestamp
            updateOperations.push(
                tx
                    .update(ChartMetadata)
                    .set({
                        updatedAt: Date.now(),
                    })
                    .where(eq(ChartMetadata.chartId, chartId))
            );

            // Execute all updates in parallel within the transaction
            await Promise.all(updateOperations);
        });

        return { ok: true, chartId };
    } catch (error) {
        // Provide more specific error messages based on error type
        if (error instanceof Error) {
            // Check for constraint violations or foreign key errors
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

            // Check for SQLite specific errors
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

export async function updateBarChartWithRetry({
    chartId,
    data,
    maxRetries = 3,
    retryDelay = 200,
}: {
    chartId: string;
    data: FullBarChartUpdate;
    maxRetries?: number;
    retryDelay?: number;
}): Promise<UpdateResult> {
    let lastError: UpdateResult | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await updateBarChart({ chartId, data });
            if (result.ok) {
                return result;
            }

            // If it's a busy error, retry. Otherwise, return the error
            if (
                result.error.includes("busy") ||
                result.error.includes("SQLITE_BUSY")
            ) {
                lastError = result;
                // Wait before next retry
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

            // Only retry on specific errors
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
