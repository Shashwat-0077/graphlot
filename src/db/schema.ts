import { v4 as uuid } from "uuid";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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
        unique("uniqueConstantForUserIDAndName").on(table.user_id, table.name),
    ]
);

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
        notion_database_id: text("notionDatabaseUrl").notNull(),
        notion_database_name: text("notionDatabaseName").notNull(),
        x_axis: text("xAxis").notNull().default(""),
        y_axis: text("yAxis").notNull().default(""),
        type: text("type").notNull(),
        // NOTE : Maybe add the child chart id here to improve lookup, just maybe
    },
    (table) => [
        unique("uniqueConstantForCollectionIdAndName").on(
            table.collection_id,
            table.name
        ),
    ]
);

export const AreaCharts = sqliteTable("area_chart", {
    area_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),
    // Add area chart specific properties here
});

export const RadarCharts = sqliteTable("radar_chart", {
    radar_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),
    // Add radar chart specific properties here
});

export const DonutCharts = sqliteTable("donut_chart", {
    donut_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),
    // Add donut chart specific properties here
});

export const BarCharts = sqliteTable("bar_chart", {
    bar_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),
    // Add bar chart specific properties here
});

export const HeatmapCharts = sqliteTable("heatmap_chart", {
    heatmap_id: text("id")
        .primaryKey()
        .$defaultFn(() => uuid()),
    chart_id: text("chart_id")
        .unique()
        .notNull()
        .references(() => Charts.chart_id, { onDelete: "cascade" }),
    // Add heatmap chart specific properties here
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

export const heatmapChartRelations = relations(HeatmapCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [HeatmapCharts.chart_id],
        references: [Charts.chart_id],
    }),
}));
