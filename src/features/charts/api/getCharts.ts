import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { Charts } from "@/db/schema";

import { BasicChartSchema } from "../schema";

export async function getAllChartsWithCollectionId(
    collectionId: string
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
    try {
        const charts = await db
            .select()
            .from(Charts)
            .where(eq(Charts.collection_id, collectionId));

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
    chartId,
    collectionId,
}: {
    chartId: string;
    collectionId: string;
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
                    eq(Charts.chart_id, chartId),
                    eq(Charts.collection_id, collectionId)
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
