import { relations } from "drizzle-orm";

import { ChartMetadata, RadialCharts } from "@/db/schema";

export const radialChartsRelations = relations(RadialCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadata, {
        fields: [RadialCharts.chartId],
        references: [ChartMetadata.chartId],
    }),
}));
