import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { Collections } from "@/db/schema";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(Collections);
const baseSelectSchema = createSelectSchema(Collections);
const baseUpdateSchema = createUpdateSchema(Collections);

export const CollectionSchema = {
    Insert: baseInsertSchema
        .extend({
            name: z
                .string({
                    required_error: "Name is required",
                    invalid_type_error: "Name must be a string",
                })
                .min(1, { message: "Name is required" })
                .max(100, { message: "Name must be at most 100 characters" }),
            description: z
                .string({
                    required_error: "Description is required",
                    invalid_type_error: "Description must be a string",
                })
                .min(1, { message: "Description is required" })
                .max(500, {
                    message: "Description must be at most 500 characters",
                }),
        })
        .omit({
            collection_id: true,
            created_at: true,
            chart_count: true,
            user_id: true,
        }),
    Select: baseSelectSchema,
    Update: baseUpdateSchema
        .extend({
            name: z
                .string({ invalid_type_error: "Name must be a string" })
                .max(100, { message: "Name must be at most 100 characters" })
                .optional(),
            description: z
                .string({ invalid_type_error: "Description must be a string" })
                .max(500, {
                    message: "Description must be at most 500 characters",
                })
                .optional(),
        })
        .omit({
            collection_id: true,
            created_at: true,
            user_id: true,
            chart_count: true,
        }),
};

// Types for the schemas
export type CollectionInsert = z.infer<typeof CollectionSchema.Insert>;
export type CollectionSelect = z.infer<typeof CollectionSchema.Select>;
export type CollectionUpdate = z.infer<typeof CollectionSchema.Update>;
