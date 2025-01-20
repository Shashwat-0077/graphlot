import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const Collections = sqliteTable(
    "collections",
    {
        id: integer("id", { mode: "number" }).primaryKey({
            autoIncrement: true,
        }),
        userId: text("userId").notNull(),
        name: text("name").notNull(),
        description: text("description").notNull(),
        chartCount: integer("chartCount", { mode: "number" })
            .notNull()
            .default(0),
        created_at: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => [
        unique("uniqueConstantForUserIDAndName").on(table.userId, table.name),
    ]
);

export const Charts = sqliteTable("charts", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    collection_id: integer("collection_id", { mode: "number" })
        .notNull()
        .references(() => Collections.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    created_at: integer("created_at", { mode: "timestamp" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    notionDatabaseUrl: text("notionDatabaseUrl").notNull(),
    xAxis: text("xAxis").notNull(),
    yAxis: text("yAxis").notNull(),
    type: text("type").notNull(), // Each chart type will be validated at application level
});

export const AreaCharts = sqliteTable("area_chart", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    chart_id: integer("chart_id", { mode: "number" })
        .notNull()
        .unique()
        .references(() => Charts.id, { onDelete: "cascade" }),
    // Add area chart specific properties here
});

export const RadarCharts = sqliteTable("radar_chart", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    chart_id: integer("chart_id", { mode: "number" })
        .notNull()
        .unique()
        .references(() => Charts.id, { onDelete: "cascade" }),
    // Add radar chart specific properties here
});

export const DonutCharts = sqliteTable("donut_chart", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    chart_id: integer("chart_id", { mode: "number" })
        .notNull()
        .unique()
        .references(() => Charts.id, { onDelete: "cascade" }),
    // Add donut chart specific properties here
});

export const BarCharts = sqliteTable("bar_chart", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    chart_id: integer("chart_id", { mode: "number" })
        .notNull()
        .unique()
        .references(() => Charts.id, { onDelete: "cascade" }),
    // Add bar chart specific properties here
});

export const HeatmapCharts = sqliteTable("heatmap_chart", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    chart_id: integer("chart_id", { mode: "number" })
        .notNull()
        .unique()
        .references(() => Charts.id, { onDelete: "cascade" }),
    // Add heatmap chart specific properties here
});

// Relations
export const collectionRelations = relations(Collections, ({ many }) => ({
    charts: many(Charts),
}));

export const chartRelations = relations(Charts, ({ one }) => ({
    collection: one(Collections, {
        fields: [Charts.collection_id],
        references: [Collections.id],
    }),
}));

export const areaChartRelations = relations(AreaCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [AreaCharts.chart_id],
        references: [Charts.id],
    }),
}));

export const radarChartRelations = relations(RadarCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [RadarCharts.chart_id],
        references: [Charts.id],
    }),
}));

export const donutChartRelations = relations(DonutCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [DonutCharts.chart_id],
        references: [Charts.id],
    }),
}));

export const barChartRelations = relations(BarCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [BarCharts.chart_id],
        references: [Charts.id],
    }),
}));

export const heatmapChartRelations = relations(HeatmapCharts, ({ one }) => ({
    chart: one(Charts, {
        fields: [HeatmapCharts.chart_id],
        references: [Charts.id],
    }),
}));
