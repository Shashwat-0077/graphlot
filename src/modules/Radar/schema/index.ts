import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { RadarCharts } from "@/modules/Radar/schema/db";
import { RADAR, SORT_OPTIONS } from "@/constants";
import { ChartSchema } from "@/modules/BasicChart/schema";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(RadarCharts);
const baseSelectSchema = createSelectSchema(RadarCharts);
const baseUpdateSchema = createUpdateSchema(RadarCharts);

// Refine the schemas to properly handle JSON fields
export const RadarSchema = {
    Insert: baseInsertSchema.extend({
        sort_x: z.enum(SORT_OPTIONS),
        sort_y: z.enum(SORT_OPTIONS),
    }),
    Select: baseSelectSchema.extend({
        sort_x: z.enum(SORT_OPTIONS),
        sort_y: z.enum(SORT_OPTIONS),
    }),
    Update: baseUpdateSchema
        .extend({
            sort_x: z.enum(SORT_OPTIONS),
            sort_y: z.enum(SORT_OPTIONS),
        })
        .omit({
            chart_id: true,
        }),
};

export const FullRadarSchema = {
    Insert: RadarSchema.Insert.extend(ChartSchema.Insert.shape).extend({
        type: z.literal(RADAR),
    }),
    Select: RadarSchema.Select.extend(ChartSchema.Select.shape).extend({
        type: z.literal(RADAR),
    }),
    Update: RadarSchema.Update.extend(ChartSchema.Update.shape).extend({
        type: z.literal(RADAR),
    }),
};

// Types for the schemas
export type RadarInsert = z.infer<typeof RadarSchema.Insert>;
export type RadarSelect = z.infer<typeof RadarSchema.Select>;
export type RadarUpdate = z.infer<typeof RadarSchema.Update>;

export type FullRadarInsert = z.infer<typeof FullRadarSchema.Insert>;
export type FullRadarSelect = z.infer<typeof FullRadarSchema.Select>;
export type FullRadarUpdate = z.infer<typeof FullRadarSchema.Update>;
