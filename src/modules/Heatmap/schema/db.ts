import { v4 as uuid } from "uuid";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

import { Charts } from "@/modules/BasicChart/schema/db";
import { ColorType, DayOfWeek } from "@/constants";
import defaultConfig from "@/modules/Heatmap/default.config";

export const HeatmapCharts = sqliteTable("heatmap_charts", {
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
    label_enabled: integer("legend_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.label_enabled),
    has_border: integer("has_border", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.has_border),

    metric: text("metric").notNull().default(defaultConfig.metric),
    streak: integer("streak").notNull().default(defaultConfig.streak),
    streak_color: text("streak_color", { mode: "json" })
        .notNull()
        .default(defaultConfig.streak_color)
        .$type<ColorType>(),
    streak_enabled: integer("streak_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.streak_enabled),
    days_to_include_in_streak: text("days_to_include_in_streak", {
        mode: "json",
    })
        .$type<DayOfWeek[]>()
        .notNull()
        .default(defaultConfig.days_to_include_in_streak),

    longest_streak: integer("longest_streak")
        .notNull()
        .default(defaultConfig.longest_streak),
    longest_streak_color: text("longest_streak_color", { mode: "json" })
        .notNull()
        .default(defaultConfig.longest_streak_color)
        .$type<ColorType>(),
    longest_streak_enabled: integer("long_streak_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.longest_streak_enabled),

    sum_of_all_entries: real("sum_of_all_entries")
        .notNull()
        .default(defaultConfig.sum_of_all_entries),
    sum_of_all_entries_color: text("sum_of_all_entries_color", { mode: "json" })
        .notNull()
        .default(defaultConfig.sum_of_all_entries_color)
        .$type<ColorType>(),
    sum_of_all_entries_enabled: integer("sum_of_all_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultConfig.sum_of_all_entries_enabled),

    average_of_all_entries: real("average_of_all_entries")
        .notNull()
        .default(defaultConfig.average_of_all_entries),
    average_of_all_entries_color: text("average_of_all_entries_color", {
        mode: "json",
    })
        .notNull()
        .default(defaultConfig.average_of_all_entries_color)
        .$type<ColorType>(),
    average_of_all_entries_enabled: integer("average_of_all_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultConfig.average_of_all_entries_enabled),

    number_of_entries: integer("number_of_entries")
        .notNull()
        .default(defaultConfig.number_of_entries),
    number_of_entries_color: text("number_of_entries_color", { mode: "json" })
        .notNull()
        .default(defaultConfig.number_of_entries_color)
        .$type<ColorType>(),
    number_of_entries_enabled: integer("number_of_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultConfig.number_of_entries_enabled),

    button_hover_enabled: integer("toggle_button_hover", { mode: "boolean" })
        .notNull()
        .default(defaultConfig.button_hover_enabled),

    default_box_color: text("default_box_color", { mode: "json" })
        .notNull()
        .default(defaultConfig.default_box_color)
        .$type<ColorType>(),
    accent: text("accent", { mode: "json" })
        .notNull()
        .default(defaultConfig.accent)
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
