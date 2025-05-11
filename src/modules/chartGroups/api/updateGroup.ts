import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { LayoutOptionsType } from "@/constants";
import { db } from "@/db";
import { ChartGroup } from "@/modules/chartGroups/schema/db";

export const updateGroup = async ({
    group_id,
    name,
    layout_type,
}: {
    group_id: string;
    name: string;
    layout_type: LayoutOptionsType;
}): Promise<{ ok: true; group_id: string } | { ok: false; error: string }> => {
    try {
        const date = new Date();
        const { group_id: updatedGroupId } = await db
            .update(ChartGroup)
            .set({
                name,
                layout_type,
                updated_at: date,
            })
            .where(eq(ChartGroup.group_id, group_id))
            .returning({ group_id: ChartGroup.group_id })
            .then(([res]) => res);

        return { ok: true, group_id: updatedGroupId };
    } catch (error) {
        throw new HTTPException(500, {
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
};
