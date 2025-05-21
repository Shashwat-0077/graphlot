import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { LAYOUT_OPTIONS } from "@/constants";
import { ChartGroup } from "@/db/schema";

// Create base schemas from the Drizzle table
const baseInsertSchema = createInsertSchema(ChartGroup);
const baseSelectSchema = createSelectSchema(ChartGroup);
const baseUpdateSchema = createUpdateSchema(ChartGroup);

export const ChartGroupSchema = {
    Insert: baseInsertSchema
        .extend({
            layoutType: z.enum(LAYOUT_OPTIONS),
        })
        .omit({
            groupId: true,
            chartCount: true,
            createdAt: true,
            updatedAt: true,
        }),
    Select: baseSelectSchema.extend({
        layoutType: z.enum(LAYOUT_OPTIONS),
    }),
    Update: baseUpdateSchema
        .extend({
            layoutType: z.enum(LAYOUT_OPTIONS).optional(),
        })
        .omit({
            groupId: true,
            createdAt: true,
            updatedAt: true,
            collectionId: true,
            chartCount: true,
        }),
};

// Types for the schemas
export type ChartGroupInsert = z.infer<typeof ChartGroupSchema.Insert>;
export type ChartGroupSelect = z.infer<typeof ChartGroupSchema.Select>;
export type ChartGroupUpdate = z.infer<typeof ChartGroupSchema.Update>;
