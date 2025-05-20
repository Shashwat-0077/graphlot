import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { defaultDonutChartConfig } from "@/modules/Radial/default-radial-chart- config";
import { ChartMetadata } from "@/modules/ChartMetaData/schema/db";
import {
    ChartFilter,
    RADIAL_LEGEND_POSITION_OPTIONS,
    RadialLegendPositionType,
    SORT_OPTIONS,
    SortType,
} from "@/constants";

export const RADIAL_CHARTS_TABLE_NAME = "radial_chart";
export const RadialCharts = sqliteTable(
    RADIAL_CHARTS_TABLE_NAME,
    {
        chartId: text("chart_id")
            .primaryKey()
            .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),

        xAxisField: text("x_axis_field")
            .notNull()
            .default(defaultDonutChartConfig.xAxisField),
        xAxisSortOrder: text("x_sort_order")
            .notNull()
            .$type<SortType>()
            .default(defaultDonutChartConfig.xAxisSortOrder),
        omitZeroValuesEnabled: integer("omit_zero_values_enabled", {
            mode: "boolean",
        })
            .notNull()
            .default(defaultDonutChartConfig.omitZeroValuesEnabled),
        filters: text("filters", { mode: "json" })
            .notNull()
            .default(defaultDonutChartConfig.filters)
            .$type<ChartFilter[]>(),
        innerRadius: integer("inner_radius")
            .notNull()
            .default(defaultDonutChartConfig.innerRadius),
        outerRadius: integer("outer_radius")
            .notNull()
            .default(defaultDonutChartConfig.outerRadius),
        startAngle: integer("start_angle")
            .notNull()
            .default(defaultDonutChartConfig.startAngle),
        endAngle: integer("end_angle")
            .notNull()
            .default(defaultDonutChartConfig.endAngle),
        legendPosition: text("legend_position")
            .notNull()
            .$type<RadialLegendPositionType>()
            .default(defaultDonutChartConfig.legendPosition),
        legendTextSize: integer("legend_text_size")
            .notNull()
            .default(defaultDonutChartConfig.legendTextSize),
    },
    (table) => {
        const legendPosition = RADIAL_LEGEND_POSITION_OPTIONS.map(
            (v) => `'${v}'`
        ).join(", ");
        const sortOrderValuesString = SORT_OPTIONS.map((v) => `'${v}'`).join(
            ", "
        );

        return [
            check(
                "chk_radial_chart_x_sort_order",
                sql`(${table.xAxisSortOrder} IN (${sql.raw(sortOrderValuesString)}))`
            ),
            check(
                "chk_radial_chart_legend_position",
                sql`(${table.legendPosition} IN (${sql.raw(legendPosition)}))`
            ),
        ];
    }
);
