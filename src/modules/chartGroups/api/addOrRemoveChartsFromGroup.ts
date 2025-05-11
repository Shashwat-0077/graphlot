import { HTTPException } from "hono/http-exception";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { ChartGroupCharts } from "@/modules/chartGroups/schema/db";

export const addChartsToGroup = async (
    group_id: string,
    chart_ids: string[]
): Promise<
    { ok: true; chart_ids: string[] } | { ok: false; error: string }
> => {
    try {
        const date = new Date();
        const charts = await db
            .insert(ChartGroupCharts)
            .values(
                chart_ids.map((chart_id) => ({
                    group_id,
                    chart_id,
                    created_at: date,
                    updated_at: date,
                }))
            )
            .returning({ chart_id: ChartGroupCharts.chart_id })
            .then((res) => res.map((r) => r.chart_id));

        return { ok: true, chart_ids: charts };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
};

export const removeChartsFromGroup = async (
    group_id: string,
    chart_ids: string[]
): Promise<
    { ok: true; chart_ids: string[] } | { ok: false; error: string }
> => {
    try {
        const charts = await db
            .delete(ChartGroupCharts)
            .where(
                and(
                    eq(ChartGroupCharts.group_id, group_id),
                    inArray(ChartGroupCharts.chart_id, chart_ids)
                )
            )
            .returning({ chart_id: ChartGroupCharts.chart_id })
            .then((res) => res.map((r) => r.chart_id));

        return { ok: true, chart_ids: charts };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
};
