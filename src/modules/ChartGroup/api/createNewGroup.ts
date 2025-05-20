import { HTTPException } from "hono/http-exception";

import { LayoutType } from "@/constants";
import { db } from "@/db";
import { ChartGroup, ChartGroupCharts } from "@/db/schema";

export async function createNewGroup({
    name,
    collection_id,
    layout_type,
    chart_ids,
}: {
    collection_id: string;
    name: string;
    layout_type: LayoutType;
    chart_ids: string[];
}): Promise<
    | {
          ok: true;
          group_id: string;
      }
    | { ok: false; error: string }
> {
    try {
        const group_id = await db.transaction(async (tx) => {
            // Create new chart group
            const date = new Date();
            const { group_id } = await tx
                .insert(ChartGroup)
                .values({
                    collection_id,
                    name,
                    layout_type,
                    chart_count: chart_ids.length,
                    created_at: date,
                    updated_at: date,
                })
                .returning({ group_id: ChartGroup.group_id })
                .then(([res]) => res);

            await tx.insert(ChartGroupCharts).values(
                chart_ids.map((chart_id) => ({
                    group_id,
                    chart_id,
                    created_at: date,
                    updated_at: date,
                }))
            );

            return group_id;
        });

        return { ok: true, group_id };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
