import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { ChartGroup } from "@/modules/chartGroups/schema/db";

export const deleteGroup = async (
    group_id: string
): Promise<{ ok: true; group_id: string } | { ok: false; error: string }> => {
    try {
        const { group_id: deletedGroupId } = await db
            .delete(ChartGroup)
            .where(eq(ChartGroup.group_id, group_id))
            .returning({ group_id: ChartGroup.group_id })
            .then(([res]) => res);

        return { ok: true, group_id: deletedGroupId };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
};
