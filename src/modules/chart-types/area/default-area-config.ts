import { AREA_CHART_LINE_STYLE_MONOTONE, AreaChartLineStyle, SORT_NONE, SortType } from '@/constants';

export type AreaSpecificConfig = {
    yAxisEnabled: boolean;
    xAxisEnabled: boolean;
    stackedEnabled: boolean;
    lineStyle: AreaChartLineStyle;
    strokeWidth: number; // in pixels
    fill: {
        opacity: number; // between 0 and 1
        start: number; // start of the gradient, 0 to 1
        end: number; // end of the gradient, 0 to 1
    };
    isAreaChart: boolean;
};

export const areaSpecificConfigDefaults: AreaSpecificConfig = {
    yAxisEnabled: true,
    xAxisEnabled: true,
    stackedEnabled: false,
    lineStyle: AREA_CHART_LINE_STYLE_MONOTONE as AreaChartLineStyle,
    strokeWidth: 1,
    fill: {
        start: 0.05, // default start opacity for gradient fill
        end: 0.95, // default end opacity for gradient fill
        opacity: 0.5, // default fill opacity
    },
    isAreaChart: true,
};

export const defaultAreaChartConfig = {
    xAxisField: '',
    yAxisField: '',
    xAxisSortOrder: SORT_NONE as SortType,
    yAxisSortOrder: SORT_NONE as SortType,
    omitZeroValuesEnabled: false,
    cumulativeEnabled: false,
};
