import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import {
    AreaCharts,
    BarCharts,
    Charts,
    DonutCharts,
    HeatmapCharts,
    RadarCharts,
} from "@/db/schema";

export const CHART_TYPES = [
    "Area",
    "Bar",
    "Donut",
    "Heatmap",
    "Radar",
] as const;
export type ChartType = (typeof CHART_TYPES)[number];

const commonStringSchema = {
    required: (field: string, maxLength: number = 255) =>
        z
            .string({
                required_error: `${field} is required`,
                invalid_type_error: `${field} must be a string`,
            })
            .min(1, { message: `${field} is required` })
            .max(maxLength, {
                message: `${field} must be at most ${maxLength} characters`,
            }),
    optional: (field: string, maxLength: number = 255) =>
        z
            .string({
                invalid_type_error: `${field} must be a string`,
            })
            .max(maxLength, {
                message: `${field} must be at most ${maxLength} characters`,
            })
            .optional(),
};
export const ChartsTypesSchema = z
    .string({
        required_error: "Type is required",
        invalid_type_error: "Type must be a string",
    })
    .min(1, { message: "Type is required" })
    .max(20, { message: "Type must be at most 20 characters" })
    .refine(
        (value): value is ChartType => CHART_TYPES.includes(value as ChartType),
        {
            message: `Type must be one of ${CHART_TYPES.join(", ")}`,
        }
    );

export const BasicChartSchema = {
    Insert: createInsertSchema(Charts, {
        collection_id: commonStringSchema.required("Collection ID"),
        name: commonStringSchema.required("Name", 100),
        description: commonStringSchema.required("Description", 500),
        notion_database_name: commonStringSchema.required(
            "Notion Database Name",
            255
        ),
        notion_database_id: commonStringSchema.required(
            "Notion Database ID",
            255
        ),
        type: ChartsTypesSchema,
    }).omit({ chart_id: true, created_at: true, x_axis: true, y_axis: true }),
    Select: createSelectSchema(Charts),
    Update: createUpdateSchema(Charts, {
        name: commonStringSchema.optional("Name", 100),
        description: commonStringSchema.optional("Description", 500),
        xAxis: commonStringSchema.optional("X Axis", 255),
        yAxis: commonStringSchema.optional("Y Axis", 255),
    }).omit({
        chart_id: true,
        created_at: true,
        type: true,
        collection_id: true,
        notion_database_name: true,
        notion_database_id: true,
    }),
};

export const AreaChartSchema = {
    Insert: createInsertSchema(AreaCharts, {
        chart_id: commonStringSchema.required("Chart ID"),
    }).omit({ area_id: true }),
    Select: createSelectSchema(AreaCharts),
    Update: createUpdateSchema(AreaCharts, {
        chart_id: commonStringSchema.optional("Chart ID"),
    }).omit({ area_id: true }),
};

export const BarChartSchema = {
    Insert: createInsertSchema(BarCharts, {
        chart_id: commonStringSchema.required("Chart ID"),
    }).omit({ bar_id: true }),
    Select: createSelectSchema(BarCharts),
    Update: createUpdateSchema(BarCharts, {
        chart_id: commonStringSchema.optional("Chart ID"),
    }).omit({ bar_id: true }),
};

export const DonutChartSchema = {
    Insert: createInsertSchema(DonutCharts, {
        chart_id: commonStringSchema.required("Chart ID"),
    }).omit({ donut_id: true }),
    Select: createSelectSchema(DonutCharts),
    Update: createUpdateSchema(DonutCharts, {
        chart_id: commonStringSchema.optional("Chart ID"),
    }).omit({ donut_id: true }),
};

export const HeatmapChartSchema = {
    Insert: createInsertSchema(HeatmapCharts, {
        chart_id: commonStringSchema.required("Chart ID"),
    }).omit({ heatmap_id: true }),
    Select: createSelectSchema(HeatmapCharts),
    Update: createUpdateSchema(HeatmapCharts, {
        chart_id: commonStringSchema.optional("Chart ID"),
    }).omit({ heatmap_id: true }),
};

export const RadarChartSchema = {
    Insert: createInsertSchema(RadarCharts, {
        chart_id: commonStringSchema.required("Chart ID"),
    }).omit({ radar_id: true }),
    Select: createSelectSchema(RadarCharts),
    Update: createUpdateSchema(RadarCharts, {
        chart_id: commonStringSchema.optional("Chart ID"),
    }).omit({ radar_id: true }),
};
