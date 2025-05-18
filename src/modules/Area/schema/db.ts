import {
    check,
    integer,
    real,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

import defaultAreaChartConfig from "@/modules/Area/area-chart-default-config";
import {
    AREA_CHART_TYPES_OPTIONS,
    AreaChartType,
    MAX_BORDER_WIDTH,
    MIN_BORDER_WIDTH,
    ChartFilter,
    GRID_ORIENTATION_OPTIONS,
    GridOrientation,
    RGBAColor,
    SORT_OPTIONS,
    SortType,
    MIN_STROKE_WIDTH,
    MAX_STROKE_WIDTH,
    MIN_OPACITY,
    MAX_OPACITY,
    GridType,
    GRID_TYPE_OPTIONS,
    AnchorType,
    MIN_TEXT_SIZE,
    MAX_TEXT_SIZE,
    ANCHOR_OPTIONS,
    FontStyleType,
    FONT_STYLES_OPTIONS,
} from "@/constants";
import { Charts } from "@/db/schema";

export const AreaCharts = sqliteTable(
    "area_charts",
    {
        chart_id: text("chart_id")
            .primaryKey()
            .references(() => Charts.chart_id, { onDelete: "cascade" }),
        background_color: text("background_color", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.background_color)
            .$type<RGBAColor>(),
        text_color: text("text_color", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.text_color)
            .$type<RGBAColor>(),
        tooltip_enabled: integer("tooltip_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.tooltip_enabled),
        label: text("label").notNull().default(defaultAreaChartConfig.label),
        label_enabled: integer("label_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.label_enabled),
        label_size: real("label_size") // Fixed: Changed from "text_size" to "label_size"
            .notNull()
            .default(defaultAreaChartConfig.label_size),
        label_anchor: text("label_anchor")
            .notNull()
            .default(defaultAreaChartConfig.label_anchor)
            .$type<AnchorType>(),
        label_color: text("label_color", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.label_color)
            .$type<RGBAColor>(),
        label_font_family: text("label_font_family") // Fixed: Changed from "label_font" to "label_font_family"
            .notNull()
            .default(defaultAreaChartConfig.label_font_family),
        label_font_style: text("label_font_style") // Fixed: Changed from "label_font_weight" to "label_font_style"
            .notNull()
            .default(defaultAreaChartConfig.label_font_style)
            .$type<FontStyleType>(),
        legend_enabled: integer("legend_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.legend_enabled),
        border_enabled: integer("border_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.border_enabled),
        color_palette: text("color_palette", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.color_palette)
            .$type<RGBAColor[]>(),
        x_axis_field: text("x_axis_field")
            .notNull()
            .default(defaultAreaChartConfig.x_axis_field),
        y_axis_field: text("y_axis_field")
            .notNull()
            .default(defaultAreaChartConfig.y_axis_field),
        x_sort_order: text("x_sort_order")
            .notNull()
            .default(defaultAreaChartConfig.x_sort_order)
            .$type<SortType>(),
        y_sort_order: text("y_sort_order")
            .notNull()
            .default(defaultAreaChartConfig.y_sort_order)
            .$type<SortType>(),
        omit_zero_values_enabled: integer("omit_zero_values_enabled", {
            mode: "boolean",
        })
            .notNull()
            .default(defaultAreaChartConfig.omit_zero_values_enabled),
        cumulative_enabled: integer("cumulative_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.cumulative_enabled),
        filters: text("filters", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.filters)
            .$type<ChartFilter[]>(),
        grid_color: text("grid_color", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.grid_color)
            .$type<RGBAColor>(),
        grid_orientation: text("grid_orientation")
            .notNull()
            .default(defaultAreaChartConfig.grid_orientation)
            .$type<GridOrientation>(),
        grid_type: text("grid_type")
            .notNull()
            .default(defaultAreaChartConfig.grid_type)
            .$type<GridType>(),
        grid_width: real("grid_width")
            .notNull()
            .default(defaultAreaChartConfig.grid_width),
        y_axis_enabled: integer("y_axis_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.y_axis_enabled),
        x_axis_enabled: integer("x_axis_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.x_axis_enabled),
        stacked_enabled: integer("stacked_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.stacked_enabled),
        area_style: text("area_style")
            .notNull()
            .default(defaultAreaChartConfig.area_style)
            .$type<AreaChartType>(),
        stroke_width: real("stroke_width")
            .notNull()
            .default(defaultAreaChartConfig.stroke_width),
        fill_opacity: real("fill_opacity")
            .notNull()
            .default(defaultAreaChartConfig.fill_opacity),
        is_area_chart: integer("is_area_chart", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.is_area_chart),
        margin_top: real("margin_top")
            .notNull()
            .default(defaultAreaChartConfig.margin_top),
        margin_bottom: real("margin_bottom")
            .notNull()
            .default(defaultAreaChartConfig.margin_bottom),
        margin_left: real("margin_left")
            .notNull()
            .default(defaultAreaChartConfig.margin_left),
        margin_right: real("margin_right")
            .notNull()
            .default(defaultAreaChartConfig.margin_right),
    },
    (table) => {
        const gridTypeString = GRID_TYPE_OPTIONS.map((v) => `'${v}'`).join(
            ", "
        );
        const gridOrientationString = GRID_ORIENTATION_OPTIONS.map(
            (v) => `'${v}'`
        ).join(", ");
        const areaChartTypesString = AREA_CHART_TYPES_OPTIONS.map(
            (v) => `'${v}'`
        ).join(", ");
        const sortOrderValuesString = SORT_OPTIONS.map((v) => `'${v}'`).join(
            ", "
        );
        const labelAnchorString = ANCHOR_OPTIONS.map((v) => `'${v}'`).join(
            ", "
        );
        const fontStyleString = FONT_STYLES_OPTIONS.map((v) => `'${v}'`).join(
            ", "
        );

        return [
            check(
                "area_charts_grid_orientation_check",
                sql`(${table.grid_orientation} IN (${sql.raw(gridOrientationString)}))`
            ),
            check(
                "area_charts_grid_type_check",
                sql`(${table.grid_type} IN (${sql.raw(gridTypeString)}))`
            ),
            check(
                "area_charts_label_anchor_check",
                sql`(${table.label_anchor} IN (${sql.raw(labelAnchorString)}))`
            ),
            check(
                "area_charts_label_font_style_check",
                sql`(${table.label_font_style} IN (${sql.raw(fontStyleString)}))`
            ),
            check(
                "area_charts_area_style_check",
                sql`(${table.area_style} IN (${sql.raw(areaChartTypesString)}))`
            ),
            check(
                "area_charts_x_sort_order_check",
                sql`(${table.x_sort_order} IN (${sql.raw(sortOrderValuesString)}))`
            ),
            check(
                "area_charts_y_sort_order_check",
                sql`(${table.y_sort_order} IN (${sql.raw(sortOrderValuesString)}))`
            ),
            check(
                "area_charts_grid_width_check",
                sql`${table.grid_width} >= ${MIN_BORDER_WIDTH} AND ${table.grid_width} <= ${MAX_BORDER_WIDTH}`
            ),
            check(
                "area_charts_stroke_width_check",
                sql`${table.stroke_width} >= ${MIN_STROKE_WIDTH} AND ${table.stroke_width} <= ${MAX_STROKE_WIDTH}`
            ),
            check(
                "area_charts_fill_opacity_check",
                sql`${table.fill_opacity} >= ${MIN_OPACITY} AND ${table.fill_opacity} <= ${MAX_OPACITY}`
            ),
            check(
                "area_charts_label_size_check",
                sql`${table.label_size} >= ${MIN_TEXT_SIZE} AND ${table.label_size} <= ${MAX_TEXT_SIZE}`
            ),
        ];
    }
);
