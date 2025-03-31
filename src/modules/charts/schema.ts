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
    Collections,
    DonutCharts,
    HeatmapCharts,
    HeatmapData,
    RadarCharts,
} from "@/db/schema";
import {
    AREA,
    BAR,
    DONUT,
    RADAR,
    HEATMAP,
    CHART_TYPES,
    ChartType,
} from "@/modules/charts/constants";

// Color validation schema
export const RgbaColorSchema = z
    .string()
    .regex(
        /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01](?:\.\d+)?)\s*\)$/,
        {
            message:
                "Invalid RGBA color format. Expected format: rgba(r, g, b, a)",
        }
    )
    .refine(
        (value) => {
            const matches = value.match(
                /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01](?:\.\d+)?)\s*\)/
            );
            if (!matches) {
                return false;
            }

            const [, r, g, b, a] = matches;
            const redValid = parseInt(r) >= 0 && parseInt(r) <= 255;
            const greenValid = parseInt(g) >= 0 && parseInt(g) <= 255;
            const blueValid = parseInt(b) >= 0 && parseInt(b) <= 255;
            const alphaValid = parseFloat(a) >= 0 && parseFloat(a) <= 1;

            return redValid && greenValid && blueValid && alphaValid;
        },
        {
            message:
                "RGB values must be between 0-255, and alpha must be between 0-1",
        }
    );

// Color array schema for multi-color properties
export const ColorsArraySchema = z.array(RgbaColorSchema).or(
    z.string().transform((val, ctx) => {
        try {
            const parsed = JSON.parse(val);
            if (!Array.isArray(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Color must be a valid JSON array of RGBA colors",
                });
                return z.NEVER;
            }
            return parsed;
            // eslint-disable-next-line
        } catch (e) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Color must be a valid JSON array of RGBA colors",
            });
            return z.NEVER;
        }
    })
);

export type RgbaColor = z.infer<typeof RgbaColorSchema>;
export type ColorsArray = z.infer<typeof ColorsArraySchema>;

const requiredStringSchema = (field: string, maxLength: number = 255) =>
    z
        .string({
            required_error: `${field} is required`,
            invalid_type_error: `${field} must be a string`,
        })
        .min(1, { message: `${field} is required` })
        .max(maxLength, {
            message: `${field} must be at most ${maxLength} characters`,
        });

const optionalStringSchema = (field: string, maxLength: number = 255) =>
    z
        .string({
            invalid_type_error: `${field} must be a string`,
        })
        .max(maxLength, {
            message: `${field} must be at most ${maxLength} characters`,
        })
        .optional();

export const ChartsTypesSchema = z
    .string({
        required_error: "Type is required",
        invalid_type_error: "Type must be a string",
    })
    .min(1, { message: "Type is required" })
    .max(20, { message: "Type must be at most 20 characters" })
    .refine(
        (value): value is ChartType => CHART_TYPES.includes(value as ChartType),
        {
            message: `Type must be one of ${CHART_TYPES.join(", ")}`,
        }
    );

// Collection Schema
export const CollectionSchema = {
    Insert: createInsertSchema(Collections, {
        user_id: requiredStringSchema("User ID"),
        name: requiredStringSchema("Name", 100),
        description: requiredStringSchema("Description", 500),
    }).omit({ collection_id: true, created_at: true, chart_count: true }),
    Select: createSelectSchema(Collections),
    Update: createUpdateSchema(Collections, {
        name: optionalStringSchema("Name", 100),
        description: optionalStringSchema("Description", 500),
    }).omit({
        collection_id: true,
        created_at: true,
        user_id: true,
        chart_count: true,
    }),
};

// Basic Chart Schema
export const BasicChartSchema = {
    Insert: createInsertSchema(Charts, {
        collection_id: requiredStringSchema("Collection ID"),
        name: requiredStringSchema("Name", 100),
        description: requiredStringSchema("Description", 500),
        notion_database_name: requiredStringSchema("Notion Database Name", 255),
        notion_database_id: requiredStringSchema("Notion Database ID", 255),
        type: ChartsTypesSchema,
    }).omit({ chart_id: true, created_at: true }),
    Select: createSelectSchema(Charts),
    Update: createUpdateSchema(Charts, {
        name: optionalStringSchema("Name", 100),
        description: optionalStringSchema("Description", 500),
    }).omit({
        chart_id: true,
        created_at: true,
        type: true,
        collection_id: true,
        notion_database_name: true,
        notion_database_id: true,
    }),
};

// Area Chart Schema
export const AreaChartSchema = {
    Insert: createInsertSchema(AreaCharts, {
        chart_id: requiredStringSchema("Chart ID"),
        x_axis: optionalStringSchema("X Axis"),
        y_axis: optionalStringSchema("Y Axis"),
        group_by: optionalStringSchema("Group By"),
        sort_by: optionalStringSchema("Sort By"),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        grid_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Grid Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        show_grid: z.number().optional(),
        border: z.number().optional(),
        omitZeroValues: z.number().optional(),
        cumulative: z.number().optional(),
        filters: z.string().optional(),
        colors: ColorsArraySchema.optional().describe(
            "Color (array of RGBA colors)"
        ),
    })
        .omit({ area_id: true })
        .extend({
            type: z.literal(AREA),
        }),
    Select: createSelectSchema(AreaCharts).extend({
        type: z.literal(AREA),
    }),
    Update: createUpdateSchema(AreaCharts, {
        x_axis: optionalStringSchema("X Axis"),
        y_axis: optionalStringSchema("Y Axis"),
        group_by: optionalStringSchema("Group By"),
        sort_by: optionalStringSchema("Sort By"),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        grid_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Grid Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        show_grid: z.number().optional(),
        border: z.number().optional(),
        omitZeroValues: z.number().optional(),
        cumulative: z.number().optional(),
        filters: z.string().optional(),
        color: ColorsArraySchema.optional().describe(
            "Color (array of RGBA colors)"
        ),
    })
        .omit({ area_id: true, chart_id: true })
        .extend({
            type: z.literal(AREA),
        }),
};

// Bar Chart Schema
export const BarChartSchema = {
    Insert: createInsertSchema(BarCharts, {
        chart_id: requiredStringSchema("Chart ID"),
        x_axis: optionalStringSchema("X Axis"),
        y_axis: optionalStringSchema("Y Axis"),
        group_by: optionalStringSchema("Group By"),
        sort_by: optionalStringSchema("Sort By"),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        grid_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Grid Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        show_grid: z.number().optional(),
        border: z.number().optional(),
        omitZeroValues: z.number().optional(),
        cumulative: z.number().optional(),
        filters: z.string().optional(),
        colors: ColorsArraySchema.optional().describe(
            "Color (array of RGBA colors)"
        ),
        barSize: z.number().optional(),
        barGap: z.number().optional(),
    })
        .omit({ bar_id: true })
        .extend({
            type: z.literal(BAR),
        }),
    Select: createSelectSchema(BarCharts).extend({
        type: z.literal(BAR),
    }),
    Update: createUpdateSchema(BarCharts, {
        x_axis: optionalStringSchema("X Axis"),
        y_axis: optionalStringSchema("Y Axis"),
        group_by: optionalStringSchema("Group By"),
        sort_by: optionalStringSchema("Sort By"),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        grid_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Grid Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        show_grid: z.number().optional(),
        border: z.number().optional(),
        omitZeroValues: z.number().optional(),
        cumulative: z.number().optional(),
        filters: z.string().optional(),
        colors: ColorsArraySchema.optional().describe(
            "Color (array of RGBA colors)"
        ),
        barSize: z.number().optional(),
        barGap: z.number().optional(),
    })
        .omit({ bar_id: true, chart_id: true })
        .extend({
            type: z.literal(BAR),
        }),
};

// Donut Chart Schema
export const DonutChartSchema = {
    Insert: createInsertSchema(DonutCharts, {
        chart_id: requiredStringSchema("Chart ID"),
        x_axis: requiredStringSchema("X Axis"),
        sort_by: requiredStringSchema("Sort By"),
        omitZeroValues: z.number().optional(),
        filters: z.string().optional(),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        border: z.number().optional(),
        colors: ColorsArraySchema.optional().describe(
            "Color (array of RGBA colors)"
        ),
    })
        .omit({ donut_id: true })
        .extend({
            type: z.literal(DONUT),
        }),
    Select: createSelectSchema(DonutCharts).extend({
        type: z.literal(DONUT),
    }),
    Update: createUpdateSchema(DonutCharts, {
        x_axis: optionalStringSchema("X Axis"),
        sort_by: optionalStringSchema("Sort By"),
        omitZeroValues: z.number().optional(),
        filters: z.string().optional(),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        border: z.number().optional(),
        colors: ColorsArraySchema.optional().describe(
            "Color (array of RGBA colors)"
        ),
    })
        .omit({ donut_id: true, chart_id: true })
        .extend({
            type: z.literal(DONUT),
        }),
};

// Heatmap Chart Schema
export const HeatmapChartSchema = {
    Insert: createInsertSchema(HeatmapCharts, {
        chart_id: requiredStringSchema("Chart ID"),
        metric: requiredStringSchema("Metric"),
        streak: z.number().optional(),
        longest_streak: z.number().optional(),
        sum_of_all_entries: z.number().optional(),
        average_of_all_entries: z.number().optional(),
        number_of_entries: z.number().optional(),
        toggle_button_hover: z.number().optional(),
        default_box_color: ColorsArraySchema.optional().describe(
            "Default Box Color (array of RGBA colors)"
        ),
        accent: ColorsArraySchema.optional().describe(
            "Accent Color (array of RGBA colors)"
        ),
        icon_colors: ColorsArraySchema.optional().describe(
            "Icon Colors (array of RGBA colors)"
        ),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        border: z.number().optional(),
    })
        .omit({ heatmap_id: true })
        .extend({
            type: z.literal(HEATMAP),
        }),
    Select: createSelectSchema(HeatmapCharts).extend({
        type: z.literal(HEATMAP),
    }),
    Update: createUpdateSchema(HeatmapCharts, {
        metric: optionalStringSchema("Metric"),
        streak: z.number().optional(),
        longest_streak: z.number().optional(),
        sum_of_all_entries: z.number().optional(),
        average_of_all_entries: z.number().optional(),
        number_of_entries: z.number().optional(),
        toggle_button_hover: z.number().optional(),
        default_box_color: ColorsArraySchema.optional().describe(
            "Default Box Color (array of RGBA colors)"
        ),
        accent: ColorsArraySchema.optional().describe(
            "Accent Color (array of RGBA colors)"
        ),
        icon_colors: ColorsArraySchema.optional().describe(
            "Icon Colors (array of RGBA colors)"
        ),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        border: z.number().optional(),
    })
        .omit({ heatmap_id: true, chart_id: true })
        .extend({
            type: z.literal(HEATMAP),
        }),
};

// Radar Chart Schema
export const RadarChartSchema = {
    Insert: createInsertSchema(RadarCharts, {
        chart_id: requiredStringSchema("Chart ID"),
        x_axis: optionalStringSchema("X Axis"),
        y_axis: optionalStringSchema("Y Axis"),
        group_by: optionalStringSchema("Group By"),
        sort_by: optionalStringSchema("Sort By"),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        grid_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Grid Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        show_grid: z.number().optional(),
        border: z.number().optional(),
        omitZeroValues: z.number().optional(),
        cumulative: z.number().optional(),
        filters: z.string().optional(),
        colors: ColorsArraySchema.optional().describe(
            "Color (array of RGBA colors)"
        ),
    })
        .omit({ radar_id: true })
        .extend({
            type: z.literal(RADAR),
        }),
    Select: createSelectSchema(RadarCharts).extend({
        type: z.literal(RADAR),
    }),
    Update: createUpdateSchema(RadarCharts, {
        x_axis: optionalStringSchema("X Axis"),
        y_axis: optionalStringSchema("Y Axis"),
        group_by: optionalStringSchema("Group By"),
        sort_by: optionalStringSchema("Sort By"),
        background_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Background Color (RGBA)"),
        text_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Text Color (RGBA)"),
        grid_color: RgbaColorSchema.or(z.string())
            .optional()
            .describe("Grid Color (RGBA)"),
        show_tooltip: z.number().optional(),
        show_legend: z.number().optional(),
        show_grid: z.number().optional(),
        border: z.number().optional(),
        omitZeroValues: z.number().optional(),
        cumulative: z.number().optional(),
        filters: z.string().optional(),
        colors: ColorsArraySchema.optional().describe(
            "Color (array of RGBA colors)"
        ),
    })
        .omit({ radar_id: true, chart_id: true })
        .extend({
            type: z.literal(RADAR),
        }),
};

// Heatmap Data Schema
export const HeatmapDataSchema = {
    Insert: createInsertSchema(HeatmapData, {
        heatmap_id: requiredStringSchema("Heatmap ID"),
        date: requiredStringSchema("Date"),
        count: z.number().int().nonnegative(),
    }).omit({ heatmap_data_id: true }),
    Select: createSelectSchema(HeatmapData),
    Update: createUpdateSchema(HeatmapData, {
        heatmap_id: optionalStringSchema("Heatmap ID"),
        date: optionalStringSchema("Date"),
        count: z.number().int().nonnegative().optional(),
    }).omit({ heatmap_data_id: true }),
};

export const FullChartInsertSchema = z.discriminatedUnion(
    "type",
    [
        AreaChartSchema.Insert,
        BarChartSchema.Insert,
        DonutChartSchema.Insert,
        HeatmapChartSchema.Insert,
        RadarChartSchema.Insert,
    ],
    {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_union) {
                return {
                    message: `Chart type is required. Must be one of: ${CHART_TYPES.join(", ")}`,
                };
            }
            if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
                return {
                    message: `Invalid chart type. Must be one of: ${CHART_TYPES.join(", ")}`,
                };
            }
            return { message: ctx.defaultError };
        },
    }
);

export const FullChartSelectSchema = z.discriminatedUnion(
    "type",
    [
        AreaChartSchema.Select,
        BarChartSchema.Select,
        DonutChartSchema.Select,
        HeatmapChartSchema.Select,
        RadarChartSchema.Select,
    ],
    {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_union) {
                return {
                    message: `Chart type is required. Must be one of: ${CHART_TYPES.join(", ")}`,
                };
            }
            if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
                return {
                    message: `Invalid chart type. Must be one of: ${CHART_TYPES.join(", ")}`,
                };
            }
            return { message: ctx.defaultError };
        },
    }
);

export const FullChartUpdateSchema = z.discriminatedUnion(
    "type",
    [
        AreaChartSchema.Update,
        BarChartSchema.Update,
        DonutChartSchema.Update,
        HeatmapChartSchema.Update,
        RadarChartSchema.Update,
    ],
    {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_union) {
                return {
                    message: `Chart type is required. Must be one of: ${CHART_TYPES.join(", ")}`,
                };
            }
            if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
                return {
                    message: `Invalid chart type. Must be one of: ${CHART_TYPES.join(", ")}`,
                };
            }
            return { message: ctx.defaultError };
        },
    }
);
