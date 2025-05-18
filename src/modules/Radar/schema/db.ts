import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { Charts } from "@/modules/ChartMetaData/schema/db";
import { RGBAColor, ChartFilter, SortType } from "@/constants";
import defaultConfig from "@/modules/Radar/default.config";

export const RadarCharts = sqliteTable("radar_charts", {
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
    // in the format of [{ r: 255, g: 255, b: 255, a: 1 }, { r: 255, g: 255, b: 255, a: 1 }]

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
    // in the format of { column: string; operation: string; value: string; }

    grid_color: text("grid_color", { mode: "json" })
        .notNull()
        .default(defaultConfig.grid_color)
        .$type<RGBAColor>(),
    grid_enabled: integer("grid_type", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.grid_enabled),
});
