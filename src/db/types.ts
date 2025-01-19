import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

import { Collection } from "./schema";

export const CollectionSchema = createInsertSchema(Collection, {
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, { message: "Name must be at least 1 character" })
        .max(100, { message: "Name must be at most 100 characters" }),
    description: z
        .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        })
        .min(1, { message: "Description must be at least 1 character" })
        .max(500, { message: "Description must be at most 500 characters" }),
}).omit({ id: true, created_at: true });
