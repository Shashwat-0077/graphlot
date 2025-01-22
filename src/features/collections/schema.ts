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
            .max(100, { message: "Name must be at most 100 characters" }),
        description: z
            .string({
                required_error: "Description is required",
                invalid_type_error: "Description must be a string",
            })
            .max(500, {
                message: "Description must be at most 500 characters",
            }),
    }).omit({ id: true, created_at: true, userId: true, chartCount: true }), // here we added userId cause the user will only submit name and description and we get the user id from the session
    Select: createSelectSchema(Collections),
    Update: createUpdateSchema(Collections, {
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
    }).omit({ id: true, created_at: true, userId: true }),
};
