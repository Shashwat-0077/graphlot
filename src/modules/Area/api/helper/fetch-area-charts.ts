import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { AreaCharts, Charts } from "@/db/schema";
import { AreaChartWithMetaSelect } from "@/modules/Area/schema";
import { CHART_TYPE_AREA } from "@/constants";

export async function fetchAreaChartsByCollection(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: AreaChartWithMetaSelect[];
      }
    | { ok: false; error: string }
> {
    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collection_id))
            .innerJoin(AreaCharts, eq(Charts.chart_id, AreaCharts.chart_id))
            .then((charts) => {
                return charts.map((chart) => ({
                    ...chart.area_charts,
                    ...chart.charts,
                    type: CHART_TYPE_AREA,
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

export async function fetchAreaChartById(chart_id: string): Promise<
    | {
          ok: true;
          chart: AreaChartWithMetaSelect;
      }
    | { ok: false; error: string }
> {
    try {
        const [chart] = await db
            .select()
            .from(AreaCharts)
            .where(eq(AreaCharts.chart_id, chart_id))
            .innerJoin(Charts, eq(AreaCharts.chart_id, Charts.chart_id));

        if (!chart) {
            return { ok: false, error: "Area chart not found" };
        }

        return {
            ok: true,
            chart: {
                ...chart.area_charts,
                ...chart.charts,
                type: CHART_TYPE_AREA,
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
