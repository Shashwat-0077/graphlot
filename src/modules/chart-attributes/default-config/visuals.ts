import {
    GRID_ORIENTATION_TYPE_NONE,
    GRID_STYLE_OPTIONS,
    MIN_BORDER_WIDTH,
    TOOLTIP_STYLE_OPTIONS,
} from "@/constants";

export const defaultChartVisualSettings = {
    gridOrientation: GRID_ORIENTATION_TYPE_NONE,
    gridStyle: GRID_STYLE_OPTIONS[0],
    gridWidth: MIN_BORDER_WIDTH,
    tooltipEnabled: true,
    tooltipStyle: TOOLTIP_STYLE_OPTIONS[0],
    tooltipBorderWidth: MIN_BORDER_WIDTH,
    tooltipBorderRadius: 5,
    tooltipTotalEnabled: true,
    tooltipSeparatorEnabled: true,
};
