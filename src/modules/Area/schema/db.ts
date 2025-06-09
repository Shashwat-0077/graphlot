import {
    // check,
    integer,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
// import { sql } from "drizzle-orm";

import {
    defaultAreaChartConfig,
    AreaSpecificConfig,
    areaSpecificConfigDefaults,
} from "@/modules/Area/area-chart-default-config";
import {
    // AREA_CHART_STYLE_OPTIONS,
    ChartFilter,
    // SORT_OPTIONS,
    SortType,
    // MIN_STROKE_WIDTH,
    // MAX_STROKE_WIDTH,
    // MIN_OPACITY,
    // MAX_OPACITY,
} from "@/constants";
import { ChartMetadata } from "@/modules/Chart/schema/db";

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

        //NOTE :  we are doing this because, the data above will be updated separately, if we include all above in this, then we have update the whole string
        specificConfig: text("specific_config", { mode: "json" })
            .notNull()
            .$type<AreaSpecificConfig>()
            .default(areaSpecificConfigDefaults),
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
