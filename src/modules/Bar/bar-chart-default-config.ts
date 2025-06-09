import { ChartFilter, SortType } from "@/constants";
import { SORT_ALPHA_ASC, SORT_NUMERIC_DESC } from "@/constants";

export type BarSpecificConfig = {
    yAxisEnabled: boolean;
    xAxisEnabled: boolean;
    barBorderRadius: number; // in pixels
    borderRadiusBetweenBars: boolean; // in pixels, optional for backward compatibility
    barWidth: number; // in pixels
    barGap: number; // in pixels
    fillOpacity: number; // between 0 and 1
    strokeWidth: number; // in pixels
    stacked: boolean; // whether the bars are stacked
};

export const barSpecificConfigDefaults: BarSpecificConfig = {
    yAxisEnabled: true,
    xAxisEnabled: true,
    barBorderRadius: 4,
    barWidth: 20,
    barGap: 4,
    fillOpacity: 0.8,
    strokeWidth: 2,
    stacked: false,
    borderRadiusBetweenBars: false, // for backward compatibility
};

export const defaultBarChartConfig = {
    xAxisField: "",
    yAxisField: "",
    xAxisSortOrder: SORT_ALPHA_ASC as SortType,
    yAxisSortOrder: SORT_NUMERIC_DESC as SortType,
    omitZeroValuesEnabled: false,
    cumulativeEnabled: false,
    filters: [] as ChartFilter[],
};
