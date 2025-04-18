import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { BarCharts } from "@/modules/Bar/schema/db";
import { BAR, GRID_TYPE } from "@/constants";
import { ChartSchema } from "@/modules/BasicChart/schema";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(BarCharts);
const baseSelectSchema = createSelectSchema(BarCharts);
const baseUpdateSchema = createUpdateSchema(BarCharts);

// Refine the schemas to properly handle JSON fields
export const BarSchema = {
    Insert: baseInsertSchema.extend({
        grid_type: z.enum(GRID_TYPE),
    }),
    Select: baseSelectSchema.extend({
        grid_type: z.enum(GRID_TYPE),
    }),
    Update: baseUpdateSchema
        .extend({
            grid_type: z.enum(GRID_TYPE),
        })
        .omit({
            chart_id: true,
        }),
};

export const FullBarSchema = {
    Insert: BarSchema.Insert.extend(ChartSchema.Insert.shape).extend({
        type: z.literal(BAR),
    }),
    Select: BarSchema.Select.extend(ChartSchema.Select.shape).extend({
        type: z.literal(BAR),
    }),
    Update: BarSchema.Update.extend(ChartSchema.Update.shape).extend({
        type: z.literal(BAR),
    }),
};

// Types for the schemas
export type BarInsert = z.infer<typeof BarSchema.Insert>;
export type BarSelect = z.infer<typeof BarSchema.Select>;
export type BarUpdate = z.infer<typeof BarSchema.Update>;

export type FullBarInsert = z.infer<typeof FullBarSchema.Insert>;
export type FullBarSelect = z.infer<typeof FullBarSchema.Select>;
export type FullBarUpdate = z.infer<typeof FullBarSchema.Update>;
