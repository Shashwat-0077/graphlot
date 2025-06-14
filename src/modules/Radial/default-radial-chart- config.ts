import { ChartFilter, RGBAColor, SortType } from "@/constants";
import { SORT_NONE } from "@/constants";

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
    gap: number; // gap between segments in pixels
    trackEnabled: boolean; // whether the segments are stacked or not
    borderRadius: number; // border radius for rounded corners in pixels
    trackColor: RGBAColor; // color of the track, if applicable
    offset: {
        x: number; // x offset for the radial chart
        y: number; // y offset for the radial chart
    };
};

export const radialSpecificConfigDefaults: RadialSpecificConfig = {
    innerRadius: 40, // default inner radius
    outerRadius: 80, // default outer radius
    startAngle: 0, // default start angle
    endAngle: 360, // default end angle
    gap: 5, // default gap between segments
    borderRadius: 0, // default border radius
    trackEnabled: false, // default stacked option
    trackColor: { r: 255, g: 255, b: 255, a: 1 }, // default track color
    offset: {
        x: 0, // default x offset
        y: 0, // default y offset
    },
};

// The default config for a Radial chart
export const defaultRadialChartConfig = {
    xAxisField: "",
    xAxisSortOrder: SORT_NONE as SortType,
    yAxisField: "", // Assuming yAxisField is same as xAxisField for radial charts
    yAxisSortOrder: SORT_NONE as SortType, // Assuming yAxisSortOrder is same as xAxisSortOrder for radial charts
    omitZeroValuesEnabled: false,
    filters: [] as ChartFilter[],
};
