import { ChartFilter, SortType } from "@/constants";
import { SORT_ALPHA_ASC, SORT_NUMERIC_DESC } from "@/constants";

export const defaultBarChartConfig = {
    xAxisField: "",
    yAxisField: "",
    xAxisSortOrder: SORT_ALPHA_ASC as SortType,
    yAxisSortOrder: SORT_NUMERIC_DESC as SortType,
    omitZeroValuesEnabled: false,
    cumulativeEnabled: false,
    filters: [] as ChartFilter[],
    yAxisEnabled: true,
    xAxisEnabled: true,
    barBorderRadius: 4,
    barWidth: 20,
    barGap: 4,
    fillOpacity: 0.8,
    strokeWidth: 2,
};
