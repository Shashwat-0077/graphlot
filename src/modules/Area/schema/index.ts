import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { AREA_CHARTS_TABLE_NAME, AreaCharts } from "@/modules/Area/schema/db";
import {
    AREA_CHART_STYLE_OPTIONS,
    CHART_TYPE_AREA,
    SORT_OPTIONS,
} from "@/constants";
import {
    CHART_BOX_MODEL_TABLE_NAME,
    CHART_COLOR_TABLE_NAME,
    CHART_TYPOGRAPHY_TABLE_NAME,
    CHART_VISUAL_TABLE_NAME,
    CHART_METADATA_TABLE_NAME,
} from "@/modules/ChartMetaData/schema/db";
import {
    ChartBoxModelSchema,
    ChartColorSchema,
    ChartMetadataSchema,
    ChartTypographySchema,
    ChartVisualSchema,
} from "@/modules/ChartMetaData/schema";

// Base schemas from AreaCharts table
const areaInsertBase = createInsertSchema(AreaCharts);
const areaSelectBase = createSelectSchema(AreaCharts);
const areaUpdateBase = createUpdateSchema(AreaCharts);

// Core schema extensions for AreaCharts
export const AreaChartSchema = {
    Insert: areaInsertBase.extend({
        xAxisSortOrder: z.enum(SORT_OPTIONS),
        yAxisSortOrder: z.enum(SORT_OPTIONS),
        areaStyle: z.enum(AREA_CHART_STYLE_OPTIONS),
    }),
    Select: areaSelectBase.extend({
        xAxisSortOrder: z.enum(SORT_OPTIONS),
        yAxisSortOrder: z.enum(SORT_OPTIONS),
        areaStyle: z.enum(AREA_CHART_STYLE_OPTIONS),
    }),
    Update: areaUpdateBase
        .extend({
            xAxisSortOrder: z.enum(SORT_OPTIONS).optional(),
            yAxisSortOrder: z.enum(SORT_OPTIONS).optional(),
            areaStyle: z.enum(AREA_CHART_STYLE_OPTIONS).optional(),
        })
        .omit({
            chartId: true,
        }),
};

export const FullAreaSelect = z.object({
    [AREA_CHARTS_TABLE_NAME]: AreaChartSchema.Select,
    [CHART_METADATA_TABLE_NAME]: ChartMetadataSchema.Select.extend({
        type: z.literal(CHART_TYPE_AREA),
    }),
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSchema.Select,
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySchema.Select,
    [CHART_COLOR_TABLE_NAME]: ChartColorSchema.Select,
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSchema.Select,
});

export const FullAreaUpdate = z.object({
    [AREA_CHARTS_TABLE_NAME]: AreaChartSchema.Update.optional(),
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSchema.Update.optional(),
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySchema.Update.optional(),
    [CHART_COLOR_TABLE_NAME]: ChartColorSchema.Update.optional(),
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSchema.Update.optional(),
});

// Inferred Types
export type AreaChartSelect = z.infer<typeof AreaChartSchema.Select>;
export type AreaChartUpdate = z.infer<typeof AreaChartSchema.Update>;

export type FullAreaChartSelect = z.infer<typeof FullAreaSelect>;
export type FullAreaChartUpdate = z.infer<typeof FullAreaUpdate>;
