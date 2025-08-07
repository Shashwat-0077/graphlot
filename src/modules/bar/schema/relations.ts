import { relations } from "drizzle-orm";

import { BarCharts, ChartMetadataTable } from "@/db/schema";

export const barChartsRelations = relations(BarCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadataTable, {
        fields: [BarCharts.chartId],
        references: [ChartMetadataTable.chartId],
    }),
}));
