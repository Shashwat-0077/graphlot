import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import {
    ANCHOR_OPTIONS,
    CHART_TYPES,
    FONT_OPTIONS,
    FONT_STYLES_OPTIONS,
    GRID_ORIENTATION_OPTIONS,
    GRID_STYLE_OPTIONS,
    TOOLTIP_STYLE_OPTIONS,
} from "@/constants";
import {
    ChartMetadata,
    ChartVisual,
    ChartBoxModel,
    ChartTypography,
    ChartColors,
} from "@/modules/ChartMetaData/schema/db";

// === Chart Metadata ===
const chartInsertSchema = createInsertSchema(ChartMetadata);
const chartSelectSchema = createSelectSchema(ChartMetadata);
const chartUpdateSchema = createUpdateSchema(ChartMetadata);

export const ChartMetadataSchema = {
    Insert: chartInsertSchema
        .extend({
            type: z.enum(CHART_TYPES),
        })
        .omit({ chartId: true, createdAt: true, updatedAt: true }),

    Select: chartSelectSchema.extend({
        type: z.enum(CHART_TYPES),
    }),

    Update: chartUpdateSchema
        .extend({
            updatedAt: z.date(),
            type: z.enum(CHART_TYPES).optional(),
        })
        .omit({ chartId: true, createdAt: true }),
};

export type ChartMetadataInsert = z.infer<typeof ChartMetadataSchema.Insert>;
export type ChartMetadataSelect = z.infer<typeof ChartMetadataSchema.Select>;
export type ChartMetadataUpdate = z.infer<typeof ChartMetadataSchema.Update>;

// === Chart Visual Settings ===
const chartVisualInsertSchema = createInsertSchema(ChartVisual);
const chartVisualSelectSchema = createSelectSchema(ChartVisual);
const chartVisualUpdateSchema = createUpdateSchema(ChartVisual);

export const ChartVisualSchema = {
    Insert: chartVisualInsertSchema
        .extend({
            gridOrientation: z.enum(GRID_ORIENTATION_OPTIONS),
            gridStyle: z.enum(GRID_STYLE_OPTIONS),
            tooltipStyle: z.enum(TOOLTIP_STYLE_OPTIONS),
        })
        .omit({ chartId: true }),

    Select: chartVisualSelectSchema.extend({
        gridOrientation: z.enum(GRID_ORIENTATION_OPTIONS),
        gridStyle: z.enum(GRID_STYLE_OPTIONS),
        tooltipStyle: z.enum(TOOLTIP_STYLE_OPTIONS),
    }),

    Update: chartVisualUpdateSchema
        .extend({
            gridOrientation: z.enum(GRID_ORIENTATION_OPTIONS).optional(),
            gridStyle: z.enum(GRID_STYLE_OPTIONS).optional(),
            tooltipStyle: z.enum(TOOLTIP_STYLE_OPTIONS).optional(),
        })
        .omit({ chartId: true }),
};

export type ChartVisualInsert = z.infer<typeof ChartVisualSchema.Insert>;
export type ChartVisualSelect = z.infer<typeof ChartVisualSchema.Select>;
export type ChartVisualUpdate = z.infer<typeof ChartVisualSchema.Update>;

// === Chart Typography Settings === (Renamed from ChartTypography)
const chartTypographyInsertSchema = createInsertSchema(ChartTypography);
const chartTypographySelectSchema = createSelectSchema(ChartTypography);
const chartTypographyUpdateSchema = createUpdateSchema(ChartTypography);

export const ChartTypographySchema = {
    Insert: chartTypographyInsertSchema
        .extend({
            labelFontFamily: z.enum(FONT_OPTIONS),
            labelFontStyle: z.enum(FONT_STYLES_OPTIONS),
            labelAnchor: z.enum(ANCHOR_OPTIONS),
        })
        .omit({ chartId: true }),

    Select: chartTypographySelectSchema.extend({
        labelFontFamily: z.enum(FONT_OPTIONS),
        labelFontStyle: z.enum(FONT_STYLES_OPTIONS),
        labelAnchor: z.enum(ANCHOR_OPTIONS),
    }),

    Update: chartTypographyUpdateSchema
        .extend({
            labelFontFamily: z.enum(FONT_OPTIONS).optional(),
            labelFontStyle: z.enum(FONT_STYLES_OPTIONS).optional(),
            labelAnchor: z.enum(ANCHOR_OPTIONS).optional(),
        })
        .omit({ chartId: true }),
};

export type ChartTypographyInsert = z.infer<
    typeof ChartTypographySchema.Insert
>;
export type ChartTypographySelect = z.infer<
    typeof ChartTypographySchema.Select
>;
export type ChartTypographyUpdate = z.infer<
    typeof ChartTypographySchema.Update
>;

// === Chart Margin & Border Settings === (Renamed)
const chartBoxModelInsertSchema = createInsertSchema(ChartBoxModel);
const chartBoxModelSelectSchema = createSelectSchema(ChartBoxModel);
const chartBoxModelUpdateSchema = createUpdateSchema(ChartBoxModel);

export const ChartBoxModelSchema = {
    Insert: chartBoxModelInsertSchema.omit({ chartId: true }),
    Select: chartBoxModelSelectSchema,
    Update: chartBoxModelUpdateSchema.omit({ chartId: true }),
};

export type ChartBoxModelInsert = z.infer<typeof ChartBoxModelSchema.Insert>;
export type ChartBoxModelSelect = z.infer<typeof ChartBoxModelSchema.Select>;
export type ChartBoxModelUpdate = z.infer<typeof ChartBoxModelSchema.Update>;

// === Chart Color Settings ===
const chartColorInsertSchema = createInsertSchema(ChartColors);
const chartColorSelectSchema = createSelectSchema(ChartColors);
const chartColorUpdateSchema = createUpdateSchema(ChartColors);

export const ChartColorSchema = {
    Insert: chartColorInsertSchema.omit({ chartId: true }),
    Select: chartColorSelectSchema,
    Update: chartColorUpdateSchema.omit({ chartId: true }),
};

export type ChartColorInsert = z.infer<typeof ChartColorSchema.Insert>;
export type ChartColorSelect = z.infer<typeof ChartColorSchema.Select>;
export type ChartColorUpdate = z.infer<typeof ChartColorSchema.Update>;
