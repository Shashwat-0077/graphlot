import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { AreaCharts } from "@/modules/Area/schema/db";
import {
    ANCHOR_OPTIONS,
    AREA_CHART_TYPES_OPTIONS,
    CHART_TYPE_AREA,
    FONT_STYLES_OPTIONS,
    GRID_ORIENTATION_OPTIONS,
    GRID_TYPE_OPTIONS,
    SORT_OPTIONS,
} from "@/constants";
import { ChartSchema } from "@/modules/ChartMetaData/schema";

// Base schemas from AreaCharts table
const areaInsertBase = createInsertSchema(AreaCharts);
const areaSelectBase = createSelectSchema(AreaCharts);
const areaUpdateBase = createUpdateSchema(AreaCharts);

// Core schema extensions for AreaCharts
export const AreaChartSchema = {
    Insert: areaInsertBase.extend({
        label_anchor: z.enum(ANCHOR_OPTIONS),
        label_font_style: z.enum(FONT_STYLES_OPTIONS),
        x_sort_order: z.enum(SORT_OPTIONS),
        y_sort_order: z.enum(SORT_OPTIONS),
        grid_orientation: z.enum(GRID_ORIENTATION_OPTIONS),
        grid_type: z.enum(GRID_TYPE_OPTIONS),
        area_style: z.enum(AREA_CHART_TYPES_OPTIONS),
    }),
    Select: areaSelectBase.extend({
        label_anchor: z.enum(ANCHOR_OPTIONS),
        label_font_style: z.enum(FONT_STYLES_OPTIONS),
        x_sort_order: z.enum(SORT_OPTIONS),
        y_sort_order: z.enum(SORT_OPTIONS),
        grid_orientation: z.enum(GRID_ORIENTATION_OPTIONS),
        grid_type: z.enum(GRID_TYPE_OPTIONS),
        area_style: z.enum(AREA_CHART_TYPES_OPTIONS),
    }),
    Update: areaUpdateBase
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

// Combined schema with metadata from BasicChart
export const AreaChartWithMetaSchema = {
    Insert: AreaChartSchema.Insert.merge(ChartSchema.Insert).extend({
        type: z.literal(CHART_TYPE_AREA),
    }),
    Select: AreaChartSchema.Select.merge(ChartSchema.Select).extend({
        type: z.literal(CHART_TYPE_AREA),
    }),
    Update: AreaChartSchema.Update.merge(ChartSchema.Update).extend({
        type: z.literal(CHART_TYPE_AREA),
    }),
};

// Inferred Types
export type AreaChartInsert = z.infer<typeof AreaChartSchema.Insert>;
export type AreaChartSelect = z.infer<typeof AreaChartSchema.Select>;
export type AreaChartUpdate = z.infer<typeof AreaChartSchema.Update>;

export type AreaChartWithMetaInsert = z.infer<
    typeof AreaChartWithMetaSchema.Insert
>;
export type AreaChartWithMetaSelect = z.infer<
    typeof AreaChartWithMetaSchema.Select
>;
export type AreaChartWithMetaUpdate = z.infer<
    typeof AreaChartWithMetaSchema.Update
>;
