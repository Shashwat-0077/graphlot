// import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import {
    defaultRadialChartConfig,
    RadialSpecificConfig,
    radialSpecificConfigDefaults,
} from '@/modules/radial/default-radial-config';
import { ChartMetadata } from '@/modules/chart/schema';
import { SortType } from '@/constants';

export const RADIAL_CHARTS_TABLE_NAME = 'radial_chart';
export const RadialCharts = sqliteTable(
    RADIAL_CHARTS_TABLE_NAME,
    {
        chartId: text('chart_id')
            .primaryKey()
            .references(() => ChartMetadata.chartId, { onDelete: 'cascade' }),

        xAxisField: text('x_axis_field').notNull().default(defaultRadialChartConfig.xAxisField),
        xAxisSortOrder: text('x_sort_order')
            .notNull()
            .$type<SortType>()
            .default(defaultRadialChartConfig.xAxisSortOrder),
        yAxisField: text('y_axis_field').notNull().default(defaultRadialChartConfig.yAxisField), // Assuming yAxisField is same as xAxisField for radial charts
        yAxisSortOrder: text('y_sort_order')
            .notNull()
            .$type<SortType>()
            .default(defaultRadialChartConfig.yAxisSortOrder), // Assuming yAxisSortOrder is same as xAxisSortOrder for radial charts

        omitZeroValuesEnabled: integer('omit_zero_values_enabled', {
            mode: 'boolean',
        })
            .notNull()
            .default(defaultRadialChartConfig.omitZeroValuesEnabled),
        //NOTE :  we are doing this because, the data above will be updated separately, if we include all above in this, then we have update the whole string
        specificConfig: text('specific_config', { mode: 'json' })
            .notNull()
            .$type<RadialSpecificConfig>()
            .default(radialSpecificConfigDefaults),
    },
    // (table) => {
    //     const legendPosition = RADIAL_LEGEND_POSITION_OPTIONS.map(
    //         (v) => `'${v}'`
    //     ).join(", ");
    //     const sortOrderValuesString = SORT_OPTIONS.map((v) => `'${v}'`).join(
    //         ", "
    //     );

    //     return [
    //         check(
    //             "chk_radial_chart_x_sort_order",
    //             sql`(${table.xAxisSortOrder} IN (${sql.raw(sortOrderValuesString)}))`
    //         ),
    //         check(
    //             "chk_radial_chart_legend_position",
    //             sql`(${table.legendPosition} IN (${sql.raw(legendPosition)}))`
    //         ),
    //     ];
    // }
);
