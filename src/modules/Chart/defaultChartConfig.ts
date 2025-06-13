import {
    GRID_ORIENTATION_TYPE_NONE,
    GRID_STYLE_OPTIONS,
    MIN_BORDER_WIDTH,
    TOOLTIP_STYLE_OPTIONS,
    ANCHOR_OPTIONS,
    FONT_STYLES_OPTIONS,
    FONT_OPTIONS,
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

export const defaultChartTypographySettings = {
    label: "",
    labelEnabled: false,
    labelSize: 12,
    labelFontFamily: FONT_OPTIONS[0],
    labelFontStyle: FONT_STYLES_OPTIONS[2],
    labelAnchor: ANCHOR_OPTIONS[0],
    legendEnabled: true,
};

export const defaultChartBoxModel = {
    marginTop: 50,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1,
};

export const defaultChartColors = {
    borderColor: { r: 0, g: 0, b: 0, a: 1 },
    gridColor: { r: 200, g: 200, b: 200, a: 1 },
    labelColor: { r: 0, g: 0, b: 0, a: 1 },
    legendTextColor: { r: 0, g: 0, b: 0, a: 1 },
    backgroundColor: { r: 255, g: 255, b: 255, a: 1 },
    tooltipBackgroundColor: { r: 0, g: 0, b: 0, a: 0.8 },
    tooltipTextColor: { r: 255, g: 255, b: 255, a: 1 },
    tooltipBorderColor: { r: 0, g: 0, b: 0, a: 1 },
    tooltipSeparatorColor: { r: 200, g: 200, b: 200, a: 1 },
    colorPalette: [],
};

export const defaultChartColor = {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
};
