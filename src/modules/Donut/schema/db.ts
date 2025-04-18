import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { Charts } from "@/modules/BasicChart/schema/db";
import { ColorType, FilterType } from "@/constants";

export const DonutCharts = sqliteTable("donut_charts", {
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
    tooltip_enabled: integer("show_tooltip", { mode: "boolean" })
        .notNull()
        .default(true),
    label_enabled: integer("show_label", { mode: "boolean" })
        .notNull()
        .default(true),
    legend_enabled: integer("show_legend", { mode: "boolean" })
        .notNull()
        .default(true),
    has_border: integer("has_border", { mode: "boolean" })
        .notNull()
        .default(false),
    color_palette: text("color_palette", { mode: "json" })
        .notNull()
        .default([])
        .$type<ColorType[]>(),

    x_axis: text("x_axis"),
    sort_by: text("sort_by"),
    omit_zero_values: integer("omit_zero_values", { mode: "boolean" })
        .notNull()
        .default(false),
    filters: text("filters", { mode: "json" })
        .notNull()
        .default([])
        .$type<FilterType[]>(),
});
