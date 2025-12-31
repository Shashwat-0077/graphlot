import { relations } from "drizzle-orm";

import { ChartMetadata, RadarCharts } from "@/db/schema";

export const radarChartsRelations = relations(RadarCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadata, {
        fields: [RadarCharts.chartId],
        references: [ChartMetadata.chartId],
    }),
}));
