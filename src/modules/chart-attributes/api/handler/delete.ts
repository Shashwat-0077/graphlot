import { eq } from "drizzle-orm";

import { db } from "@/db";
import { ChartMetadata } from "@/modules/chart-attributes/schema";

export async function deleteChart(
    id: string
): Promise<
    | { ok: true; chartId: string }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        await db
            .delete(ChartMetadata)
            .where(eq(ChartMetadata.chartId, id))
            .execute();

        return { ok: true, chartId: id };
    } catch (error) {
        return { ok: false, error: "Failed to delete chart", details: error };
    }
}
