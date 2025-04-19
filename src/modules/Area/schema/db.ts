import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

import defaultAreaChartConfig from "@/modules/Area/default.config";
import { Charts } from "@/modules/BasicChart/schema/db";
import { ColorType, FilterType, GRID_TYPE, GridType } from "@/constants";

export const AreaCharts = sqliteTable(
    "area_charts",
    {
        chart_id: text("chart_id")
            .primaryKey()
            .references(() => Charts.chart_id, { onDelete: "cascade" }),

        background_color: text("background_color", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.background_color)
            .$type<ColorType>(),
        text_color: text("text_color", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.text_color)
            .$type<ColorType>(),
        tooltip_enabled: integer("tooltip_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.tooltip_enabled),
        label_enabled: integer("label_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.label_enabled),
        legend_enabled: integer("legend_enabled", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.legend_enabled),
        has_border: integer("has_border", { mode: "boolean" })
            .notNull()
            .default(defaultAreaChartConfig.has_border),
        color_palette: text("color_palette", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.color_palette)
            .$type<ColorType[]>(),
        // in the format of [{ r : 255, g : 255, b : 255, a : 1 }, { r : 255, g : 255, b : 255, a : 1 }]

        x_axis: text("x_axis").default(defaultAreaChartConfig.x_axis),
        y_axis: text("y_axis").default(defaultAreaChartConfig.y_axis),
        group_by: text("group_by").default(defaultAreaChartConfig.group_by),
        sort_by: text("sort_by").default(defaultAreaChartConfig.sort_by),
        omit_zero_values: integer("omit_zero_values", {
            mode: "boolean",
        })
            .notNull()
            .default(defaultAreaChartConfig.omit_zero_values),
        cumulative: integer("cumulative", { mode: "boolean" }).default(false),
        filters: text("filters", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.filters)
            .$type<FilterType[]>(),
        // in the format of {column: string; operation: string; value: string; }

        grid_color: text("grid_color", { mode: "json" })
            .notNull()
            .default(defaultAreaChartConfig.grid_color)
            .$type<ColorType>(),
        grid_type: text("grid_type", { mode: "text" })
            .notNull()
            .default(defaultAreaChartConfig.grid_type)
            .$type<GridType>(),
    },
    (table) => {
        const gridValuesString = GRID_TYPE.map((v) => `'${v}'`).join(", ");

        return [
            check(
                "area_charts_grid_type_check",
                //! Using sql.raw might be a bad idea, maybe try to think of a workaround
                sql`(${table.grid_type} IN (${sql.raw(gridValuesString)}))`
            ),
        ];
    }
);
