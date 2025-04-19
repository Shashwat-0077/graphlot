import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { BarSelect } from "@/modules/Bar/schema";
import { ColorType, FilterType, GRID_HORIZONTAL, GridType } from "@/constants";

export type BarChartState = Omit<BarSelect, "chart_id">;

export type BarChartActions = {
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

    // Filter operations
    setFilters: (filters: FilterType[]) => void;
    addFilter: (filter: FilterType) => void;
    updateFilter: (index: number, filter: FilterType) => void;
    removeFilter: (index: number) => void;
    clearFilters: () => void;

    // Grid operations
    setGridColor: (color: ColorType) => void;
    setGridType: (type: GridType) => void;

    // Bar-specific operations
    setBarGap: (gap: number) => void;
    setBarSize: (size: number) => void;

    // State operations
    reset: () => void;
};

export type BarChartStore = BarChartState & BarChartActions;

export const defaultBarChartState: BarChartState = {
    background_color: { r: 25, g: 25, b: 25, a: 1 },
    text_color: { r: 255, g: 255, b: 255, a: 1 },
    tooltip_enabled: true,
    label_enabled: true,
    legend_enabled: true,
    has_border: true,
    color_palette: [],
    x_axis: null,
    y_axis: null,
    group_by: null,
    sort_by: null,
    omit_zero_values: false,
    cumulative: false,
    filters: [],
    grid_color: {
        r: 224,
        g: 224,
        b: 224,
        a: 1,
    },
    grid_type: GRID_HORIZONTAL,
    bar_gap: 20,
    bar_size: 5,
};

export const initBarChartStore = (data?: BarChartState): BarChartState => {
    if (data) {
        return data;
    }
    return defaultBarChartState;
};

export const createBarChartStore = (
    initialState: Partial<BarChartState> = {}
) => {
    return createStore<BarChartStore>()(
        immer((set) => ({
            ...defaultBarChartState,
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

            // Bar-specific operations
            setBarGap: (gap) =>
                set((state) => {
                    state.bar_gap = gap;
                }),
            setBarSize: (size) =>
                set((state) => {
                    state.bar_size = size;
                }),

            // State operations
            reset: () => set(() => ({ ...defaultBarChartState })),
        }))
    );
};
