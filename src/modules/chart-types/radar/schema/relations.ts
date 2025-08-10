import { relations } from "drizzle-orm";

import { ChartMetadataTable, RadarCharts } from "@/db/schema";

export const radarChartsRelations = relations(RadarCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadataTable, {
        fields: [RadarCharts.chartId],
        references: [ChartMetadataTable.chartId],
    }),
}));
