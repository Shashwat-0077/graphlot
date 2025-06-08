import { ChartFilter, RadialLegendPositionType, SortType } from "@/constants";
import { SORT_NONE, RADIAL_LEGEND_POSITION_END } from "@/constants";

// The default config for a Radial chart
export const defaultDonutChartConfig = {
    xAxisField: "",
    xAxisSortOrder: SORT_NONE as SortType,
    omitZeroValuesEnabled: false,
    filters: [] as ChartFilter[],
    innerRadius: 40,
    outerRadius: 80,
    startAngle: 0,
    endAngle: 360,
    legendPosition: RADIAL_LEGEND_POSITION_END as RadialLegendPositionType,
    legendTextSize: 12,
};
