import { db } from "@/db";
import { ChartGroupCharts } from "@/db/schema";

export const addChartsToGroup = async (
    groupId: string,
    chartIds: string[]
): Promise<
    | { ok: true; chartIds: string[] }
    | { ok: false; error: string; details?: unknown }
> => {
    try {
        const date = Date.now();
        const charts = await db
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

        return { ok: true, chartIds: charts.map(({ chartId }) => chartId) };
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
