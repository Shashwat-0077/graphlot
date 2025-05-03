import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { AreaCharts } from "@/modules/Area/schema/db";
import { AREA, GRID_TYPE, SORT_OPTIONS } from "@/constants";
import { ChartSchema } from "@/modules/BasicChart/schema";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(AreaCharts);
const baseSelectSchema = createSelectSchema(AreaCharts);
const baseUpdateSchema = createUpdateSchema(AreaCharts);

// Refine the schemas to properly handle JSON fields
export const AreaSchema = {
    Insert: baseInsertSchema.extend({
        sort_x: z.enum(SORT_OPTIONS),
        sort_y: z.enum(SORT_OPTIONS),
        grid_type: z.enum(GRID_TYPE),
    }),
    Select: baseSelectSchema.extend({
        sort_x: z.enum(SORT_OPTIONS),
        sort_y: z.enum(SORT_OPTIONS),
        grid_type: z.enum(GRID_TYPE),
    }),
    Update: baseUpdateSchema
        .extend({
            sort_x: z.enum(SORT_OPTIONS).optional(),
            sort_y: z.enum(SORT_OPTIONS).optional(),
            grid_type: z.enum(GRID_TYPE).optional(),
        })
        .omit({
            chart_id: true,
        }),
};

export const FullAreaSchema = {
    Insert: AreaSchema.Insert.extend(ChartSchema.Insert.shape).extend({
        type: z.literal(AREA),
    }),
    Select: AreaSchema.Select.extend(ChartSchema.Select.shape).extend({
        type: z.literal(AREA),
    }),
    Update: AreaSchema.Update.extend(ChartSchema.Update.shape).extend({
        type: z.literal(AREA),
    }),
};

// Types for the schemas
export type AreaInsert = z.infer<typeof AreaSchema.Insert>;
export type AreaSelect = z.infer<typeof AreaSchema.Select>;
export type AreaUpdate = z.infer<typeof AreaSchema.Update>;

export type FullAreaInsert = z.infer<typeof FullAreaSchema.Insert>;
export type FullAreaSelect = z.infer<typeof FullAreaSchema.Select>;
export type FullAreaUpdate = z.infer<typeof FullAreaSchema.Update>;
