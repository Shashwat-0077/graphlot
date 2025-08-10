import { v4 as uuid } from "uuid";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

import { RGBAColor } from "@/constants";
import { defaultHeatmapConfig } from "@/modules/chart-types/heatmap/default-heatmap-config";

import { ChartMetadata } from "@/modules/chart/chart-metadata/schema";

export const HEATMAP_CHARTS_TABLE_NAME = "heatmap";

export const HeatmapCharts = sqliteTable(HEATMAP_CHARTS_TABLE_NAME, {
    chartId: text("chart_id")
        .primaryKey()
        .references(() => ChartMetadata.chartId, { onDelete: "cascade" }),

    dateField: text("date_field")
        .notNull()
        .default(defaultHeatmapConfig.dateField)
        .$type<string>(),
    valueField: text("value_field")
        .notNull()
        .default(defaultHeatmapConfig.valueField)
        .$type<string>(),

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

    legendEnabled: integer("legend_enabled", { mode: "boolean" })
        .notNull()
        .default(defaultHeatmapConfig.legendEnabled),

    borderEnabled: integer("borderEnabled", { mode: "boolean" })
        .notNull()
        .default(defaultHeatmapConfig.borderEnabled),

    metric: text("metric").notNull().default(defaultHeatmapConfig.metric),
    streak: text("streak", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.streak)
        .$type<typeof defaultHeatmapConfig.streak>(),

    longestStreak: text("longest_streak", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.longestStreak)
        .$type<typeof defaultHeatmapConfig.longestStreak>(),

    sumOfAllEntries: text("sum_of_all_entries", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.sumOfAllEntries)
        .$type<typeof defaultHeatmapConfig.sumOfAllEntries>(),

    averageOfAllEntries: text("average_of_all_entries", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.averageOfAllEntries)
        .$type<typeof defaultHeatmapConfig.averageOfAllEntries>(),

    numberOfEntries: text("number_of_entries", { mode: "json" })
        .notNull()
        .default(defaultHeatmapConfig.numberOfEntries)
        .$type<typeof defaultHeatmapConfig.numberOfEntries>(),

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

export const HeatmapChartsInsert = HeatmapCharts.$inferInsert;
export const HeatmapChartsSelect = HeatmapCharts.$inferSelect;

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

export const HeatmapDataInsert = HeatmapData.$inferInsert;
export const HeatmapDataSelect = HeatmapData.$inferSelect;
