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
    Insert: baseInsertSchema.omit({
        collectionId: true,
        chartCount: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
    }),
    Select: baseSelectSchema,
    Update: baseUpdateSchema.omit({
        collectionId: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        chartCount: true,
    }),
};

// Types for the schemas
export type CollectionInsert = z.infer<typeof CollectionSchema.Insert>;
export type CollectionSelect = z.infer<typeof CollectionSchema.Select>;
export type CollectionUpdate = z.infer<typeof CollectionSchema.Update>;
