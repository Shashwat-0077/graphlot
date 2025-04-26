import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

import { Charts } from "@/modules/BasicChart/schema/db";
import { ColorType, FilterType, GRID_TYPE, GridType } from "@/constants";
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
            .$type<ColorType>(),
        text_color: text("text_color", { mode: "json" })
            .notNull()
            .default(defaultConfig.text_color)
            .$type<ColorType>(),
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
            .$type<ColorType[]>(),
        // in the format of [{ r : 255, g : 255, b : 255, a : 1 }, { r : 255, g : 255, b : 255, a : 1 }]

        x_axis: text("x_axis").default(defaultConfig.x_axis),
        y_axis: text("y_axis").default(defaultConfig.y_axis),
        group_by: text("group_by").default(defaultConfig.group_by),
        sort_by: text("sort_by").default(defaultConfig.sort_by),
        omit_zero_values: integer("omit_zero_values", {
            mode: "boolean",
        })
            .notNull()
            .default(defaultConfig.omit_zero_values),
        cumulative: integer("cumulative", { mode: "boolean" }).default(
            defaultConfig.cumulative
        ),
        filters: text("filters", { mode: "json" })
            .notNull()
            .default(defaultConfig.filters)
            .$type<FilterType[]>(),
        // in the format of {column: string; operation: string; value: string; }

        grid_color: text("grid_color", { mode: "json" })
            .$type<ColorType>()
            .notNull()
            .default(defaultConfig.grid_color),
        grid_type: text("grid_type", { mode: "text" })
            .$type<GridType>()
            .notNull()
            .default(defaultConfig.grid_type),

        bar_gap: integer("bar_gap").notNull().default(defaultConfig.bar_gap),
        bar_size: integer("bar_size").notNull().default(defaultConfig.bar_size),
    },
    (table) => {
        const gridValuesString = GRID_TYPE.map((v) => `'${v}'`).join(", ");

        return [
            check(
                "bar_charts_grid_type_check",
                //! Using sql.raw might be a bad idea, maybe try to think of a workaround
                sql`(${table.grid_type} IN (${sql.raw(gridValuesString)}))`
            ),
        ];
    }
);
