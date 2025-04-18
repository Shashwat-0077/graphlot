import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { HeatmapCharts } from "@/modules/Heatmap/schema/db";
import { ChartSchema } from "@/modules/BasicChart/schema";
import { HEATMAP } from "@/constants";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(HeatmapCharts);
const baseSelectSchema = createSelectSchema(HeatmapCharts);
const baseUpdateSchema = createUpdateSchema(HeatmapCharts);

// Refine the schemas to properly handle JSON fields
export const HeatmapSchema = {
    Insert: baseInsertSchema,
    Select: baseSelectSchema,
    Update: baseUpdateSchema.omit({
        chart_id: true,
    }),
};

export const FullHeatmapSchema = {
    Insert: HeatmapSchema.Insert.extend(ChartSchema.Insert.shape).extend({
        type: z.literal(HEATMAP),
    }),
    Select: HeatmapSchema.Select.extend(ChartSchema.Select.shape).extend({
        type: z.literal(HEATMAP),
    }),
    Update: HeatmapSchema.Update.extend(ChartSchema.Update.shape).extend({
        type: z.literal(HEATMAP),
    }),
};

// Types for the schemas
export type HeatmapInsert = z.infer<typeof HeatmapSchema.Insert>;
export type HeatmapSelect = z.infer<typeof HeatmapSchema.Select>;
export type HeatmapUpdate = z.infer<typeof HeatmapSchema.Update>;

export type FullHeatmapInsert = z.infer<typeof FullHeatmapSchema.Insert>;
export type FullHeatmapSelect = z.infer<typeof FullHeatmapSchema.Select>;
export type FullHeatmapUpdate = z.infer<typeof FullHeatmapSchema.Update>;
