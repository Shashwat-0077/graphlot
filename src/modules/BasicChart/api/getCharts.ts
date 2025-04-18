import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { Charts } from "@/db/schema";
import { ChartSelect } from "@/modules/BasicChart/schema";

export async function getAllChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: ChartSelect[];
      }
    | {
          ok: false;
          error: string;
      }
> {
    // TODO : make this also return the collection name so that it can be displayed on the page

    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collection_id));

        return {
            ok: true,
            charts,
        };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}

export async function getChartWithId({
    chart_id,
}: {
    chart_id: string;
}): Promise<
    | {
          ok: true;
          chart: ChartSelect;
      }
    | {
          ok: false;
          error: string;
      }
> {
    try {
        const chart = await db
            .select()
            .from(Charts)
            .where(and(eq(Charts.chart_id, chart_id)))
            .then(([record]) => record);

        if (!chart) {
            return {
                ok: false,
                error: "Chart not found",
            };
        }

        return {
            ok: true,
            chart,
        };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        });
    }
}
