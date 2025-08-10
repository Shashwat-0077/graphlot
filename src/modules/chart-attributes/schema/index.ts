import { v4 as uuid } from "uuid";
import {
    sqliteTable,
    text,
    real,
    unique,
    integer,
    // check,
} from "drizzle-orm/sqlite-core";

import { Collections } from "@/db/schema";
import {
    AnchorType,
    ChartType,
    DatabaseType,
    FontStyleType,
    FontType,
    GridOrientation,
    GridStyle,
    RGBAColor,
    TooltipStyle,
} from "@/constants";
import {
    defaultChartBoxModel,
    defaultChartColors,
    defaultChartTypographySettings,
    defaultChartVisualSettings,
} from "@/modules/chart-attributes/default-config";
// import { sql } from "drizzle-orm";

export const CHART_METADATA_TABLE_NAME = "chart_metadata";
export const ChartMetadata = sqliteTable(
    CHART_METADATA_TABLE_NAME,
    {
        chartId: text("chart_id")
            .primaryKey()
            .$defaultFn(() => uuid()),
        collectionId: text("collection_id")
            .notNull()
            .references(() => Collections.collectionId, {
                onDelete: "cascade",
            }),
        name: text("name").notNull(),
        description: text("description").notNull(),
        databaseProvider: text("database_provider")
            .notNull()
            .$type<DatabaseType>(),
        databaseId: text("database_id").notNull(),
        databaseName: text("database_name").notNull(),
        type: text("type").notNull().$type<ChartType>(),
        createdAt: real("created_at")
            .notNull()
            .$defaultFn(() => Date.now()),
        updatedAt: real("updated_at")
            .notNull()
            .$defaultFn(() => Date.now()),
    },
    (table) => [
        unique("uq_charts_collection_name").on(table.collectionId, table.name),
    ]
);

export const CHART_VISUAL_TABLE_NAME = "chart_visual";
export const ChartVisual = sqliteTable(CHART_VISUAL_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),
    gridOrientation: text("grid_orientation")
        .notNull()
        .$type<GridOrientation>()
        .default(defaultChartVisualSettings.gridOrientation),
    gridStyle: text("grid_type")
        .notNull()
        .$type<GridStyle>()
        .default(defaultChartVisualSettings.gridStyle),
    gridWidth: real("grid_width")
        .notNull()
        .default(defaultChartVisualSettings.gridWidth),
    tooltipEnabled: integer("tooltip_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultChartVisualSettings.tooltipEnabled),
    tooltipStyle: text("tooltip_style")
        .notNull()
        .$type<TooltipStyle>()
        .default(defaultChartVisualSettings.tooltipStyle),
    tooltipBorderWidth: real("tooltip_border_width")
        .notNull()
        .default(defaultChartVisualSettings.tooltipBorderWidth),
    tooltipBorderRadius: real("tooltip_border_radius")
        .notNull()
        .default(defaultChartVisualSettings.tooltipBorderRadius),
    tooltipTotalEnabled: integer("tooltip_total_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultChartVisualSettings.tooltipTotalEnabled),
    tooltipSeparatorEnabled: integer("tooltip_separator_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultChartVisualSettings.tooltipSeparatorEnabled),
});

export const CHART_TYPOGRAPHY_TABLE_NAME = "chart_typography";
export const ChartTypography = sqliteTable(CHART_TYPOGRAPHY_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),
    label: text("label")
        .notNull()
        .default(defaultChartTypographySettings.label),
    labelEnabled: integer("label_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultChartTypographySettings.labelEnabled),
    labelSize: real("label_size")
        .notNull()
        .default(defaultChartTypographySettings.labelSize),
    labelFontFamily: text("label_font_family")
        .notNull()
        .$type<FontType>()
        .default(defaultChartTypographySettings.labelFontFamily),
    labelFontStyle: text("label_font_style")
        .notNull()
        .$type<FontStyleType>()
        .default(defaultChartTypographySettings.labelFontStyle),
    labelAnchor: text("label_anchor")
        .notNull()
        .$type<AnchorType>()
        .default(defaultChartTypographySettings.labelAnchor),
    legendEnabled: integer("legend_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultChartTypographySettings.legendEnabled),
});

export const CHART_BOX_MODEL_TABLE_NAME = "chart_box_model";
export const ChartBoxModel = sqliteTable(CHART_BOX_MODEL_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),
    marginTop: real("margin_top")
        .notNull()
        .default(defaultChartBoxModel.marginTop),
    marginBottom: real("margin_bottom")
        .notNull()
        .default(defaultChartBoxModel.marginBottom),
    marginLeft: real("margin_left")
        .notNull()
        .default(defaultChartBoxModel.marginLeft),
    marginRight: real("margin_right")
        .notNull()
        .default(defaultChartBoxModel.marginRight),
    borderWidth: real("border_width")
        .notNull()
        .default(defaultChartBoxModel.borderWidth),
});

export const CHART_COLOR_TABLE_NAME = "chart_colors";
export const ChartColors = sqliteTable(CHART_COLOR_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),
    backgroundColor: text("background_color", { mode: "json" })
        .notNull()
        .default(defaultChartColors.backgroundColor)
        .$type<RGBAColor>(),
    colorPalette: text("color_palette", { mode: "json" })
        .notNull()
        .default(defaultChartColors.colorPalette)
        .$type<RGBAColor[]>(),
    borderColor: text("border_color", { mode: "json" })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.borderColor),
    gridColor: text("grid_color", { mode: "json" })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.gridColor),
    tooltipBackgroundColor: text("tooltip_background_color", {
        mode: "json",
    })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.tooltipBackgroundColor),
    tooltipTextColor: text("tooltip_text_color", { mode: "json" })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.tooltipTextColor),
    tooltipSeparatorColor: text("tooltip_separator_color", {
        mode: "json",
    })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.tooltipSeparatorColor),
    tooltipBorderColor: text("tooltip_border_color", { mode: "json" })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.tooltipBorderColor),
    labelColor: text("label_color", { mode: "json" })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.labelColor),
    legendTextColor: text("legend_text_color", { mode: "json" })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.legendTextColor),
});
