import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

import { Charts } from "@/modules/ChartMetaData/schema/db";
import {
    RGBAColor,
    ChartFilter,
    GridOrientation,
    SortType,
    GRID_ORIENTATION_OPTIONS,
} from "@/constants";
import defaultConfig from "@/modules/Bar/default.config";

export const BarCharts = sqliteTable(
    "bar_charts",
    {
        chart_id: text("chart_id")
            .primaryKey()
            .references(() => Charts.chart_id, { onDelete: "cascade" }),

        background_color: text("background_color", { mode: "json" })
            .notNull()
            .default(defaultConfig.background_color)
            .$type<RGBAColor>(),

        text_color: text("text_color", { mode: "json" })
            .notNull()
            .default(defaultConfig.text_color)
            .$type<RGBAColor>(),

        tooltip_enabled: integer("tooltip_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultConfig.tooltip_enabled),

        label_enabled: integer("label_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultConfig.label_enabled),

        legend_enabled: integer("legend_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultConfig.legend_enabled),

        has_border: integer("has_border", { mode: "boolean" })
            .notNull()
            .default(defaultConfig.has_border),

        color_palette: text("color_palette", { mode: "json" })
            .notNull()
            .default(defaultConfig.color_palette)
            .$type<RGBAColor[]>(),

        x_axis: text("x_axis").notNull().default(defaultConfig.x_axis),

        y_axis: text("y_axis").notNull().default(defaultConfig.y_axis),

        sort_x: text("sort_x")
            .notNull()
            .default(defaultConfig.sort_x)
            .$type<SortType>(),

        sort_y: text("sort_y")
            .notNull()
            .default(defaultConfig.sort_y)
            .$type<SortType>(),

        omit_zero_values: integer("omit_zero_values", { mode: "boolean" })
            .notNull()
            .default(defaultConfig.omit_zero_values),

        cumulative: integer("cumulative", { mode: "boolean" })
            .notNull()
            .default(defaultConfig.cumulative),

        filters: text("filters", { mode: "json" })
            .notNull()
            .default(defaultConfig.filters)
            .$type<ChartFilter[]>(),

        grid_color: text("grid_color", { mode: "json" })
            .notNull()
            .default(defaultConfig.grid_color)
            .$type<RGBAColor>(),

        grid_type: text("grid_type", { mode: "text" })
            .notNull()
            .default(defaultConfig.grid_type)
            .$type<GridOrientation>(),

        bar_gap: integer("bar_gap").notNull().default(defaultConfig.bar_gap),
        bar_size: integer("bar_size").notNull().default(defaultConfig.bar_size),
    },
    (table) => {
        const gridValuesString = GRID_ORIENTATION_OPTIONS.map(
            (v) => `'${v}'`
        ).join(", ");

        return [
            check(
                "bar_charts_grid_type_check",
                sql`(${table.grid_type} IN (${sql.raw(gridValuesString)}))`
            ),
        ];
    }
);
