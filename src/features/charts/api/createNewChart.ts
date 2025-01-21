import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { Charts, Collections } from "@/db/schema";
import { InsertChart } from "@/db/types";

export async function CreateNewChart({
    chart,
}: {
    chart: Zod.infer<typeof InsertChart>;
}): Promise<
    | {
          ok: true;
          newChartId: string;
      }
    | {
          ok: false;
          error: string;
      }
> {
    try {
        const existingChart = await db
            .select()
            .from(Charts)
            .where(
                and(
                    eq(Charts.collection_id, chart.collection_id),
                    eq(Charts.name, chart.name)
                )
            );

        if (existingChart.length > 0) {
            return {
                ok: false,
                error: `Chart with name "${chart.name}" already exists`,
            };
        }

        const [{ id }] = await db
            .insert(Charts)
            .values({
                collection_id: chart.collection_id,
                name: chart.name,
                description: chart.description,
                notionDatabaseUrl: chart.notionDatabaseUrl,
                type: chart.type,
            })
            .returning({ id: Charts.id });

        await db
            .update(Collections)
            .set({
                chartCount: sql`${Collections.chartCount} + 1`,
            })
            .where(eq(Collections.id, chart.collection_id));

        return { ok: true, newChartId: id };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        };
    }
}
