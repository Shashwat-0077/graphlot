import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { BarCharts } from "@/modules/Bar/schema/db";
import {
    ANCHOR_OPTIONS,
    AREA_CHART_TYPES_OPTIONS,
    CHART_TYPE_BAR,
    FONT_STYLES_OPTIONS,
    GRID_ORIENTATION_OPTIONS,
    GRID_TYPE_OPTIONS,
    SORT_OPTIONS,
} from "@/constants";
import { ChartSchema } from "@/modules/ChartMetaData/schema";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(BarCharts);
const baseSelectSchema = createSelectSchema(BarCharts);
const baseUpdateSchema = createUpdateSchema(BarCharts);

// Refine the schemas to properly handle JSON fields
export const BarSchema = {
    Insert: baseInsertSchema.extend({
        label_anchor: z.enum(ANCHOR_OPTIONS),
        label_font_style: z.enum(FONT_STYLES_OPTIONS),
        x_sort_order: z.enum(SORT_OPTIONS),
        y_sort_order: z.enum(SORT_OPTIONS),
        grid_orientation: z.enum(GRID_ORIENTATION_OPTIONS),
        grid_type: z.enum(GRID_TYPE_OPTIONS),
        area_style: z.enum(AREA_CHART_TYPES_OPTIONS),
    }),
    Select: baseSelectSchema.extend({
        label_anchor: z.enum(ANCHOR_OPTIONS),
        label_font_style: z.enum(FONT_STYLES_OPTIONS),
        x_sort_order: z.enum(SORT_OPTIONS),
        y_sort_order: z.enum(SORT_OPTIONS),
        grid_orientation: z.enum(GRID_ORIENTATION_OPTIONS),
        grid_type: z.enum(GRID_TYPE_OPTIONS),
        area_style: z.enum(AREA_CHART_TYPES_OPTIONS),
    }),
    Update: baseUpdateSchema
        .extend({
            label_anchor: z.enum(ANCHOR_OPTIONS),
            label_font_style: z.enum(FONT_STYLES_OPTIONS),
            x_sort_order: z.enum(SORT_OPTIONS),
            y_sort_order: z.enum(SORT_OPTIONS),
            grid_orientation: z.enum(GRID_ORIENTATION_OPTIONS),
            grid_type: z.enum(GRID_TYPE_OPTIONS),
            area_style: z.enum(AREA_CHART_TYPES_OPTIONS),
        })
        .omit({
            chart_id: true,
        }),
};

export const FullBarSchema = {
    Insert: BarSchema.Insert.extend(ChartSchema.Insert.shape).extend({
        type: z.literal(CHART_TYPE_BAR),
    }),
    Select: BarSchema.Select.extend(ChartSchema.Select.shape).extend({
        type: z.literal(CHART_TYPE_BAR),
    }),
    Update: BarSchema.Update.extend(ChartSchema.Update.shape).extend({
        type: z.literal(CHART_TYPE_BAR),
    }),
};

// Types for the schemas
export type BarInsert = z.infer<typeof BarSchema.Insert>;
export type BarSelect = z.infer<typeof BarSchema.Select>;
export type BarUpdate = z.infer<typeof BarSchema.Update>;

export type FullBarInsert = z.infer<typeof FullBarSchema.Insert>;
export type FullBarSelect = z.infer<typeof FullBarSchema.Select>;
export type FullBarUpdate = z.infer<typeof FullBarSchema.Update>;
