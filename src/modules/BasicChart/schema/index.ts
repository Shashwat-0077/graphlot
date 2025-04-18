import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { Charts } from "@/modules/BasicChart/schema/db";
import { CHART_TYPES } from "@/constants";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(Charts);
const baseSelectSchema = createSelectSchema(Charts);
const baseUpdateSchema = createUpdateSchema(Charts);

export const ChartSchema = {
    Insert: baseInsertSchema
        .extend({
            collection_id: z
                .string()
                .min(1, { message: "Collection ID is required" }),
            name: z.string().min(1, { message: "Name is required" }),
            description: z
                .string()
                .min(1, { message: "Description is required" }),
            notion_database_id: z
                .string()
                .min(1, { message: "Notion Database ID is required" }),
            notion_database_name: z
                .string()
                .min(1, { message: "Notion Database Name is required" }),
            type: z.enum(CHART_TYPES),
        })
        .omit({
            chart_id: true,
            created_at: true,
        }),
    Select: baseSelectSchema.extend({
        type: z.enum(CHART_TYPES),
    }),
    Update: baseUpdateSchema
        .extend({
            collection_id: z.string().optional(),
            name: z.string().optional(),
            description: z.string().optional(),
            notion_database_id: z.string().optional(),
            notion_database_name: z.string().optional(),
            type: z.enum(CHART_TYPES).optional(),
        })
        .omit({
            chart_id: true,
            created_at: true,
        }),
};

// Types for the schemas
export type ChartInsert = z.infer<typeof ChartSchema.Insert>;
export type ChartSelect = z.infer<typeof ChartSchema.Select>;
export type ChartUpdate = z.infer<typeof ChartSchema.Update>;
