import {
    GRID_ORIENTATION_TYPE_ONE,
    GRID_STYLE_OPTIONS,
    MIN_BORDER_WIDTH,
    TOOLTIP_STYLE_OPTIONS,
} from "@/constants";

export const defaultChartVisualSettings = {
    gridEnabled: false,
    gridOrientation: GRID_ORIENTATION_TYPE_ONE,
    gridStyle: GRID_STYLE_OPTIONS[0],
    gridWidth: 2,
    tooltipEnabled: true,
    tooltipStyle: TOOLTIP_STYLE_OPTIONS[0],
    tooltipBorderWidth: MIN_BORDER_WIDTH,
    tooltipBorderRadius: 5,
    tooltipTotalEnabled: true,
    tooltipSeparatorEnabled: true,
};
