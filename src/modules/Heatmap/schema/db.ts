import { v4 as uuid } from "uuid";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

import { ChartMetadata } from "@/modules/ChartMetaData/schema/db";
import { RGBAColor, DayOfWeek } from "@/constants";
import { defaultHeatmapConfig } from "@/modules/Heatmap/heatmap-default-config";

export const HEATMAP_CHARTS_TABLE_NAME = "heatmap_chart";

export const HeatmapCharts = sqliteTable(HEATMAP_CHARTS_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),

    backgroundColor: text("background_color", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.backgroundColor)
        .$type<RGBAColor>(),

    textColor: text("text_color", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.textColor)
        .$type<RGBAColor>(),

    tooltipEnabled: integer("tooltip_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultHeatmapConfig.tooltipEnabled),

    labelEnabled: integer("legend_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultHeatmapConfig.labelEnabled),

    borderEnabled: integer("borderEnabled", { mode: "boolean" })
        .notNull()
        .default(defaultHeatmapConfig.borderEnabled),

    metric: text("metric").notNull().default(defaultHeatmapConfig.metric),
    streak: integer("streak").notNull().default(defaultHeatmapConfig.streak),

    streakColor: text("streak_color", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.streakColor)
        .$type<RGBAColor>(),

    streakEnabled: integer("streak_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultHeatmapConfig.streakEnabled),

    daysToIncludeInStreak: text("days_to_include_in_streak", {
        mode: "json",
    })
        .$type<DayOfWeek[]>()
        .notNull()
        .default(defaultHeatmapConfig.daysToIncludeInStreak),

    longestStreak: integer("longest_streak")
        .notNull()
        .default(defaultHeatmapConfig.longestStreak),

    longestStreakColor: text("longest_streak_color", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.longestStreakColor)
        .$type<RGBAColor>(),

    longestStreakEnabled: integer("long_streak_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultHeatmapConfig.longestStreakEnabled),

    sumOfAllEntries: real("sum_of_all_entries")
        .notNull()
        .default(defaultHeatmapConfig.sumOfAllEntries),

    sumOfAllEntriesColor: text("sum_of_all_entries_color", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.sumOfAllEntriesColor)
        .$type<RGBAColor>(),

    sumOfAllEntriesEnabled: integer("sum_of_all_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultHeatmapConfig.sumOfAllEntriesEnabled),

    averageOfAllEntries: real("average_of_all_entries")
        .notNull()
        .default(defaultHeatmapConfig.averageOfAllEntries),

    averageOfAllEntriesColor: text("average_of_all_entries_color", {
        mode: "json",
    })
        .notNull()
        .default(defaultHeatmapConfig.averageOfAllEntriesColor)
        .$type<RGBAColor>(),

    averageOfAllEntriesEnabled: integer("average_of_all_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultHeatmapConfig.averageOfAllEntriesEnabled),

    numberOfEntries: integer("number_of_entries")
        .notNull()
        .default(defaultHeatmapConfig.numberOfEntries),

    numberOfEntriesColor: text("number_of_entries_color", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.numberOfEntriesColor)
        .$type<RGBAColor>(),

    numberOfEntriesEnabled: integer("number_of_entries_enabled", {
        mode: "boolean",
    })
        .notNull()
        .default(defaultHeatmapConfig.numberOfEntriesEnabled),

    buttonHoverEnabled: integer("toggle_button_hover", { mode: "boolean" })
        .notNull()
        .default(defaultHeatmapConfig.buttonHoverEnabled),

    defaultBoxColor: text("default_box_color", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.defaultBoxColor)
        .$type<RGBAColor>(),

    accent: text("accent", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.accent)
        .$type<RGBAColor>(),
});
export const HeatmapData = sqliteTable("heatmap_data", {
    heatmapDataId: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),

    heatmapId: text("heatmap_id")
        .notNull()
        .references(() => HeatmapCharts.chartId, { onDelete: "cascade" }),

    date: real("date").notNull(),
    count: integer("count").notNull(),
});
