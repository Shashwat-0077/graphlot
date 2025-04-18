import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { RADAR } from "@/constants";
import { db } from "@/db";
import { RadarCharts, Charts } from "@/db/schema";
import { FullRadarSelect } from "@/modules/Radar/schema";

export async function getAllRadarChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: FullRadarSelect[];
      }
    | { ok: false; error: string }
> {
    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collection_id))
            .innerJoin(RadarCharts, eq(Charts.chart_id, RadarCharts.chart_id))
            .then((charts) => {
                return charts.map((chart) => ({
                    ...chart.radar_charts,
                    ...chart.charts,
                    type: RADAR,
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

export async function getRadarChartWithId({
    chart_id,
}: {
    chart_id: string;
}): Promise<
    | {
          ok: true;
          chart: FullRadarSelect;
      }
    | { ok: false; error: string }
> {
    try {
        const [chart] = await db
            .select()
            .from(Charts)
            .where(eq(Charts.chart_id, chart_id))
            .innerJoin(RadarCharts, eq(Charts.chart_id, RadarCharts.chart_id));

        if (!chart) {
            return { ok: false, error: "Radar chart not found" };
        }

        return {
            ok: true,
            chart: {
                ...chart.radar_charts,
                ...chart.charts,
                type: RADAR,
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
