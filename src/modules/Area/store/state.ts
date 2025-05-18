import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import {
    RGBAColor,
    ChartFilter,
    GridOrientation,
    SortType,
    AreaChartType,
    GridType,
    AnchorType,
    FontStyleType,
} from "@/constants";
import defaultAreaChartConfig from "@/modules/Area/area-chart-default-config";
import { AreaChartSelect } from "@/modules/Area/schema";

export type AreaChartState = Omit<AreaChartSelect, "chart_id">;

export type AreaChartActions = {
    // Basic appearance
    setBackgroundColor: (color: RGBAColor) => void;
    setTextColor: (color: RGBAColor) => void;
    toggleTooltip: () => void;

    // Label operations
    setLabel: (label: string) => void;
    toggleLabel: () => void;
    setLabelSize: (size: number) => void;
    setLabelAnchor: (anchor: AnchorType) => void;
    setLabelColor: (color: RGBAColor) => void;
    setLabelFontFamily: (fontFamily: string) => void;
    setLabelFontStyle: (fontStyle: FontStyleType) => void;

    // Legend and border
    toggleLegend: () => void;
    toggleBorder: () => void;

    // Color palette operations
    setColorPalette: (palette: RGBAColor[]) => void;
    addColor: (color?: RGBAColor) => void;
    updateColor: (index: number, color: RGBAColor) => void;
    removeColor: (index: number) => void;
    clearColorPalette: () => void;

    // Axis operations
    setXAxisField: (field: string) => void;
    setYAxisField: (field: string) => void;
    setXSortOrder: (order: SortType) => void;
    setYSortOrder: (order: SortType) => void;
    toggleXAxis: () => void;
    toggleYAxis: () => void;

    // Data display options
    toggleOmitZeroValues: () => void;
    toggleCumulative: () => void;
    setOmitZeroValues: (omit: boolean) => void;
    setCumulative: (cumulative: boolean) => void;
    toggleStacked: () => void;

    // Filter operations
    setFilters: (filters: ChartFilter[]) => void;
    addFilter: (filter: ChartFilter) => void;
    updateFilter: (index: number, filter: ChartFilter) => void;
    removeFilter: (index: number) => void;
    clearFilters: () => void;

    // Grid operations
    setGridColor: (color: RGBAColor) => void;
    setGridOrientation: (orientation: GridOrientation) => void;
    setGridType: (type: GridType) => void;
    setGridWidth: (width: number) => void;

    // Area chart specific operations
    setAreaStyle: (style: AreaChartType) => void;
    setStrokeWidth: (width: number) => void;
    setFillOpacity: (opacity: number) => void;
    toggleIsAreaChart: () => void;

    // Margin operations
    setMarginTop: (margin: number) => void;
    setMarginBottom: (margin: number) => void;
    setMarginLeft: (margin: number) => void;
    setMarginRight: (margin: number) => void;

    // Reset operation
    reset: () => void;
};

export type AreaChartStore = AreaChartState & AreaChartActions;

export const initAreaChartStore = (data?: AreaChartState): AreaChartState => {
    if (data) {
        return data;
    }
    return defaultAreaChartConfig;
};

export const createAreaChartStore = (
    initialState: Partial<AreaChartState> = {}
) => {
    return createStore<AreaChartStore>()(
        immer((set) => ({
            ...defaultAreaChartConfig,
            ...initialState,

            // Basic appearance
            setBackgroundColor: (color) =>
                set((state) => {
                    state.background_color = color;
                }),
            setTextColor: (color) =>
                set((state) => {
                    state.text_color = color;
                }),
            toggleTooltip: () =>
                set((state) => {
                    state.tooltip_enabled = !state.tooltip_enabled;
                }),

            // Label operations
            setLabel: (label) =>
                set((state) => {
                    state.label = label;
                }),
            toggleLabel: () =>
                set((state) => {
                    state.label_enabled = !state.label_enabled;
                }),
            setLabelSize: (size) =>
                set((state) => {
                    state.label_size = size;
                }),
            setLabelAnchor: (anchor) =>
                set((state) => {
                    state.label_anchor = anchor;
                }),
            setLabelColor: (color) =>
                set((state) => {
                    state.label_color = color;
                }),
            setLabelFontFamily: (fontFamily) =>
                set((state) => {
                    state.label_font_family = fontFamily;
                }),
            setLabelFontStyle: (fontStyle) =>
                set((state) => {
                    state.label_font_style = fontStyle;
                }),

            // Legend and border
            toggleLegend: () =>
                set((state) => {
                    state.legend_enabled = !state.legend_enabled;
                }),
            toggleBorder: () =>
                set((state) => {
                    state.border_enabled = !state.border_enabled;
                }),

            // Color palette operations
            setColorPalette: (palette) =>
                set((state) => {
                    state.color_palette = palette;
                }),
            addColor: (
                color = {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1,
                }
            ) =>
                set((state) => {
                    state.color_palette.push(color);
                }),
            updateColor: (index, color) =>
                set((state) => {
                    if (index >= 0 && index < state.color_palette.length) {
                        state.color_palette[index] = color;
                    }
                }),
            removeColor: (index) =>
                set((state) => {
                    if (index >= 0 && index < state.color_palette.length) {
                        state.color_palette.splice(index, 1);
                    }
                }),
            clearColorPalette: () =>
                set((state) => {
                    state.color_palette = [];
                }),

            // Axis operations
            setXAxisField: (field) =>
                set((state) => {
                    state.x_axis_field = field;
                }),
            setYAxisField: (field) =>
                set((state) => {
                    state.y_axis_field = field;
                }),
            setXSortOrder: (order) =>
                set((state) => {
                    state.x_sort_order = order;
                }),
            setYSortOrder: (order) =>
                set((state) => {
                    state.y_sort_order = order;
                }),
            toggleXAxis: () =>
                set((state) => {
                    state.x_axis_enabled = !state.x_axis_enabled;
                }),
            toggleYAxis: () =>
                set((state) => {
                    state.y_axis_enabled = !state.y_axis_enabled;
                }),

            // Data display options
            toggleOmitZeroValues: () =>
                set((state) => {
                    state.omit_zero_values_enabled =
                        !state.omit_zero_values_enabled;
                }),
            toggleCumulative: () =>
                set((state) => {
                    state.cumulative_enabled = !state.cumulative_enabled;
                }),
            setOmitZeroValues: (omit) =>
                set((state) => {
                    state.omit_zero_values_enabled = omit;
                }),
            setCumulative: (cumulative) =>
                set((state) => {
                    state.cumulative_enabled = cumulative;
                }),
            toggleStacked: () =>
                set((state) => {
                    state.stacked_enabled = !state.stacked_enabled;
                }),

            // Filter operations
            setFilters: (filters) =>
                set((state) => {
                    state.filters = filters;
                }),
            addFilter: (filter) =>
                set((state) => {
                    state.filters.push(filter);
                }),
            updateFilter: (index, filter) =>
                set((state) => {
                    if (index >= 0 && index < state.filters.length) {
                        state.filters[index] = filter;
                    }
                }),
            removeFilter: (index) =>
                set((state) => {
                    if (index >= 0 && index < state.filters.length) {
                        state.filters.splice(index, 1);
                    }
                }),
            clearFilters: () =>
                set((state) => {
                    state.filters = [];
                }),

            // Grid operations
            setGridColor: (color) =>
                set((state) => {
                    state.grid_color = color;
                }),
            setGridOrientation: (orientation) =>
                set((state) => {
                    state.grid_orientation = orientation;
                }),
            setGridType: (type) =>
                set((state) => {
                    state.grid_type = type;
                }),
            setGridWidth: (width) =>
                set((state) => {
                    state.grid_width = width;
                }),

            // Area chart specific operations
            setAreaStyle: (style) =>
                set((state) => {
                    state.area_style = style;
                }),
            setStrokeWidth: (width) =>
                set((state) => {
                    state.stroke_width = width;
                }),
            setFillOpacity: (opacity) =>
                set((state) => {
                    state.fill_opacity = opacity;
                }),
            toggleIsAreaChart: () =>
                set((state) => {
                    state.is_area_chart = !state.is_area_chart;
                }),

            // Margin operations
            setMarginTop: (margin) =>
                set((state) => {
                    state.margin_top = margin;
                }),
            setMarginBottom: (margin) =>
                set((state) => {
                    state.margin_bottom = margin;
                }),
            setMarginLeft: (margin) =>
                set((state) => {
                    state.margin_left = margin;
                }),
            setMarginRight: (margin) =>
                set((state) => {
                    state.margin_right = margin;
                }),

            // Reset operation
            reset: () => set(() => ({ ...defaultAreaChartConfig })),
        }))
    );
};
