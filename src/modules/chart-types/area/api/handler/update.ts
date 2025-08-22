import { eq } from "drizzle-orm";

import { db } from "@/db";
import { AreaCharts } from "@/modules/chart-types/area/schema";
import { AreaChartUpdate } from "@/modules/chart-types/area/schema/types";
import { ChartMetadata } from "@/modules/chart-attributes/schema";

type UpdateResult =
    | { ok: true; chartId: string }
    | { ok: false; error: string; details?: unknown };

// TODO : we can make a route so that we only update what is needed
export async function updateAreaChart({
    chartId,
    data,
    options = { validateBeforeUpdate: false },
}: {
    chartId: string;
    data: AreaChartUpdate;
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

        const { chartId: id } = await db.transaction(async (tx) => {
            return tx
                .update(AreaCharts)
                .set(data)
                .where(eq(AreaCharts.chartId, chartId))
                .returning({
                    chartId: AreaCharts.chartId,
                })
                .get();
        });

        return { ok: true, chartId: id };
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
