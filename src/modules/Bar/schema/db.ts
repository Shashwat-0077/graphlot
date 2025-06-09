import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { ChartMetadata } from "@/modules/Chart/schema/db";
import { ChartFilter, SortType } from "@/constants";
import {
    BarSpecificConfig,
    barSpecificConfigDefaults,
    defaultBarChartConfig,
} from "@/modules/Bar/bar-chart-default-config";

export const BAR_CHARTS_TABLE_NAME = "bar_chart";
export const BarCharts = sqliteTable(BAR_CHARTS_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),
    xAxisField: text("x_axis_field")
        .notNull()
        .default(defaultBarChartConfig.xAxisField),
    yAxisField: text("y_axis_field")
        .notNull()
        .default(defaultBarChartConfig.yAxisField),
    xAxisSortOrder: text("x_sort_order")
        .notNull()
        .default(defaultBarChartConfig.xAxisSortOrder)
        .$type<SortType>(),
    yAxisSortOrder: text("y_sort_order")
        .notNull()
        .default(defaultBarChartConfig.yAxisSortOrder)
        .$type<SortType>(),
    omitZeroValuesEnabled: integer("omit_zero_values_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultBarChartConfig.omitZeroValuesEnabled),
    cumulativeEnabled: integer("cumulative_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultBarChartConfig.cumulativeEnabled),
    filters: text("filters", { mode: "json" })
        .notNull()
        .default(defaultBarChartConfig.filters)
        .$type<ChartFilter[]>(),
    //NOTE :  we are doing this because, the data above will be updated separately, if we include all above in this, then we have update the whole string
    specificConfig: text("specific_config", { mode: "json" })
        .notNull()
        .$type<BarSpecificConfig>()
        .default(barSpecificConfigDefaults),

    // TODO : add custom shapes, refer : https://recharts.org/en-US/examples/CustomShapeBarChart
});
