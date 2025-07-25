import { relations } from 'drizzle-orm';

import { ChartMetadata } from '@/db/schema';

import { AreaCharts } from '.';

export const areaChartsRelations = relations(AreaCharts, ({ one }) => ({
    chartMetadata: one(ChartMetadata, {
        fields: [AreaCharts.chartId],
        references: [ChartMetadata.chartId],
    }),
}));
