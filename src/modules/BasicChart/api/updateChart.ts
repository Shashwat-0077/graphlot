import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { AREA, BAR, DONUT, RADAR, HEATMAP, ChartType } from "@/constants";
import { db } from "@/db";
import {
    AreaCharts,
    BarCharts,
    Charts,
    Collections,
    DonutCharts,
    HeatmapCharts,
    RadarCharts,
} from "@/db/schema";
import { CollectionSelect } from "@/modules/Collection/schema";
import { ChartSelect, ChartUpdate } from "@/modules/BasicChart/schema";

const CHART_TABLES = {
    [AREA]: AreaCharts,
    [BAR]: BarCharts,
    [DONUT]: DonutCharts,
    [RADAR]: RadarCharts,
    [HEATMAP]: HeatmapCharts,
};

async function checkPermission({
    user_id,
    chart_id,
}: {
    user_id: string;
    chart_id: string;
}): Promise<
    | {
          ok: false;
          error: string;
          field: keyof ChartSelect | "root";
      }
    | {
          ok: true;
          collection: CollectionSelect;
          chart: ChartSelect;
      }
> {
    const record = await db
        .select()
        .from(Charts)
        .fullJoin(
            Collections,
            eq(Collections.collection_id, Charts.collection_id)
        )
        .where(eq(Charts.chart_id, chart_id))
        .then(([record]) => record);

    if (!record || !record.charts) {
        return {
            ok: false,
            error: "Chart not found",
            field: "chart_id",
        };
    }

    if (!record.collections) {
        return {
            ok: false,
            error: `Cannot find corresponding Collection to given Chart ID : ${chart_id}`,
            field: "collection_id",
        };
    }

    if (record.collections.user_id !== user_id) {
        return {
            ok: false,
            error: "You do not have permission to Update this chart.",
            field: "root",
        };
    }

    return {
        ok: true,
        collection: record.collections,
        chart: record.charts,
    };
}

export async function updateChartType({
    user_id,
    chart_id,
    type,
}: {
    user_id: string;
    chart_id: string;
    type: ChartType;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field: keyof ChartSelect | "root";
      }
> {
    try {
        const response = await checkPermission({
            user_id: user_id,
            chart_id: chart_id,
        });

        if (!response.ok) {
            return response;
        }

        const { chart } = response;
        const previousTable = CHART_TABLES[chart.type];
        const newTable = CHART_TABLES[type];

        await db.transaction(async (tx) => {
            await tx
                .update(Charts)
                .set({ type, updated_at: new Date() })
                .where(eq(Charts.chart_id, chart_id));

            await tx
                .delete(previousTable)
                .where(eq(previousTable.chart_id, chart_id));

            await tx.insert(newTable).values({ chart_id: chart_id });
        });

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
export async function moveChartBetweenCollections({
    user_id,
    chart_id,
    new_collection_id,
}: {
    user_id: string;
    chart_id: string;
    new_collection_id: string;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field: keyof ChartSelect | "root";
      }
> {
    try {
        const response = await checkPermission({ user_id, chart_id });
        if (!response.ok) {
            return response;
        }

        const destinationCollection = await db
            .select()
            .from(Collections)
            .where(eq(Collections.collection_id, new_collection_id))
            .then(([collection]) => collection);

        if (!destinationCollection) {
            return {
                ok: false,
                error: `Collection with ID ${new_collection_id} does not exist`,
                field: "collection_id",
            };
        }

        await db.transaction(async (tx) => {
            await tx
                .update(Collections)
                .set({ chart_count: sql`${Collections.chart_count} - 1` })
                .where(
                    eq(
                        Collections.collection_id,
                        response.collection.collection_id
                    )
                );

            await tx
                .update(Charts)
                .set({ collection_id: new_collection_id })
                .where(eq(Charts.chart_id, chart_id));

            await tx
                .update(Collections)
                .set({ chart_count: sql`${Collections.chart_count} + 1` })
                .where(eq(Collections.collection_id, new_collection_id));
        });

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}

export async function updateChart({
    newChart,
    chart_id,
    user_id,
}: {
    newChart: ChartUpdate;
    chart_id: string;
    user_id: string;
}): Promise<
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          field: keyof ChartSelect | "root";
      }
> {
    try {
        const response = await checkPermission({ user_id, chart_id });

        if (!response.ok) {
            return response;
        }

        await db
            .update(Charts)
            .set({
                name: newChart.name,
                description: newChart.description,
                updated_at: new Date(),
            })
            .where(eq(Charts.chart_id, chart_id));

        return { ok: true };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
