import { ChartFilter, RadialLegendPositionType, SortType } from "@/constants";
import { SORT_NONE, RADIAL_LEGEND_POSITION_END } from "@/constants";

//TODO : need to add offset option for full graph
// add option for rounded corners
// add option for gap
// add tooltip options

// TODO : modify the schema so that grid(visual settings) is part of the chart config

export type RadialSpecificConfig = {
    innerRadius: number; // in pixels
    outerRadius: number; // in pixels
    startAngle: number; // in degrees
    endAngle: number; // in degrees
    legendPosition: RadialLegendPositionType; // position of the legend
    legendTextSize: number; // size of the legend text in pixels
};

export const radialSpecificConfigDefaults: RadialSpecificConfig = {
    innerRadius: 40, // default inner radius
    outerRadius: 80, // default outer radius
    startAngle: 0, // default start angle
    endAngle: 360, // default end angle
    legendPosition: RADIAL_LEGEND_POSITION_END as RadialLegendPositionType, // default legend position
    legendTextSize: 12, // default legend text size
};

// The default config for a Radial chart
export const defaultRadialChartConfig = {
    xAxisField: "",
    xAxisSortOrder: SORT_NONE as SortType,
    omitZeroValuesEnabled: false,
    filters: [] as ChartFilter[],
};
