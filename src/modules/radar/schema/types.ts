import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { RadarCharts, RADAR_CHARTS_TABLE_NAME } from "@/modules/radar/schema"; // adjust if needed
import { SORT_OPTIONS, CHART_TYPE_RADAR } from "@/constants";
import {
    CHART_BOX_MODEL_TABLE_NAME,
    CHART_COLOR_TABLE_NAME,
    CHART_TYPOGRAPHY_TABLE_NAME,
    CHART_VISUAL_TABLE_NAME,
    CHART_METADATA_TABLE_NAME,
} from "@/modules/chart/schema";
import {
    ChartBoxModelSchema,
    ChartColorSchema,
    ChartMetadataSchema,
    ChartTypographySchema,
    ChartVisualSchema,
} from "@/modules/chart/schema/types";

// Base schemas
const radarInsertBase = createInsertSchema(RadarCharts);
const radarSelectBase = createSelectSchema(RadarCharts);
const radarUpdateBase = createUpdateSchema(RadarCharts);

// Core schema extensions for RadarCharts
export const RadarChartSchema = {
    Insert: radarInsertBase.extend({
        xAxisSortOrder: z.enum(SORT_OPTIONS),
        yAxisSortOrder: z.enum(SORT_OPTIONS),
    }),
    Select: radarSelectBase.extend({
        xAxisSortOrder: z.enum(SORT_OPTIONS),
        yAxisSortOrder: z.enum(SORT_OPTIONS),
    }),
    Update: radarUpdateBase
        .extend({
            xAxisSortOrder: z.enum(SORT_OPTIONS).optional(),
            yAxisSortOrder: z.enum(SORT_OPTIONS).optional(),
        })
        .omit({
            chartId: true,
        }),
};

// Full select & update schemas
export const FullRadarSelect = z.object({
    [RADAR_CHARTS_TABLE_NAME]: RadarChartSchema.Select,
    [CHART_METADATA_TABLE_NAME]: ChartMetadataSchema.Select.extend({
        type: z.literal(CHART_TYPE_RADAR),
    }),
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSchema.Select,
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySchema.Select,
    [CHART_COLOR_TABLE_NAME]: ChartColorSchema.Select,
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSchema.Select,
});

export const FullRadarUpdate = z.object({
    [RADAR_CHARTS_TABLE_NAME]: RadarChartSchema.Update.optional(),
    [CHART_VISUAL_TABLE_NAME]: ChartVisualSchema.Update.optional(),
    [CHART_TYPOGRAPHY_TABLE_NAME]: ChartTypographySchema.Update.optional(),
    [CHART_COLOR_TABLE_NAME]: ChartColorSchema.Update.optional(),
    [CHART_BOX_MODEL_TABLE_NAME]: ChartBoxModelSchema.Update.optional(),
});

// Inferred Types
export type RadarChartSelect = z.infer<typeof RadarChartSchema.Select>;
export type RadarChartUpdate = z.infer<typeof RadarChartSchema.Update>;

export type FullRadarChartSelect = z.infer<typeof FullRadarSelect>;
export type FullRadarChartUpdate = z.infer<typeof FullRadarUpdate>;
