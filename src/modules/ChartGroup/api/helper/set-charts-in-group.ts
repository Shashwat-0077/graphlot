import { eq } from "drizzle-orm";

import { db } from "@/db";
import { ChartGroupCharts } from "@/db/schema";

export const setChartsInGroup = async (
    groupId: string,
    chartIds: string[]
): Promise<
    | { ok: true; chartIds: string[] }
    | { ok: false; error: string; details?: unknown }
> => {
    try {
        const date = Date.now();
        const charts = await db
            .transaction(async (tx) => {
                await tx
                    .delete(ChartGroupCharts)
                    .where(eq(ChartGroupCharts.groupId, groupId));

                const charts = await tx
                    .insert(ChartGroupCharts)
                    .values(
                        chartIds.map((chartId) => ({
                            groupId,
                            chartId,
                            createdAt: date,
                            updatedAt: date,
                        }))
                    )
                    .returning({ chartId: ChartGroupCharts.chartId })
                    .all();

                return charts.map(({ chartId }) => chartId);
            })
            .then((res) => res);

        return { ok: true, chartIds: charts };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
};
