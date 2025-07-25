import { relations } from 'drizzle-orm';

import {
    ChartBoxModel,
    ChartMetadata,
    Collections,
    ChartColors,
    ChartTypography,
    ChartVisual,
    AreaCharts,
    BarCharts,
    RadialCharts,
    RadarCharts,
} from '@/db/schema';

export const chartMetadataRelations = relations(ChartMetadata, ({ one }) => ({
    collection: one(Collections, {
        fields: [ChartMetadata.collectionId],
        references: [Collections.collectionId],
    }),

    chartBoxModel: one(ChartBoxModel, {
        fields: [ChartMetadata.chartId],
        references: [ChartBoxModel.chartId],
    }),

    chartColors: one(ChartColors, {
        fields: [ChartMetadata.chartId],
        references: [ChartColors.chartId],
    }),

    chartTypography: one(ChartTypography, {
        fields: [ChartMetadata.chartId],
        references: [ChartTypography.chartId],
    }),

    chartVisual: one(ChartVisual, {
        fields: [ChartMetadata.chartId],
        references: [ChartVisual.chartId],
    }),

    areaCharts: one(AreaCharts, {
        fields: [ChartMetadata.chartId],
        references: [AreaCharts.chartId],
    }),

    barCharts: one(BarCharts, {
        fields: [ChartMetadata.chartId],
        references: [BarCharts.chartId],
    }),

    redialCharts: one(RadialCharts, {
        fields: [ChartMetadata.chartId],
        references: [RadialCharts.chartId],
    }),

    radarCharts: one(RadarCharts, {
        fields: [ChartMetadata.chartId],
        references: [RadarCharts.chartId],
    }),
}));

export const chartBoxModelRelations = relations(ChartBoxModel, ({ one }) => ({
    collection: one(ChartMetadata, {
        fields: [ChartBoxModel.chartId],
        references: [ChartMetadata.chartId],
    }),
}));

export const chartColorsRelations = relations(ChartColors, ({ one }) => ({
    chartMetadata: one(ChartMetadata, {
        fields: [ChartColors.chartId],
        references: [ChartMetadata.chartId],
    }),
}));

export const chartTypographyRelations = relations(ChartTypography, ({ one }) => ({
    chartMetadata: one(ChartMetadata, {
        fields: [ChartTypography.chartId],
        references: [ChartMetadata.chartId],
    }),
}));

export const chartVisualRelations = relations(ChartVisual, ({ one }) => ({
    chartMetadata: one(ChartMetadata, {
        fields: [ChartVisual.chartId],
        references: [ChartMetadata.chartId],
    }),
}));
