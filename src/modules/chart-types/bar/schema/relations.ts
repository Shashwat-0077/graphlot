import { relations } from "drizzle-orm";

import { BarCharts, ChartMetadata } from "@/db/schema";

export const barChartsRelations = relations(BarCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadata, {
        fields: [BarCharts.chartId],
        references: [ChartMetadata.chartId],
    }),
}));
