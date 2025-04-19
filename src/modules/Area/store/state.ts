import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { AreaSelect } from "@/modules/Area/schema";
import { ColorType, FilterType, GRID_HORIZONTAL, GridType } from "@/constants";

export type AreaChartState = Omit<AreaSelect, "chart_id">;

export type AreaChartActions = {
    // Basic appearance
    setBackgroundColor: (color: ColorType) => void;
    setTextColor: (color: ColorType) => void;
    toggleTooltip: () => void;
    toggleLegend: () => void;
    toggleBorder: () => void;
    toggleLabel: () => void;

    // Color palette operations
    setColorPalette: (palette: ColorType[]) => void;
    addColor: (color?: ColorType) => void;
    updateColor: (color: ColorType, index: number) => void;
    removeColor: (index: number) => void;
    clearColorPalette: () => void;

    // Axis operations
    setXAxis: (axis: string | null) => void;
    setYAxis: (axis: string | null) => void;
    setGroupBy: (field: string | null) => void;
    setSortBy: (field: string | null) => void;

    // Data display options
    toggleOmitZeroValues: () => void;
    toggleCumulative: () => void;
    setCumulative: (cumulative: boolean) => void;
    setOmitZeroValues: (omitZeroValues: boolean) => void;

    // Filter operations
    setFilters: (filters: FilterType[]) => void;
    addFilter: (filter: FilterType) => void;
    updateFilter: (index: number, filter: FilterType) => void;
    removeFilter: (index: number) => void;
    clearFilters: () => void;

    // Grid operations
    setGridColor: (color: ColorType) => void;
    setGridType: (type: GridType) => void;

    // State operations
    reset: () => void;
};

export type AreaChartStore = AreaChartState & AreaChartActions;

export const defaultAreaChartState: AreaChartState = {
    background_color: { r: 25, g: 25, b: 25, a: 1 },
    text_color: { r: 255, g: 255, b: 255, a: 1 },
    tooltip_enabled: true,
    legend_enabled: true,
    label_enabled: true,
    has_border: true,
    color_palette: [],
    x_axis: null,
    y_axis: null,
    group_by: null,
    sort_by: null,
    omit_zero_values: false,
    cumulative: false,
    filters: [],
    grid_color: { r: 224, g: 224, b: 224, a: 1 },
    grid_type: GRID_HORIZONTAL,
};

export const initAreaChartStore = (data?: AreaChartState): AreaChartState => {
    if (!data) {
        return defaultAreaChartState;
    }
    return data;
};

export const createAreaChartStore = (
    initialState: Partial<AreaChartState> = {}
) => {
    return createStore<AreaChartStore>()(
        immer((set) => ({
            ...defaultAreaChartState,
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
            toggleLegend: () =>
                set((state) => {
                    state.legend_enabled = !state.legend_enabled;
                }),
            toggleBorder: () =>
                set((state) => {
                    state.has_border = !state.has_border;
                }),
            toggleLabel: () =>
                set((state) => {
                    state.label_enabled = !state.label_enabled;
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
            updateColor: (color, index) =>
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
            setXAxis: (axis) =>
                set((state) => {
                    state.x_axis = axis;
                }),
            setYAxis: (axis) =>
                set((state) => {
                    state.y_axis = axis;
                }),
            setGroupBy: (field) =>
                set((state) => {
                    state.group_by = field;
                }),
            setSortBy: (field) =>
                set((state) => {
                    state.sort_by = field;
                }),

            // Data display options
            toggleOmitZeroValues: () =>
                set((state) => {
                    state.omit_zero_values = !state.omit_zero_values;
                }),
            toggleCumulative: () =>
                set((state) => {
                    state.cumulative = !state.cumulative;
                }),
            setCumulative: (cumulative) =>
                set((state) => {
                    state.cumulative = cumulative;
                }),
            setOmitZeroValues: (omitZeroValues) =>
                set((state) => {
                    state.omit_zero_values = omitZeroValues;
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
            setGridType: (type) =>
                set((state) => {
                    state.grid_type = type;
                }),

            // State operations
            reset: () => set(() => ({ ...defaultAreaChartState })),
        }))
    );
};
