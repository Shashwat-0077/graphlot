import { relations } from "drizzle-orm";

import { ChartMetadata, HeatmapCharts } from "@/db/schema";

export const heatmapChartsRelations = relations(HeatmapCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadata, {
        fields: [HeatmapCharts.chartId],
        references: [ChartMetadata.chartId],
    }),
}));
