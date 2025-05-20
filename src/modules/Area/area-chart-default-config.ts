import {
    AREA_CHART_STYLE_MONOTONE,
    AreaChartStyle,
    SORT_NONE,
    SortType,
} from "@/constants";

export const defaultAreaChartConfig = {
    xAxisField: "",
    yAxisField: "",
    xAxisSortOrder: SORT_NONE as SortType,
    yAxisSortOrder: SORT_NONE as SortType,
    omitZeroValuesEnabled: false,
    cumulativeEnabled: false,
    filters: [],
    yAxisEnabled: true,
    xAxisEnabled: true,
    stackedEnabled: false,
    areaStyle: AREA_CHART_STYLE_MONOTONE as AreaChartStyle,
    strokeWidth: 1,
    fillOpacity: 0.5,
    isAreaChart: true,
};
