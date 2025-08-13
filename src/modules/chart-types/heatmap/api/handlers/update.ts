import { eq } from "drizzle-orm";

import { db } from "@/db";
import { HeatmapCharts } from "@/modules/chart-types/heatmap/schema";
import { HeatmapUpdate } from "@/modules/chart-types/heatmap/schema/types";
import { ChartMetadata } from "@/modules/chart-attributes/schema";

type UpdateResult =
    | { ok: true; chartId: string }
    | { ok: false; error: string; details?: unknown };

export async function updateHeatmap({
    chartId,
    data,
    options = { validateBeforeUpdate: false },
}: {
    chartId: string;
    data: HeatmapUpdate;
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
            tx.update(HeatmapCharts)
                .set(data)
                .where(eq(HeatmapCharts.chartId, chartId));
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
