import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { Collections } from "@/db/schema";

export const CollectionSchema = {
    Insert: createInsertSchema(Collections, {
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
    }).omit({
        collection_id: true,
        created_at: true,
        user_id: true,
        chart_count: true,
    }), // here we added userId cause the user will only submit name and description and we get the user id from the session
    Select: createSelectSchema(Collections),
    Update: createUpdateSchema(Collections, {
        name: z
            .string({
                invalid_type_error: "Name must be a string",
            })
            .max(100, { message: "Name must be at most 100 characters" })
            .optional(),
        description: z
            .string({
                invalid_type_error: "Description must be a string",
            })
            .max(500, { message: "Description must be at most 500 characters" })
            .optional(),
    }).omit({
        collection_id: true,
        created_at: true,
        user_id: true,
        chart_count: true,
    }),
};
