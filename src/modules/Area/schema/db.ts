import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

import { Charts } from "@/modules/BasicChart/schema/db";
import {
    ColorType,
    FilterType,
    GRID_HORIZONTAL,
    GRID_TYPE,
    GridType,
} from "@/constants";

export const AreaCharts = sqliteTable(
    "area_charts",
    {
        chart_id: text("chart_id")
            .primaryKey()
            .references(() => Charts.chart_id, { onDelete: "cascade" }),

        background_color: text("background_color", { mode: "json" })
            .notNull()
            .default({ r: 25, g: 25, b: 25, a: 1 })
            .$type<ColorType>(),
        text_color: text("text_color", { mode: "json" })
            .notNull()
            .default({ r: 255, g: 255, b: 255, a: 1 })
            .$type<ColorType>(),
        tooltip_enabled: integer("tooltip_enabled", { mode: "boolean" })
            .notNull()
            .default(true),
        label_enabled: integer("label_enabled", { mode: "boolean" })
            .notNull()
            .default(true),
        legend_enabled: integer("legend_enabled", { mode: "boolean" })
            .notNull()
            .default(true),
        has_border: integer("has_border", { mode: "boolean" })
            .notNull()
            .default(true),
        color_palette: text("color_palette", { mode: "json" })
            .notNull()
            .$type<ColorType[]>()
            .default([]),
        // in the format of [{ r : 255, g : 255, b : 255, a : 1 }, { r : 255, g : 255, b : 255, a : 1 }]

        x_axis: text("x_axis"),
        y_axis: text("y_axis"),
        group_by: text("group_by"),
        sort_by: text("sort_by"),
        omit_zero_values: integer("omit_zero_values", {
            mode: "boolean",
        })
            .notNull()
            .default(false),
        cumulative: integer("cumulative", { mode: "boolean" }).default(false),
        filters: text("filters", { mode: "json" })
            .notNull()
            .default([])
            .$type<FilterType[]>(),
        // in the format of {column: string; operation: string; value: string; }

        grid_color: text("grid_color", { mode: "json" })
            .$type<ColorType>()
            .notNull()
            .default({
                r: 224,
                g: 224,
                b: 224,
                a: 1,
            }),
        grid_type: text("grid_type", { mode: "text" })
            .notNull()
            .default(GRID_HORIZONTAL)
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
