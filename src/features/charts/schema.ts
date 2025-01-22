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

export type ChartsTypes = "Area" | "Bar" | "Donut" | "Heatmap" | "Radar";
export const BasicChartSchema = {
    Insert: createInsertSchema(Charts, {
        collection_id: z.string({
            required_error: "Collection ID is required",
            invalid_type_error: "Collection ID must be a string",
        }),
        name: z
            .string({
                required_error: "Name is required",
                invalid_type_error: "Name must be a string",
            })
            .max(100, { message: "Name must be at most 100 characters" }),
        description: z
            .string({
                required_error: "Description is required",
                invalid_type_error: "Description must be a string",
            })
            .max(500, {
                message: "Description must be at most 500 characters",
            }),
        notionDatabaseUrl: z
            .string({
                required_error: "Notion Database URL is required",
                invalid_type_error: "Notion Database URL must be a string",
            })
            .max(255, {
                message: "Notion Database URL must be at most 255 characters",
            }),
        type: z
            .string({
                required_error: "Type is required",
                invalid_type_error: "Type must be a string",
            })
            .max(20, { message: "Type must be at most 20 characters" })
            .refine(
                (value) => {
                    return [
                        "Area",
                        "Bar",
                        "Donut",
                        "Heatmap",
                        "Radar",
                    ].includes(value);
                },
                {
                    message:
                        "Type must be one of Area, Bar, Donut, Heatmap, Radar",
                }
            ),
    }).omit({ id: true, created_at: true, xAxis: true, yAxis: true }),
    Select: createSelectSchema(Charts),
    Update: createUpdateSchema(Charts, {
        collection_id: z
            .string({
                required_error: "Collection ID is required",
                invalid_type_error: "Collection ID must be a string",
            })
            .optional(),
        name: z
            .string({
                required_error: "Name is required",
                invalid_type_error: "Name must be a string",
            })
            .max(100, { message: "Name must be at most 100 characters" })
            .optional(),
        description: z
            .string({
                required_error: "Description is required",
                invalid_type_error: "Description must be a string",
            })
            .max(500, { message: "Description must be at most 500 characters" })
            .optional(),
        notionDatabaseUrl: z
            .string({
                required_error: "Notion Database URL is required",
                invalid_type_error: "Notion Database URL must be a string",
            })
            .max(255, {
                message: "Notion Database URL must be at most 255 characters",
            })
            .optional(),
        xAxis: z
            .string({
                required_error: "X Axis is required",
                invalid_type_error: "X Axis must be a string",
            })
            .max(255, { message: "X Axis must be at most 255 characters" })
            .optional(),
        yAxis: z
            .string({
                required_error: "Y Axis is required",
                invalid_type_error: "Y Axis must be a string",
            })
            .max(255, { message: "Y Axis must be at most 255 characters" })
            .optional(),
    }).omit({ id: true, created_at: true, type: true }),
};

export const AreaChartSchema = {
    Insert: createInsertSchema(AreaCharts, {
        chart_id: z.string({
            required_error: "Chart ID is required",
            invalid_type_error: "Chart ID must be a string",
        }),
    }).omit({ id: true }),
    Select: createSelectSchema(AreaCharts),
    Update: createUpdateSchema(AreaCharts, {
        chart_id: z
            .string({
                required_error: "Chart ID is required",
                invalid_type_error: "Chart ID must be a string",
            })
            .optional(),
    }).omit({ id: true }),
};

export const BarChartSchema = {
    Insert: createInsertSchema(BarCharts, {
        chart_id: z.string({
            required_error: "Chart ID is required",
            invalid_type_error: "Chart ID must be a string",
        }),
    }).omit({ id: true }),
    Select: createSelectSchema(BarCharts),
    Update: createUpdateSchema(BarCharts, {
        chart_id: z
            .string({
                required_error: "Chart ID is required",
                invalid_type_error: "Chart ID must be a string",
            })
            .optional(),
    }).omit({ id: true }),
};

export const DonutChartSchema = {
    Insert: createInsertSchema(DonutCharts, {
        chart_id: z.string({
            required_error: "Chart ID is required",
            invalid_type_error: "Chart ID must be a string",
        }),
    }).omit({ id: true }),
    Select: createSelectSchema(DonutCharts),
    Update: createUpdateSchema(DonutCharts, {
        chart_id: z
            .string({
                required_error: "Chart ID is required",
                invalid_type_error: "Chart ID must be a string",
            })
            .optional(),
    }).omit({ id: true }),
};

export const HeatmapChartSchema = {
    Insert: createInsertSchema(HeatmapCharts, {
        chart_id: z.string({
            required_error: "Chart ID is required",
            invalid_type_error: "Chart ID must be a string",
        }),
    }).omit({ id: true }),
    Select: createSelectSchema(HeatmapCharts),
    Update: createUpdateSchema(HeatmapCharts, {
        chart_id: z
            .string({
                required_error: "Chart ID is required",
                invalid_type_error: "Chart ID must be a string",
            })
            .optional(),
    }).omit({ id: true }),
};

export const RadarChartSchema = {
    Insert: createInsertSchema(RadarCharts, {
        chart_id: z.string({
            required_error: "Chart ID is required",
            invalid_type_error: "Chart ID must be a string",
        }),
    }).omit({ id: true }),
    Select: createSelectSchema(RadarCharts),
    Update: createUpdateSchema(RadarCharts, {
        chart_id: z
            .string({
                required_error: "Chart ID is required",
                invalid_type_error: "Chart ID must be a string",
            })
            .optional(),
    }).omit({ id: true }),
};
