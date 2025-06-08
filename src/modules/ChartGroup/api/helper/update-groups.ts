import { eq } from "drizzle-orm";

import { LayoutType } from "@/constants";
import { db } from "@/db";
import { ChartGroup } from "@/db/schema";

export const updateGroup = async ({
    groupId,
    name,
    layoutType,
}: {
    groupId: string;
    name?: string;
    layoutType?: LayoutType;
}): Promise<
    | { ok: true; groupId: string }
    | { ok: false; error: string; details?: unknown }
> => {
    try {
        const date = Date.now();
        const { group_id: updatedGroupId } = await db
            .update(ChartGroup)
            .set({
                name: name,
                layoutType,
                updatedAt: date,
            })
            .where(eq(ChartGroup.groupId, groupId))
            .returning({ group_id: ChartGroup.groupId })
            .get();

        return { ok: true, groupId: updatedGroupId };
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
};
