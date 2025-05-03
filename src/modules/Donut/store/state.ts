import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { DonutSelect } from "@/modules/Donut/schema";
import { ColorType, FilterType, SortOptionsType } from "@/constants";
import defaultDonutChartState from "@/modules/Donut/default.config";

export type DonutChartState = Omit<DonutSelect, "chart_id">;

export type DonutChartActions = {
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
    setXAxis: (axis: string) => void;
    setSortBy: (field: SortOptionsType) => void;

    // Data display options
    toggleOmitZeroValues: () => void;
    setOmitZeroValues: (omit: boolean) => void;

    // Filter operations
    setFilters: (filters: FilterType[]) => void;
    addFilter: (filter: FilterType) => void;
    updateFilter: (index: number, filter: FilterType) => void;
    removeFilter: (index: number) => void;
    clearFilters: () => void;

    // State operations
    reset: () => void;
};

export type DonutChartStore = DonutChartState & DonutChartActions;

export const initDonutChartStore = (data: DonutChartState): DonutChartState => {
    if (data) {
        return data;
    }
    return defaultDonutChartState;
};

export const createDonutChartStore = (
    initialState: Partial<DonutChartState> = {}
) => {
    return createStore<DonutChartStore>()(
        immer((set) => ({
            ...defaultDonutChartState,
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
            setSortBy: (field) =>
                set((state) => {
                    state.sort_by = field;
                }),

            // Data display options
            toggleOmitZeroValues: () =>
                set((state) => {
                    state.omit_zero_values = !state.omit_zero_values;
                }),
            setOmitZeroValues: (omit) =>
                set((state) => {
                    state.omit_zero_values = omit;
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

            // State operations
            reset: () => set(() => ({ ...defaultDonutChartState })),
        }))
    );
};
