import { relations } from "drizzle-orm";

import { ChartMetadataTable, HeatmapCharts } from "@/db/schema";

export const heatmapChartsRelations = relations(HeatmapCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadataTable, {
        fields: [HeatmapCharts.chartId],
        references: [ChartMetadataTable.chartId],
    }),
}));
