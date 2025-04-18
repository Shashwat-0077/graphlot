import { v4 as uuid } from "uuid";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

import { Charts } from "@/modules/BasicChart/schema/db";
import { ColorType, DayOfWeek } from "@/constants";

export const HeatmapCharts = sqliteTable("heatmap_charts", {
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
    label_enabled: integer("legend_enabled", { mode: "boolean" })
        .notNull()
        .default(true),
    has_border: integer("has_border", { mode: "boolean" })
        .notNull()
        .default(false),

    metric: text("metric").notNull().default("count"),
    streak: integer("streak").notNull().default(0),
    streak_color: text("streak_color", { mode: "json" })
        .notNull()
        .default({ r: 255, g: 255, b: 255, a: 1 })
        .$type<ColorType>(),
    streak_enabled: integer("streak_enabled", { mode: "boolean" })
        .notNull()
        .default(true),
    days_to_include_in_streak: text("days_to_include_in_streak", {
        mode: "json",
    })
        .$type<DayOfWeek[]>()
        .notNull()
        .default(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),

    longest_streak: integer("longest_streak").notNull().default(0),
    longest_streak_color: text("longest_streak_color", { mode: "json" })
        .notNull()
        .default({ r: 255, g: 255, b: 255, a: 1 })
        .$type<ColorType>(),
    longest_streak_enabled: integer("long_streak_enabled", { mode: "boolean" })
        .notNull()
        .default(true),

    sum_of_all_entries: real("sum_of_all_entries").notNull().default(0),
    sum_of_all_entries_color: text("sum_of_all_entries_color", { mode: "json" })
        .notNull()
        .default({ r: 255, g: 255, b: 255, a: 1 })
        .$type<ColorType>(),
    sum_of_all_entries_enabled: integer("sum_of_all_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(true),

    average_of_all_entries: real("average_of_all_entries").notNull().default(0),
    average_of_all_entries_color: text("average_of_all_entries_color", {
        mode: "json",
    })
        .notNull()
        .default({ r: 255, g: 255, b: 255, a: 1 })
        .$type<ColorType>(),
    average_of_all_entries_enabled: integer("average_of_all_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(true),

    number_of_entries: integer("number_of_entries").notNull().default(0),
    number_of_entries_color: text("number_of_entries_color", { mode: "json" })
        .notNull()
        .default({ r: 255, g: 255, b: 255, a: 1 })
        .$type<ColorType>(),
    number_of_entries_enabled: integer("number_of_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(true),

    button_hover_enabled: integer("toggle_button_hover", { mode: "boolean" })
        .notNull()
        .default(false),

    default_box_color: text("default_box_color", { mode: "json" })
        .notNull()
        .default({ r: 38, g: 38, b: 38, a: 1 })
        .$type<ColorType>(),
    accent: text("accent", { mode: "json" })
        .notNull()
        .default({ r: 255, g: 255, b: 255, a: 1 })
        .$type<ColorType>(),
});

export const HeatmapData = sqliteTable("heatmap_data", {
    heatmap_data_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    heatmap_id: text("heatmap_id")
        .notNull()
        .references(() => HeatmapCharts.chart_id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    count: integer("count").notNull(),
});
