import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
    AnchorType,
    FontStyleType,
    FontType,
    GridOrientation,
    GridStyle,
    RGBAColor,
    TooltipStyle,
} from "@/constants";
import {
    defaultChartBoxModel,
    defaultChartColors,
    defaultChartTypographySettings,
    defaultChartVisualSettings,
} from "@/modules/ChartMetaData/defaultChartConfig";
import {
    ChartBoxModelSelect,
    ChartColorSelect,
    ChartTypographySelect,
    ChartVisualSelect,
} from "@/modules/ChartMetaData/schema";

export type ChartVisuals = Omit<ChartVisualSelect, "chartId">;
export type ChartTypography = Omit<ChartTypographySelect, "chartId">;
export type ChartBoxModel = Omit<ChartBoxModelSelect, "chartId">;
export type ChartColor = Omit<ChartColorSelect, "chartId">;

export type ChartVisualActions = {
    setGridOrientation: (orientation: GridOrientation) => void;
    setGridStyle: (style: GridStyle) => void;
    setGridWidth: (width: number) => void;
    toggleTooltip: () => void;
    setTooltipStyle: (style: TooltipStyle) => void;
};
export type ChartTypographyActions = {
    setLabel: (label: string) => void;
    setLabelSize: (size: number) => void;
    setLabelFontFamily: (family: FontType) => void;
    setLabelFontStyle: (style: FontStyleType) => void;
    setLabelAnchor: (anchor: AnchorType) => void;
    toggleLabel: () => void;
    toggleLegend: () => void;
};
export type ChartBoxModelActions = {
    setMarginTop: (top: number) => void;
    setMarginBottom: (bottom: number) => void;
    setMarginLeft: (left: number) => void;
    setMarginRight: (right: number) => void;
    setBorderWidth: (width: number) => void;
    toggleBorder: () => void;
};
export type ChartColorActions = {
    setBackgroundColor: (color: RGBAColor) => void;
    setTextColor: (color: RGBAColor) => void;
    setBorderColor: (color: RGBAColor) => void;
    setGridColor: (color: RGBAColor) => void;
    setLabelColor: (color: RGBAColor) => void;
    setLegendTextColor: (color: RGBAColor) => void;
    setColorPalette: (palette: RGBAColor[]) => void;
    addColorPalette: (color: RGBAColor) => void;
    removeColorPalette: (index: number) => void;
};

export type ChartVisualStore = ChartVisualActions & ChartVisuals;
export type ChartTypographyStore = ChartTypographyActions & ChartTypography;
export type ChartBoxModelStore = ChartBoxModelActions & ChartBoxModel;
export type ChartColorStore = ChartColorActions & ChartColor;

export const initChartVisualState = (
    data: Partial<ChartVisuals> = {}
): ChartVisuals => {
    return { ...defaultChartVisualSettings, ...data };
};
export const initChartTypographyState = (
    data: Partial<ChartTypography> = {}
): ChartTypography => {
    return { ...defaultChartTypographySettings, ...data };
};
export const initChartBoxModelState = (
    data: Partial<ChartBoxModel> = {}
): ChartBoxModel => {
    return { ...defaultChartBoxModel, ...data };
};
export const initChartColorState = (
    data: Partial<ChartColor> = {}
): ChartColor => {
    return { ...defaultChartColors, ...data };
};

export const createChartVisualStore = (
    initialState: Partial<ChartVisuals> = {}
) => {
    return createStore<ChartVisualStore>()(
        immer((set) => ({
            ...initChartVisualState(initialState),
            setGridOrientation: (orientation: GridOrientation) =>
                set((state) => {
                    state.gridOrientation = orientation;
                }),
            setGridStyle: (style) =>
                set((state) => {
                    state.gridStyle = style;
                }),
            setGridWidth: (width) =>
                set((state) => {
                    state.gridWidth = width;
                }),
            toggleTooltip: () =>
                set((state) => {
                    state.tooltipEnabled = !state.tooltipEnabled;
                }),
            setTooltipStyle: (style) =>
                set((state) => {
                    state.tooltipStyle = style;
                }),
        }))
    );
};

export const createChartTypographyStore = (
    initialState: Partial<ChartTypography> = {}
) => {
    return createStore<ChartTypographyStore>()(
        immer((set) => ({
            ...initChartTypographyState(initialState),
            setLabel: (label: string) =>
                set((state) => {
                    state.label = label;
                }),
            setLabelSize: (size: number) =>
                set((state) => {
                    state.labelSize = size;
                }),
            setLabelFontFamily: (family: FontType) =>
                set((state) => {
                    state.labelFontFamily = family;
                }),
            setLabelFontStyle: (style: FontStyleType) =>
                set((state) => {
                    state.labelFontStyle = style;
                }),
            setLabelAnchor: (anchor: AnchorType) =>
                set((state) => {
                    state.labelAnchor = anchor;
                }),
            toggleLabel: () =>
                set((state) => {
                    state.labelEnabled = !state.labelEnabled;
                }),
            toggleLegend: () =>
                set((state) => {
                    state.legendEnabled = !state.legendEnabled;
                }),
        }))
    );
};

export const createChartBoxModelStore = (
    initialState: Partial<ChartBoxModel> = {}
) => {
    return createStore<ChartBoxModelStore>()(
        immer((set) => ({
            ...initChartBoxModelState(initialState),
            setMarginTop: (top: number) =>
                set((state) => {
                    state.marginTop = top;
                }),
            setMarginBottom: (bottom: number) =>
                set((state) => {
                    state.marginBottom = bottom;
                }),
            setMarginLeft: (left: number) =>
                set((state) => {
                    state.marginLeft = left;
                }),
            setMarginRight: (right: number) =>
                set((state) => {
                    state.marginRight = right;
                }),
            setBorderWidth: (width: number) =>
                set((state) => {
                    state.borderWidth = width;
                }),
            toggleBorder: () =>
                set((state) => {
                    state.borderEnabled = !state.borderEnabled;
                }),
        }))
    );
};
export const createChartColorStore = (
    initialState: Partial<ChartColor> = {}
) => {
    return createStore<ChartColorStore>()(
        immer((set) => ({
            ...initChartColorState(initialState),
            setBackgroundColor: (color: RGBAColor) =>
                set((state) => {
                    state.backgroundColor = color;
                }),
            setTextColor: (color: RGBAColor) =>
                set((state) => {
                    state.legendTextColor = color;
                }),
            setBorderColor: (color: RGBAColor) =>
                set((state) => {
                    state.borderColor = color;
                }),
            setGridColor: (color: RGBAColor) =>
                set((state) => {
                    state.gridColor = color;
                }),
            setLabelColor: (color: RGBAColor) =>
                set((state) => {
                    state.labelColor = color;
                }),
            setLegendTextColor: (color: RGBAColor) =>
                set((state) => {
                    state.legendTextColor = color;
                }),
            setColorPalette: (palette: RGBAColor[]) =>
                set((state) => {
                    state.colorPalette = palette;
                }),
            addColorPalette: (color: RGBAColor) =>
                set((state) => {
                    state.colorPalette.push(color);
                }),
            removeColorPalette: (index: number) =>
                set((state) => {
                    state.colorPalette.splice(index, 1);
                }),
        }))
    );
};
