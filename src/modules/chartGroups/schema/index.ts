import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { LAYOUT_OPTIONS } from "@/constants";
import { ChartGroup } from "@/modules/chartGroups/schema/db";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(ChartGroup);
const baseSelectSchema = createSelectSchema(ChartGroup);
const baseUpdateSchema = createUpdateSchema(ChartGroup);

export const ChartGroupSchema = {
    Insert: baseInsertSchema
        .extend({
            layout_type: z.enum(LAYOUT_OPTIONS),
        })
        .omit({
            group_id: true,
        }),
    Select: baseSelectSchema.extend({
        layout_type: z.enum(LAYOUT_OPTIONS),
    }),
    Update: baseUpdateSchema
        .extend({
            layout_type: z.enum(LAYOUT_OPTIONS).optional(),
        })
        .omit({
            group_id: true,
            created_at: true,
            updated_at: true,
        }),
};

// Types for the schemas
export type ChartGroupInsert = z.infer<typeof ChartGroupSchema.Insert>;
export type ChartGroupSelect = z.infer<typeof ChartGroupSchema.Select>;
export type ChartGroupUpdate = z.infer<typeof ChartGroupSchema.Update>;
