import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
    defaultAreaChartConfig,
    AreaSpecificConfig,
    areaSpecificConfigDefaults,
} from "@/modules/chart-types/area/default-area-config";
import { SortType } from "@/constants";
import { ChartMetadata } from "@/modules/chart-attributes/chart-metadata/schema";

export const AREA_CHARTS_TABLE_NAME = "area_chart";
export const AreaCharts = sqliteTable(AREA_CHARTS_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, {
            onDelete: "cascade",
        }),
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
    //NOTE :  we are doing this because, the data above will be updated separately, if we include all above in this, then we have update the whole string
    specificConfig: text("specific_config", { mode: "json" })
        .notNull()
        .$type<AreaSpecificConfig>()
        .default(areaSpecificConfigDefaults),
});
