import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import {
    CHART_BOX_MODEL_TABLE_NAME,
    CHART_COLOR_TABLE_NAME,
    CHART_TYPOGRAPHY_TABLE_NAME,
    CHART_VISUAL_TABLE_NAME,
    CHART_METADATA_TABLE_NAME,
} from "@/modules/Chart/schema/db";
import {
    ChartBoxModelSchema,
    ChartColorSchema,
    ChartMetadataSchema,
    ChartTypographySchema,
    ChartVisualSchema,
} from "@/modules/Chart/schema";
import { CHART_TYPE_BAR, SORT_OPTIONS } from "@/constants";
import { FilterSchema } from "@/constants";
import { BAR_CHARTS_TABLE_NAME, BarCharts } from "@/modules/Bar/schema/db";

// Base schemas from BarCharts table
const barInsertBase = createInsertSchema(BarCharts);
const barSelectBase = createSelectSchema(BarCharts);
const barUpdateBase = createUpdateSchema(BarCharts);

// Core schema extensions for BarCharts
export const BarChartSchema = {
    Insert: barInsertBase.extend({
        xAxisSortOrder: z.enum(SORT_OPTIONS),
        yAxisSortOrder: z.enum(SORT_OPTIONS),
        filters: z.array(FilterSchema),
    }),
    Select: barSelectBase.extend({
        xAxisSortOrder: z.enum(SORT_OPTIONS),
        yAxisSortOrder: z.enum(SORT_OPTIONS),
        filters: z.array(FilterSchema),
    }),
    Update: barUpdateBase
        .extend({
            xAxisSortOrder: z.enum(SORT_OPTIONS).optional(),
            yAxisSortOrder: z.enum(SORT_OPTIONS).optional(),
            filters: z.array(FilterSchema).optional(),
        })
        .omit({
            chartId: true,
        }),
};

export const FullBarSelect = z.object({
    [BAR_CHARTS_TABLE_NAME]: BarChartSchema.Select,
    [CHART_METADATA_TABLE_NAME]: ChartMetadataSchema.Select.extend({
        type: z.literal(CHART_TYPE_BAR),
    }),
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSchema.Select,
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySchema.Select,
    [CHART_COLOR_TABLE_NAME]: ChartColorSchema.Select,
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSchema.Select,
});

export const FullBarUpdate = z.object({
    [BAR_CHARTS_TABLE_NAME]: BarChartSchema.Update.optional(),
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSchema.Update.optional(),
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySchema.Update.optional(),
    [CHART_COLOR_TABLE_NAME]: ChartColorSchema.Update.optional(),
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSchema.Update.optional(),
});

// Inferred Types
export type BarChartSelect = z.infer<typeof BarChartSchema.Select>;
export type BarChartUpdate = z.infer<typeof BarChartSchema.Update>;

export type FullBarChartSelect = z.infer<typeof FullBarSelect>;
export type FullBarChartUpdate = z.infer<typeof FullBarUpdate>;
