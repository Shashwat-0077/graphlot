import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { AREA } from "@/constants";
import { db } from "@/db";
import { AreaCharts, Charts } from "@/db/schema";
import { FullAreaSelect } from "@/modules/Area/schema";

export async function getAllAreaChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullAreaSelect[];
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
                    type: AREA,
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

export async function getAreaChartWithId({
    chart_id,
}: {
    chart_id: string;
}): Promise<
    | {
          ok: true;
          chart: FullAreaSelect;
      }
    | { ok: false; error: string }
> {
    try {
        const [chart] = await db
            .select()
            .from(Charts)
            .where(eq(Charts.chart_id, chart_id))
            .innerJoin(AreaCharts, eq(Charts.chart_id, AreaCharts.chart_id));

        if (!chart) {
            return { ok: false, error: "Area chart not found" };
        }

        return {
            ok: true,
            chart: {
                ...chart.area_charts,
                ...chart.charts,
                type: AREA,
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
