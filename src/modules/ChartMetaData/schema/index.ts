import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { Charts } from "@/modules/ChartMetaData/schema/db";
import { CHART_TYPES } from "@/constants";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(Charts);
const baseSelectSchema = createSelectSchema(Charts);
const baseUpdateSchema = createUpdateSchema(Charts);

export const ChartSchema = {
    Insert: baseInsertSchema
        .extend({
            type: z.enum(CHART_TYPES),
            created_at: z.date(),
            updated_at: z.date(),
        })
        .omit({
            chart_id: true,
            created_at: true,
            updated_at: true,
        }),
    Select: baseSelectSchema.extend({
        type: z.enum(CHART_TYPES),
    }),
    Update: baseUpdateSchema
        .extend({
            type: z.enum(CHART_TYPES).optional(),
            update_at: z.date().optional(),
        })
        .omit({
            chart_id: true,
            created_at: true,
            updated_at: true,
        }),
};

// Types for the schemas
export type ChartInsert = z.infer<typeof ChartSchema.Insert>;
export type ChartSelect = z.infer<typeof ChartSchema.Select>;
export type ChartUpdate = z.infer<typeof ChartSchema.Update>;
