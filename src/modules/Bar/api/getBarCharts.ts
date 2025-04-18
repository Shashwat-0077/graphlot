import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { BAR } from "@/constants";
import { db } from "@/db";
import { BarCharts, Charts } from "@/db/schema";
import { FullBarSelect } from "@/modules/Bar/schema";

export async function getAllBarChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullBarSelect[];
      }
    | { ok: false; error: string }
> {
    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collection_id))
            .innerJoin(BarCharts, eq(Charts.chart_id, BarCharts.chart_id))
            .then((charts) => {
                return charts.map((chart) => ({
                    ...chart.bar_charts,
                    ...chart.charts,
                    type: BAR,
                }));
            });

        return { ok: true, charts };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}

export async function getBarChartWithId({
    chart_id,
}: {
    chart_id: string;
}): Promise<
    | {
          ok: true;
          chart: FullBarSelect;
      }
    | { ok: false; error: string }
> {
    try {
        const [chart] = await db
            .select()
            .from(Charts)
            .where(eq(Charts.chart_id, chart_id))
            .innerJoin(BarCharts, eq(Charts.chart_id, BarCharts.chart_id));

        if (!chart) {
            return { ok: false, error: "Bar chart not found" };
        }

        return {
            ok: true,
            chart: {
                ...chart.bar_charts,
                ...chart.charts,
                type: BAR,
            },
        };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
