import { eq } from "drizzle-orm";

import { db } from "@/db";
import { ChartGroup } from "@/db/schema";

export const deleteGroup = async (
    groupId: string
): Promise<
    | { ok: true; group_id: string }
    | { ok: false; error: string; details?: unknown }
> => {
    try {
        const resp = await db
            .delete(ChartGroup)
            .where(eq(ChartGroup.groupId, groupId))
            .returning({ groupId: ChartGroup.groupId })
            .get();

        if (!resp) {
            return { ok: false, error: "Group not found" };
        }
        const deletedGroupId = resp.groupId;

        return { ok: true, group_id: deletedGroupId };
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
