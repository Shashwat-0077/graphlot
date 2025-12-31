// import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
    defaultRadialChartConfig,
    RadialSpecificConfig,
    radialSpecificConfigDefaults,
} from "@/modules/chart-types/radial/default-radial-config";
import { SortType } from "@/constants";
import { ChartMetadata } from "@/modules/chart-attributes/schema";

export const RADIAL_CHARTS_TABLE_NAME = "radial_chart";
export const RadialCharts = sqliteTable(RADIAL_CHARTS_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),

    xAxisField: text("x_axis_field")
        .notNull()
        .default(defaultRadialChartConfig.xAxisField),
    xAxisSortOrder: text("x_sort_order")
        .notNull()
        .$type<SortType>()
        .default(defaultRadialChartConfig.xAxisSortOrder),
    yAxisField: text("y_axis_field")
        .notNull()
        .default(defaultRadialChartConfig.yAxisField), // Assuming yAxisField is same as xAxisField for radial charts
    yAxisSortOrder: text("y_sort_order")
        .notNull()
        .$type<SortType>()
        .default(defaultRadialChartConfig.yAxisSortOrder), // Assuming yAxisSortOrder is same as xAxisSortOrder for radial charts

    omitZeroValuesEnabled: integer("omit_zero_values_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultRadialChartConfig.omitZeroValuesEnabled),
    //NOTE :  we are doing this because, the data above will be updated separately, if we include all above in this, then we have update the whole string
    specificConfig: text("specific_config", { mode: "json" })
        .notNull()
        .$type<RadialSpecificConfig>()
        .default(radialSpecificConfigDefaults),
});

export const RadialChartsInsert = RadialCharts.$inferInsert;
export const RadialChartsSelect = RadialCharts.$inferSelect;
