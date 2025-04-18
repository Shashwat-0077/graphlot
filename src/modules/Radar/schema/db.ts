import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { Charts } from "@/modules/BasicChart/schema/db";
import { ColorType, FilterType } from "@/constants";

export const RadarCharts = sqliteTable("radar_charts", {
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
        .default(false),
    color_palette: text("color_palette", { mode: "json" })
        .notNull()
        .default([])
        .$type<ColorType[]>(),
    // in the format of [{ r: 255, g: 255, b: 255, a: 1 }, { r: 255, g: 255, b: 255, a: 1 }]

    x_axis: text("x_axis"),
    y_axis: text("y_axis"),
    group_by: text("group_by"),
    sort_by: text("sort_by"),
    omit_zero_values: integer("omit_zero_values", { mode: "boolean" })
        .notNull()
        .default(false),
    cumulative: integer("cumulative", { mode: "boolean" }).default(false),
    filters: text("filters", { mode: "json" })
        .notNull()
        .default([])
        .$type<FilterType[]>(),
    // in the format of { column: string; operation: string; value: string; }

    grid_color: text("grid_color", { mode: "json" })
        .notNull()
        .default({ r: 224, g: 224, b: 224, a: 1 })
        .$type<ColorType>(),
    grid_enabled: integer("grid_type", { mode: "boolean" })
        .notNull()
        .default(true),
});
