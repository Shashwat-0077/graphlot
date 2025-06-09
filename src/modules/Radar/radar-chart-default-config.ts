import { ChartFilter, SORT_NONE, SortType } from "@/constants";

export type RadarSpecificConfig = {
    yAxisEnabled: boolean;
    xAxisEnabled: boolean;
    strokeWidth: number;
};

export const radarSpecificConfigDefaults: RadarSpecificConfig = {
    yAxisEnabled: true,
    xAxisEnabled: true,
    strokeWidth: 2,
};

export const defaultRadarChartConfig = {
    xAxisField: "",
    yAxisField: "",
    xAxisSortOrder: SORT_NONE as SortType,
    yAxisSortOrder: SORT_NONE as SortType,
    omitZeroValuesEnabled: false,
    cumulativeEnabled: false,
    filters: [] as ChartFilter[],
};
