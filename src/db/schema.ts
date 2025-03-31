import { v4 as uuid } from "uuid";
import { relations, sql } from "drizzle-orm";
import {
    integer,
    sqliteTable,
    text,
    unique,
    real,
} from "drizzle-orm/sqlite-core";

// Collections table
export const Collections = sqliteTable(
    "collections",
    {
        collection_id: text("id")
            .primaryKey()
            .$defaultFn(() => uuid()),
        user_id: text("userId").notNull(),
        name: text("name").notNull(),
        description: text("description").notNull(),
        chart_count: integer("chartCount", { mode: "number" })
            .notNull()
            .default(0),
        created_at: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => [
        unique("collections_user_name_unique").on(table.user_id, table.name),
    ]
);

// Charts base table
export const Charts = sqliteTable(
    "charts",
    {
        chart_id: text("id")
            .primaryKey()
            .$defaultFn(() => uuid()),
        collection_id: text("collection_id")
            .notNull()
            .references(() => Collections.collection_id, {
                onDelete: "cascade",
            }),
        name: text("name").notNull(),
        description: text("description").notNull(),
        created_at: integer("created_at", { mode: "timestamp" })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        notion_database_id: text("notion_database_id").notNull(),
        notion_database_name: text("notion_database_name").notNull(),
        type: text("type").notNull(),
    },
    (table) => [
        unique("charts_collection_name_unique").on(
            table.collection_id,
            table.name
        ),
    ]
);

// Area Charts - Fully Independent Schema
export const AreaCharts = sqliteTable("area_charts", {
    area_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),

    background_color: text("background_color").notNull().default("#FFFFFF"),
    text_color: text("text_color").notNull().default("#000000"),
    show_tooltip: integer("tooltip").notNull().default(1),
    show_legend: integer("legend").notNull().default(1),
    border: integer("border").notNull().default(0),
    colors: text("color", { mode: "json" }),

    x_axis: text("x_axis"),
    y_axis: text("y_axis"),
    group_by: text("group_by"),
    sort_by: text("sort_by"),
    omitZeroValues: integer("omitZeroValues"),
    cumulative: integer("cumulative"),
    filters: text("filters", { mode: "json" }),
    grid_color: text("grid_color").notNull().default("#E0E0E0"),
    show_grid: integer("grid").notNull().default(1),
});

// Radar Charts - Fully Independent Schema
export const RadarCharts = sqliteTable("radar_charts", {
    radar_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),

    background_color: text("background_color").notNull().default("#FFFFFF"),
    text_color: text("text_color").notNull().default("#000000"),
    show_tooltip: integer("tooltip").notNull().default(1),
    show_legend: integer("legend").notNull().default(1),
    border: integer("border").notNull().default(0),
    colors: text("color", { mode: "json" }),

    x_axis: text("x_axis"),
    y_axis: text("y_axis"),
    group_by: text("group_by"),
    sort_by: text("sort_by"),
    omitZeroValues: integer("omitZeroValues"),
    cumulative: integer("cumulative"),
    filters: text("filters", { mode: "json" }),
    grid_color: text("grid_color").notNull().default("#E0E0E0"),
    show_grid: integer("grid").notNull().default(1),
});

// Donut Charts - Fully Independent Schema
export const DonutCharts = sqliteTable("donut_charts", {
    donut_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),

    background_color: text("background_color").notNull().default("#FFFFFF"),
    text_color: text("text_color").notNull().default("#000000"),
    show_tooltip: integer("tooltip").notNull().default(1),
    show_legend: integer("legend").notNull().default(1),
    border: integer("border").notNull().default(0),
    colors: text("color", { mode: "json" }),

    x_axis: text("x_axis"),
    sort_by: text("sort_by"),
    omitZeroValues: integer("omitZeroValues"),
    filters: text("filters", { mode: "json" }),
});

// Bar Charts - Fully Independent Schema
export const BarCharts = sqliteTable("bar_charts", {
    bar_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),

    background_color: text("background_color").notNull().default("#FFFFFF"),
    text_color: text("text_color").notNull().default("#000000"),
    show_tooltip: integer("tooltip").notNull().default(1),
    show_legend: integer("legend").notNull().default(1),
    border: integer("border").notNull().default(0),
    colors: text("color", { mode: "json" }),

    x_axis: text("x_axis"),
    y_axis: text("y_axis"),
    group_by: text("group_by"),
    sort_by: text("sort_by"),
    omitZeroValues: integer("omitZeroValues"),
    cumulative: integer("cumulative"),
    filters: text("filters", { mode: "json" }),
    grid_color: text("grid_color").notNull().default("#E0E0E0"),
    show_grid: integer("grid").notNull().default(1),

    barSize: integer("bar_size").notNull().default(20),
    barGap: integer("bar_gap").notNull().default(5),
});

// Heatmap Charts - Fully Independent Schema
export const HeatmapCharts = sqliteTable("heatmap_charts", {
    heatmap_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),

    background_color: text("background_color").notNull().default("#FFFFFF"),
    text_color: text("text_color").notNull().default("#000000"),
    show_tooltip: integer("tooltip").notNull().default(1),
    show_legend: integer("legend").notNull().default(1),
    border: integer("border").notNull().default(0),

    metric: text("metric").notNull().default("count"),
    streak: integer("streak").notNull().default(0),
    longest_streak: integer("longest_streak").notNull().default(0),
    sum_of_all_entries: real("sum_of_all_entries").notNull().default(0),
    average_of_all_entries: real("average_of_all_entries").notNull().default(0),
    number_of_entries: integer("number_of_entries").notNull().default(0),
    toggle_button_hover: integer("toggle_button_hover").notNull().default(0),

    default_box_color: text("default_box_color", { mode: "json" })
        .notNull()
        .default('{"light": "#E0E0E0", "dark": "#333333"}'),
    accent: text("accent", { mode: "json" })
        .notNull()
        .default('{"color": "#4CAF50"}'),
    icon_colors: text("icon_colors", { mode: "json" })
        .notNull()
        .default('{"primary": "#2196F3", "secondary": "#FF9800"}'),
});

// Heatmap Data
export const HeatmapData = sqliteTable("heatmap_data", {
    heatmap_data_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    heatmap_id: text("heatmap_id")
        .notNull()
        .references(() => HeatmapCharts.heatmap_id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    count: integer("count").notNull(),
});

// Relations
export const collectionRelations = relations(Collections, ({ many }) => ({
    charts: many(Charts),
}));

export const chartRelations = relations(Charts, ({ one }) => ({
    collection: one(Collections, {
        fields: [Charts.collection_id],
        references: [Collections.collection_id],
    }),
}));

export const areaChartRelations = relations(AreaCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [AreaCharts.chart_id],
        references: [Charts.chart_id],
    }),
}));

export const radarChartRelations = relations(RadarCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [RadarCharts.chart_id],
        references: [Charts.chart_id],
    }),
}));

export const donutChartRelations = relations(DonutCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [DonutCharts.chart_id],
        references: [Charts.chart_id],
    }),
}));

export const barChartRelations = relations(BarCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [BarCharts.chart_id],
        references: [Charts.chart_id],
    }),
}));

export const heatmapChartRelations = relations(
    HeatmapCharts,
    ({ one, many }) => ({
        chart: one(Charts, {
            fields: [HeatmapCharts.chart_id],
            references: [Charts.chart_id],
        }),
        data: many(HeatmapData),
    })
);

export const heatmapDataRelations = relations(HeatmapData, ({ one }) => ({
    heatmap: one(HeatmapCharts, {
        fields: [HeatmapData.heatmap_id],
        references: [HeatmapCharts.heatmap_id],
    }),
}));
