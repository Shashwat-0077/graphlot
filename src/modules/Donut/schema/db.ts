import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import defaultConfig from "@/modules/Donut/default.config";
import { Charts } from "@/modules/BasicChart/schema/db";
import { ColorType, FilterType, SortOptionsType } from "@/constants";

export const DonutCharts = sqliteTable("donut_charts", {
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
    tooltip_enabled: integer("show_tooltip", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.tooltip_enabled),
    label_enabled: integer("show_label", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.label_enabled),
    legend_enabled: integer("show_legend", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.legend_enabled),
    has_border: integer("has_border", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.has_border),
    color_palette: text("color_palette", { mode: "json" })
        .notNull()
        .default(defaultConfig.color_palette)
        .$type<ColorType[]>(),

    x_axis: text("x_axis").notNull().default(defaultConfig.x_axis),
    sort_by: text("sort_by")
        .notNull()
        .default(defaultConfig.sort_by)
        .$type<SortOptionsType>(),
    omit_zero_values: integer("omit_zero_values", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.omit_zero_values),
    filters: text("filters", { mode: "json" })
        .notNull()
        .default(defaultConfig.filters)
        .$type<FilterType[]>(),
});
