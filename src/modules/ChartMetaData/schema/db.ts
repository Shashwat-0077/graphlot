import { v4 as uuid } from "uuid";
import {
    sqliteTable,
    text,
    real,
    unique,
    integer,
    check,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

import { Collections } from "@/modules/Collection/schema/db";
import {
    ANCHOR_OPTIONS,
    AnchorType,
    ChartType,
    FONT_STYLES_OPTIONS,
    FontStyleType,
    FontType,
    GRID_ORIENTATION_OPTIONS,
    GRID_STYLE_OPTIONS,
    GridOrientation,
    GridStyle,
    MAX_BORDER_WIDTH,
    MAX_TEXT_SIZE,
    MIN_BORDER_WIDTH,
    MIN_TEXT_SIZE,
    RGBAColor,
    TooltipStyle,
} from "@/constants";
import {
    defaultChartBoxModel,
    defaultChartTypographySettings,
    defaultChartVisualSettings,
    defaultChartColors,
} from "@/modules/ChartMetaData/defaultChartConfig";

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
        databaseProvider: text("database_provider").notNull(),
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
export const ChartVisual = sqliteTable(
    CHART_VISUAL_TABLE_NAME,
    {
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
    },
    (table) => {
        const orientList = GRID_ORIENTATION_OPTIONS.map((v) => `'${v}'`).join(
            ", "
        );
        const styleList = GRID_STYLE_OPTIONS.map((v) => `'${v}'`).join(", ");

        return [
            check(
                "chk_chart_grid_orientation",
                sql`(${table.gridOrientation} IN (${sql.raw(orientList)}))`
            ),
            check(
                "chk_chart_grid_type",
                sql`(${table.gridStyle} IN (${sql.raw(styleList)}))`
            ),
            check(
                "chk_chart_grid_width",
                sql`${table.gridWidth} >= ${MIN_BORDER_WIDTH} AND ${table.gridWidth} <= ${MAX_BORDER_WIDTH}`
            ),
        ];
    }
);

export const CHART_TYPOGRAPHY_TABLE_NAME = "chart_typography";
export const ChartTypography = sqliteTable(
    CHART_TYPOGRAPHY_TABLE_NAME,
    {
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
    },
    (table) => {
        const anchorList = ANCHOR_OPTIONS.map((v) => `'${v}'`).join(", ");
        const fontStyleList = FONT_STYLES_OPTIONS.map((v) => `'${v}'`).join(
            ", "
        );

        return [
            check(
                "chk_typography_anchor",
                sql`(${table.labelAnchor} IN (${sql.raw(anchorList)}))`
            ),
            check(
                "chk_typography_font_style",
                sql`(${table.labelFontStyle} IN (${sql.raw(fontStyleList)}))`
            ),
            check(
                "chk_typography_size",
                sql`${table.labelSize} >= ${MIN_TEXT_SIZE} AND ${table.labelSize} <= ${MAX_TEXT_SIZE}`
            ),
        ];
    }
);

export const CHART_BOX_MODEL_TABLE_NAME = "chart_box_model";
export const ChartBoxModel = sqliteTable(
    CHART_BOX_MODEL_TABLE_NAME,
    {
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
        borderEnabled: integer("border_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultChartBoxModel.borderEnabled),
    },
    (table) => [
        check(
            "chk_margin_nonnegative",
            sql`${table.marginTop} >= 0
        AND ${table.marginBottom} >= 0
        AND ${table.marginLeft} >= 0
        AND ${table.marginRight} >= 0`
        ),
        check(
            "chk_border_width",
            sql`${table.borderWidth} >= ${MIN_BORDER_WIDTH} AND ${table.borderWidth} <= ${MAX_BORDER_WIDTH}`
        ),
    ]
);

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
    labelColor: text("label_color", { mode: "json" })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.labelColor),
    legendTextColor: text("legend_text_color", { mode: "json" })
        .notNull()
        .$type<RGBAColor>()
        .default(defaultChartColors.legendTextColor),
});
