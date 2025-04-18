import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { DONUT } from "@/constants";
import { db } from "@/db";
import { DonutCharts, Charts } from "@/db/schema";
import { FullDonutSelect } from "@/modules/Donut/schema";

export async function getAllDonutChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullDonutSelect[];
      }
    | { ok: false; error: string }
> {
    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collection_id))
            .innerJoin(DonutCharts, eq(Charts.chart_id, DonutCharts.chart_id))
            .then((charts) => {
                return charts.map((chart) => ({
                    ...chart.donut_charts,
                    ...chart.charts,
                    type: DONUT,
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

export async function getDonutChartWithId({
    chart_id,
}: {
    chart_id: string;
}): Promise<
    | {
          ok: true;
          chart: FullDonutSelect;
      }
    | { ok: false; error: string }
> {
    try {
        const [chart] = await db
            .select()
            .from(Charts)
            .where(eq(Charts.chart_id, chart_id))
            .innerJoin(DonutCharts, eq(Charts.chart_id, DonutCharts.chart_id));

        if (!chart) {
            return { ok: false, error: "Donut chart not found" };
        }

        return {
            ok: true,
            chart: {
                ...chart.donut_charts,
                ...chart.charts,
                type: DONUT,
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
