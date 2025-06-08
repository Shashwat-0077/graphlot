import { ChartFilter, SORT_NONE, SortType } from "@/constants";

export const defaultRadarChartConfig = {
    xAxisField: "",
    yAxisField: "",
    xAxisSortOrder: SORT_NONE as SortType,
    yAxisSortOrder: SORT_NONE as SortType,
    omitZeroValuesEnabled: false,
    cumulativeEnabled: false,
    filters: [] as ChartFilter[],
    yAxisEnabled: true,
    xAxisEnabled: true,
    strokeWidth: 2,
};
