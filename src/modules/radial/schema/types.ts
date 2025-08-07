import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import {
    RadialCharts,
    RADIAL_CHARTS_TABLE_NAME,
} from "@/modules/radial/schema";
import {
    CHART_BOX_MODEL_TABLE_NAME,
    CHART_COLOR_TABLE_NAME,
    CHART_METADATA_TABLE_NAME,
    CHART_TYPOGRAPHY_TABLE_NAME,
    CHART_VISUAL_TABLE_NAME,
} from "@/modules/chart/schema";
import {
    ChartBoxModelSchema,
    ChartColorSchema,
    ChartMetadataSchema,
    ChartTypographySchema,
    ChartVisualSchema,
} from "@/modules/chart/schema/types";
import { CHART_TYPE_RADIAL, SORT_OPTIONS } from "@/constants";

// Base schemas from RadialCharts table
const radialInsertBase = createInsertSchema(RadialCharts);
const radialSelectBase = createSelectSchema(RadialCharts);
const radialUpdateBase = createUpdateSchema(RadialCharts);

// Core schema extensions for RadialCharts
export const RadialChartSchema = {
    Insert: radialInsertBase.extend({
        xAxisSortOrder: z.enum(SORT_OPTIONS),
        yAxisSortOrder: z.enum(SORT_OPTIONS),
    }),
    Select: radialSelectBase.extend({
        xAxisSortOrder: z.enum(SORT_OPTIONS),
        yAxisSortOrder: z.enum(SORT_OPTIONS),
    }),
    Update: radialUpdateBase
        .extend({
            xAxisSortOrder: z.enum(SORT_OPTIONS).optional(),
        })
        .omit({
            chartId: true,
        }),
};

// Full chart object (SELECT)
export const FullRadialSelect = z.object({
    [RADIAL_CHARTS_TABLE_NAME]: RadialChartSchema.Select,
    [CHART_METADATA_TABLE_NAME]: ChartMetadataSchema.Select.extend({
        type: z.literal(CHART_TYPE_RADIAL),
    }),
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSchema.Select,
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySchema.Select,
    [CHART_COLOR_TABLE_NAME]: ChartColorSchema.Select,
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSchema.Select,
});

// Full chart object (UPDATE)
export const FullRadialUpdate = z.object({
    [RADIAL_CHARTS_TABLE_NAME]: RadialChartSchema.Update.optional(),
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSchema.Update.optional(),
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySchema.Update.optional(),
    [CHART_COLOR_TABLE_NAME]: ChartColorSchema.Update.optional(),
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSchema.Update.optional(),
});

// Inferred Types
export type RadialChartSelect = z.infer<typeof RadialChartSchema.Select>;
export type RadialChartUpdate = z.infer<typeof RadialChartSchema.Update>;

export type FullRadialChartSelect = z.infer<typeof FullRadialSelect>;
export type FullRadialChartUpdate = z.infer<typeof FullRadialUpdate>;
