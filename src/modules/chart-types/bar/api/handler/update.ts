import { eq } from "drizzle-orm";

import { db } from "@/db";
import { BarCharts } from "@/modules/chart-types/bar/schema";
import { BarChartUpdate } from "@/modules/chart-types/bar/schema/types";

import { ChartMetadata } from "@/modules/chart/chart-metadata/schema";

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
    data: BarChartUpdate;
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

        await db.transaction(async (tx) => {
            tx.update(BarCharts)
                .set(data)
                .where(eq(BarCharts.chartId, chartId));
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
