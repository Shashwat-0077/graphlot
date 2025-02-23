import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { Charts } from "@/db/schema";
import { BasicChartSchema } from "@/modules/charts/schema";

export async function getAllChartsWithCollectionId(
    collection_id: string
): Promise<
    | {
          ok: true;
          charts: Zod.infer<typeof BasicChartSchema.Select>[];
      }
    | {
          ok: false;
          error: Error;
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
        return {
            ok: false,
            error: new Error(
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred."
            ),
        };
    }
}

export async function getChartWithIdAndCollectionId({
    chart_id,
    collection_id,
}: {
    chart_id: string;
    collection_id: string;
}): Promise<
    | {
          ok: true;
          chart: Zod.infer<typeof BasicChartSchema.Select>;
      }
    | {
          ok: false;
          error: Error;
      }
> {
    try {
        const chart = await db
            .select()
            .from(Charts)
            .where(
                and(
                    eq(Charts.chart_id, chart_id),
                    eq(Charts.collection_id, collection_id)
                )
            )
            .then(([record]) => record);

        if (!chart) {
            return {
                ok: false,
                error: new Error("Chart not found."),
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
