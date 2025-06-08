import {
    // check,
    integer,
    real,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
// import { sql } from "drizzle-orm";

import { defaultAreaChartConfig } from "@/modules/Area/area-chart-default-config";
import {
    // AREA_CHART_STYLE_OPTIONS,
    AreaChartStyle,
    ChartFilter,
    // SORT_OPTIONS,
    SortType,
    // MIN_STROKE_WIDTH,
    // MAX_STROKE_WIDTH,
    // MIN_OPACITY,
    // MAX_OPACITY,
} from "@/constants";
import { ChartMetadata } from "@/modules/ChartMetaData/schema/db";

export const AREA_CHARTS_TABLE_NAME = "area_chart";
export const AreaCharts = sqliteTable(
    AREA_CHARTS_TABLE_NAME,
    {
        chartId: text("chart_id")
            .primaryKey()
            .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),
        xAxisField: text("x_axis_field")
            .notNull()
            .default(defaultAreaChartConfig.xAxisField),
        yAxisField: text("y_axis_field")
            .notNull()
            .default(defaultAreaChartConfig.yAxisField),
        xAxisSortOrder: text("x_sort_order")
            .notNull()
            .default(defaultAreaChartConfig.xAxisSortOrder)
            .$type<SortType>(),
        yAxisSortOrder: text("y_sort_order")
            .notNull()
            .default(defaultAreaChartConfig.yAxisSortOrder)
            .$type<SortType>(),
        omitZeroValuesEnabled: integer("omit_zero_values_enabled", {
            mode: "boolean",
        })
            .notNull()
            .default(defaultAreaChartConfig.omitZeroValuesEnabled),
        cumulativeEnabled: integer("cumulative_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.cumulativeEnabled),
        filters: text("filters", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.filters)
            .$type<ChartFilter[]>(),
        yAxisEnabled: integer("y_axis_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.yAxisEnabled),
        xAxisEnabled: integer("x_axis_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.xAxisEnabled),
        stackedEnabled: integer("stacked_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.stackedEnabled),
        areaStyle: text("area_style")
            .notNull()
            .default(defaultAreaChartConfig.areaStyle)
            .$type<AreaChartStyle>(),
        strokeWidth: real("stroke_width")
            .notNull()
            .default(defaultAreaChartConfig.strokeWidth),
        fillOpacity: real("fill_opacity")
            .notNull()
            .default(defaultAreaChartConfig.fillOpacity),
        isAreaChart: integer("is_area_chart", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.isAreaChart),
    }
    // (table) => {
    //     const areaChartTypesString = AREA_CHART_STYLE_OPTIONS.map(
    //         (v) => `'${v}'`
    //     ).join(", ");
    //     const sortOrderValuesString = SORT_OPTIONS.map((v) => `'${v}'`).join(
    //         ", "
    //     );

    //     return [
    //         check(
    //             "area_charts_area_style_check",
    //             sql`(${table.areaStyle} IN (${sql.raw(areaChartTypesString)}))`
    //         ),
    //         check(
    //             "area_charts_x_sort_order_check",
    //             sql`(${table.xAxisSortOrder} IN (${sql.raw(sortOrderValuesString)}))`
    //         ),
    //         check(
    //             "area_charts_y_sort_order_check",
    //             sql`(${table.yAxisSortOrder} IN (${sql.raw(sortOrderValuesString)}))`
    //         ),
    //         check(
    //             "area_charts_stroke_width_check",
    //             sql`${table.strokeWidth} >= ${MIN_STROKE_WIDTH} AND ${table.strokeWidth} <= ${MAX_STROKE_WIDTH}`
    //         ),
    //         check(
    //             "area_charts_fill_opacity_check",
    //             sql`${table.fillOpacity} >= ${MIN_OPACITY} AND ${table.fillOpacity} <= ${MAX_OPACITY}`
    //         ),
    //     ];
    // }
);
