import { relations } from "drizzle-orm";

import { ChartMetadataTable, RadialCharts } from "@/db/schema";

export const radialChartsRelations = relations(RadialCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadataTable, {
        fields: [RadialCharts.chartId],
        references: [ChartMetadataTable.chartId],
    }),
}));
