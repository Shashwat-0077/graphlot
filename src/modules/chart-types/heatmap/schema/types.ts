import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import {
    HEATMAP_CHARTS_TABLE_NAME,
    HeatmapCharts,
} from "@/modules/chart-types/heatmap/schema";
import { CHART_TYPE_HEATMAP } from "@/constants";

import { CHART_METADATA_TABLE_NAME } from "@/modules/chart/chart-metadata/schema";
import { ChartMetadataSchema } from "@/modules/chart/chart-metadata/schema/types";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(HeatmapCharts);
const baseSelectSchema = createSelectSchema(HeatmapCharts);
const baseUpdateSchema = createUpdateSchema(HeatmapCharts);

// Refine the schemas to properly handle JSON fields
export const HeatmapSchema = {
    Insert: baseInsertSchema,
    Select: baseSelectSchema,
    Update: baseUpdateSchema.omit({
        chartId: true,
    }),
};

export const FullHeatmapSchema = {
    Select: z.object({
        [HEATMAP_CHARTS_TABLE_NAME]: HeatmapSchema.Select,
        [CHART_METADATA_TABLE_NAME]: ChartMetadataSchema.Select.extend({
            type: z.literal(CHART_TYPE_HEATMAP),
        }),
    }),
    Update: z.object({
        [HEATMAP_CHARTS_TABLE_NAME]: HeatmapSchema.Update.optional(),
    }),
};

// Types for the schemas
export type HeatmapSelect = z.infer<typeof HeatmapSchema.Select>;
export type HeatmapUpdate = z.infer<typeof HeatmapSchema.Update>;

export type FullHeatmapSelect = z.infer<typeof FullHeatmapSchema.Select>;
export type FullHeatmapUpdate = z.infer<typeof FullHeatmapSchema.Update>;
