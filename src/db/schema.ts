import { relations } from "drizzle-orm";

import { AreaCharts } from "@/modules/Area/schema/db";
import { BarCharts } from "@/modules/Bar/schema/db";
import { DonutCharts } from "@/modules/Donut/schema/db";
import { HeatmapCharts, HeatmapData } from "@/modules/Heatmap/schema/db";
import { RadarCharts } from "@/modules/Radar/schema/db";
import { Collections } from "@/modules/Collection/schema/db";
import { Charts } from "@/modules/BasicChart/schema/db";
import { Users, Accounts } from "@/modules/auth/schema/db";

// relations
export const userRelations = relations(Users, ({ many }) => ({
    collections: many(Collections),
    accounts: many(Accounts),
}));

export const accountRelations = relations(Accounts, ({ one }) => ({
    user: one(Users, {
        fields: [Accounts.userId],
        references: [Users.id],
    }),
}));

export const collectionRelations = relations(Collections, ({ many, one }) => ({
    charts: many(Charts),
    user: one(Users, {
        fields: [Collections.user_id],
        references: [Users.id],
    }),
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
        references: [HeatmapCharts.chart_id],
    }),
}));

export {
    AreaCharts,
    BarCharts,
    DonutCharts,
    HeatmapCharts,
    RadarCharts,
    Collections,
    Charts,
    HeatmapData,
    Users,
    Accounts,
};
