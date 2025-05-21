import { LayoutType } from "@/constants";
import { db } from "@/db";
import { ChartGroup, ChartGroupCharts } from "@/db/schema";

export async function createNewGroup({
    name,
    collectionId,
    layoutType,
    chartIds,
}: {
    collectionId: string;
    name: string;
    layoutType: LayoutType;
    chartIds: string[];
}): Promise<
    | {
          ok: true;
          groupId: string;
      }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const groupId = await db.transaction(async (tx) => {
            // Create new chart group
            const date = Date.now();
            const { groupId } = await tx
                .insert(ChartGroup)
                .values({
                    collectionId,
                    name,
                    layoutType,
                    chartCount: chartIds.length,
                    createdAt: date,
                    updatedAt: date,
                })
                .returning({ groupId: ChartGroup.groupId })
                .get();

            await tx.insert(ChartGroupCharts).values(
                chartIds.map((chartId) => ({
                    groupId,
                    chartId,
                    createdAt: date,
                    updatedAt: date,
                }))
            );

            return groupId;
        });

        return { ok: true, groupId };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
}
