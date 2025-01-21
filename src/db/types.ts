import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import {
    AreaCharts,
    BarCharts,
    DonutCharts,
    HeatmapCharts,
    RadarCharts,
    Charts,
    Collections,
} from "./schema";

export const SelectCollection = createSelectSchema(Collections);
export const UpdateCollection = createUpdateSchema(Collections, {
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
        .max(500, { message: "Description must be at most 500 characters" }),
}).omit({ id: true, created_at: true, userId: true });
export const InsertCollection = createInsertSchema(Collections, {
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
        .max(500, { message: "Description must be at most 500 characters" }),
}).omit({ id: true, created_at: true, userId: true, chartCount: true }); // here we added userId cause the user will only submit name and description and we get the user id from the session

export type ChartsTypes = "Area" | "Bar" | "Donut" | "Heatmap" | "Radar";
export const SelectChart = createSelectSchema(Charts);
export const InsertChart = createInsertSchema(Charts, {
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
        .max(500, { message: "Description must be at most 500 characters" }),
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
                return ["Area", "Bar", "Donut", "Heatmap", "Radar"].includes(
                    value
                );
            },
            { message: "Type must be one of Area, Bar, Donut, Heatmap, Radar" }
        ),
}).omit({ id: true, created_at: true, xAxis: true, yAxis: true });

export const SelectAreaChart = createSelectSchema(AreaCharts);
export const InsertAreaChart = createInsertSchema(AreaCharts, {
    chart_id: z.string({
        required_error: "Chart ID is required",
        invalid_type_error: "Chart ID must be a string",
    }),
}).omit({ id: true });

export const SelectBarChart = createSelectSchema(BarCharts);
export const InsertBarChart = createInsertSchema(BarCharts, {
    chart_id: z.string({
        required_error: "Chart ID is required",
        invalid_type_error: "Chart ID must be a string",
    }),
}).omit({ id: true });

export const SelectDonutChart = createSelectSchema(DonutCharts);
export const InsertDonutChart = createInsertSchema(DonutCharts, {
    chart_id: z.string({
        required_error: "Chart ID is required",
        invalid_type_error: "Chart ID must be a string",
    }),
}).omit({ id: true });

export const SelectHeatmapChart = createSelectSchema(HeatmapCharts);
export const InsertHeatmapChart = createInsertSchema(HeatmapCharts, {
    chart_id: z.string({
        required_error: "Chart ID is required",
        invalid_type_error: "Chart ID must be a string",
    }),
}).omit({ id: true });

export const SelectRadarChart = createSelectSchema(RadarCharts);
export const InsertRadarChart = createInsertSchema(RadarCharts, {
    chart_id: z.string({
        required_error: "Chart ID is required",
        invalid_type_error: "Chart ID must be a string",
    }),
}).omit({ id: true });
