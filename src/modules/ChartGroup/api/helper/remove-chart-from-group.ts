import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { ChartGroupCharts } from "@/db/schema";

export const removeChartsFromGroup = async (
    group_id: string,
    chart_ids: string[]
): Promise<
    | { ok: true; chart_ids: string[] }
    | { ok: false; error: string; details?: unknown }
> => {
    try {
        const charts = await db
            .delete(ChartGroupCharts)
            .where(
                and(
                    eq(ChartGroupCharts.groupId, group_id),
                    inArray(ChartGroupCharts.chartId, chart_ids)
                )
            )
            .returning({ chartId: ChartGroupCharts.chartId })
            .all();

        return { ok: true, chart_ids: charts.map(({ chartId }) => chartId) };
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
