import {
    ChartBoxModelSelect,
    ChartColorSelect,
    ChartTypographySelect,
    ChartVisualSelect,
} from "@/modules/chart-attributes/schema/types";
import {
    defaultChartVisualSettings,
    defaultChartBoxModelSettings,
    defaultChartColorsSettings,
    defaultChartTypographySettings,
} from "@/modules/chart-attributes/default-config";

export type ChartVisuals = Omit<ChartVisualSelect, "chartId">;
export type ChartTypography = Omit<ChartTypographySelect, "chartId">;
export type ChartBoxModel = Omit<ChartBoxModelSelect, "chartId">;
export type ChartColor = Omit<ChartColorSelect, "chartId">;

export interface ChartVisualSlice extends ChartVisuals {
    setVisuals: <T extends keyof ChartVisuals>(
        key: T,
        value: ChartVisuals[T] | undefined
    ) => void;
}
export interface ChartTypographySlice extends ChartTypography {
    setTypography: <T extends keyof ChartTypography>(
        key: T,
        value: ChartTypography[T] | undefined
    ) => void;
}
export interface ChartBoxModelSlice extends ChartBoxModel {
    setBoxModel: <T extends keyof ChartBoxModel>(
        key: T,
        value: ChartBoxModel[T] | undefined
    ) => void;
}
export interface ChartColorSlice extends ChartColor {
    setColor: <T extends keyof ChartColor>(
        key: T,
        value: ChartColor[T] | undefined
    ) => void;
}

export const createVisualSlice = (
    // eslint-disable-next-line
    set: any,
    initialState?: Partial<ChartVisuals>
): ChartVisualSlice => {
    return {
        gridEnabled:
            initialState?.gridEnabled ?? defaultChartVisualSettings.gridEnabled,
        gridOrientation:
            initialState?.gridOrientation ??
            defaultChartVisualSettings.gridOrientation,
        gridStyle:
            initialState?.gridStyle ?? defaultChartVisualSettings.gridStyle,
        gridWidth:
            initialState?.gridWidth ?? defaultChartVisualSettings.gridWidth,
        tooltipBorderRadius:
            initialState?.tooltipBorderRadius ??
            defaultChartVisualSettings.tooltipBorderRadius,
        tooltipBorderWidth:
            initialState?.tooltipBorderWidth ??
            defaultChartVisualSettings.tooltipBorderWidth,
        tooltipEnabled:
            initialState?.tooltipEnabled ??
            defaultChartVisualSettings.tooltipEnabled,
        tooltipSeparatorEnabled:
            initialState?.tooltipSeparatorEnabled ??
            defaultChartVisualSettings.tooltipSeparatorEnabled,
        tooltipStyle:
            initialState?.tooltipStyle ??
            defaultChartVisualSettings.tooltipStyle,
        tooltipTotalEnabled:
            initialState?.tooltipTotalEnabled ??
            defaultChartVisualSettings.tooltipTotalEnabled,
        setVisuals: (key, value) => {
            set((state: ChartVisuals) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};

export const createBoxModelSlice = (
    // eslint-disable-next-line
    set: any,
    initialState?: Partial<ChartBoxModel>
): ChartBoxModelSlice => {
    return {
        borderWidth:
            initialState?.borderWidth ??
            defaultChartBoxModelSettings.borderWidth,
        marginBottom:
            initialState?.marginBottom ??
            defaultChartBoxModelSettings.marginBottom,
        marginLeft:
            initialState?.marginLeft ?? defaultChartBoxModelSettings.marginLeft,
        marginRight:
            initialState?.marginRight ??
            defaultChartBoxModelSettings.marginRight,
        marginTop:
            initialState?.marginTop ?? defaultChartBoxModelSettings.marginTop,
        setBoxModel: (key, value) => {
            set((state: ChartBoxModelSlice) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};

export const createColorSlice = (
    //eslint-disable-next-line
    set: any,
    initialState?: Partial<ChartColor>
): ChartColorSlice => {
    return {
        backgroundColor:
            initialState?.backgroundColor ??
            defaultChartColorsSettings.backgroundColor,
        borderColor:
            initialState?.borderColor ?? defaultChartColorsSettings.borderColor,
        colorPalette:
            initialState?.colorPalette ??
            defaultChartColorsSettings.colorPalette,
        gridColor:
            initialState?.gridColor ?? defaultChartColorsSettings.gridColor,
        labelColor:
            initialState?.labelColor ?? defaultChartColorsSettings.labelColor,
        legendTextColor:
            initialState?.legendTextColor ??
            defaultChartColorsSettings.legendTextColor,
        tooltipBackgroundColor:
            initialState?.tooltipBackgroundColor ??
            defaultChartColorsSettings.tooltipBackgroundColor,
        tooltipBorderColor:
            initialState?.tooltipBorderColor ??
            defaultChartColorsSettings.tooltipBorderColor,
        tooltipSeparatorColor:
            initialState?.tooltipSeparatorColor ??
            defaultChartColorsSettings.tooltipSeparatorColor,
        tooltipTextColor:
            initialState?.tooltipTextColor ??
            defaultChartColorsSettings.tooltipTextColor,
        setColor: (key, value) => {
            set((state: ChartColor) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};

export const createTypographySlice = (
    // eslint-disable-next-line
    set: any,
    initialState?: Partial<ChartTypography>
): ChartTypographySlice => {
    return {
        label: initialState?.label ?? defaultChartTypographySettings.label,
        labelAnchor:
            initialState?.labelAnchor ??
            defaultChartTypographySettings.labelAnchor,
        labelEnabled:
            initialState?.labelEnabled ??
            defaultChartTypographySettings.labelEnabled,
        labelFontFamily:
            initialState?.labelFontFamily ??
            defaultChartTypographySettings.labelFontFamily,
        labelFontStyle:
            initialState?.labelFontStyle ??
            defaultChartTypographySettings.labelFontStyle,
        labelSize:
            initialState?.labelSize ?? defaultChartTypographySettings.labelSize,
        legendEnabled:
            initialState?.legendEnabled ??
            defaultChartTypographySettings.legendEnabled,
        setTypography: (key, value) => {
            set((state: ChartTypography) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};
