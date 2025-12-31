import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { SortType } from "@/constants";
import {
    defaultRadarChartConfig,
    RadarSpecificConfig,
    radarSpecificConfigDefaults,
} from "@/modules/chart-types/radar/default-radar-config";
import { ChartMetadata } from "@/modules/chart-attributes/schema";

export const RADAR_CHARTS_TABLE_NAME = "radar_chart";
export const RadarCharts = sqliteTable(RADAR_CHARTS_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),

    xAxisField: text("x_axis_field")
        .notNull()
        .default(defaultRadarChartConfig.xAxisField),
    yAxisField: text("y_axis_field")
        .notNull()
        .default(defaultRadarChartConfig.yAxisField),
    xAxisSortOrder: text("x_sort_order")
        .notNull()
        .default(defaultRadarChartConfig.xAxisSortOrder)
        .$type<SortType>(),
    yAxisSortOrder: text("y_sort_order")
        .notNull()
        .default(defaultRadarChartConfig.yAxisSortOrder)
        .$type<SortType>(),
    omitZeroValuesEnabled: integer("omit_zero_values_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultRadarChartConfig.omitZeroValuesEnabled),
    cumulativeEnabled: integer("cumulative_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultRadarChartConfig.cumulativeEnabled),
    //NOTE :  we are doing this because, the data above will be updated separately, if we include all above in this, then we have update the whole string
    specificConfig: text("specific_config", { mode: "json" })
        .notNull()
        .$type<RadarSpecificConfig>()
        .default(radarSpecificConfigDefaults),
});

export const RadarChartsInsert = RadarCharts.$inferInsert;
export const RadarChartsSelect = RadarCharts.$inferSelect;
