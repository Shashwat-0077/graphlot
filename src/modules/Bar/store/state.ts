import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import {
    BarSpecificConfig,
    barSpecificConfigDefaults,
    defaultBarChartConfig,
} from "@/modules/Bar/bar-chart-default-config";
import { BarChartSelect } from "@/modules/Bar/schema";
import { ChartFilter, SortType } from "@/constants";

export type BarChartState = Omit<BarChartSelect, "chartId" | "specificConfig"> &
    BarSpecificConfig;

export type BarChartActions = {
    toggleXAxis: () => void;
    toggleYAxis: () => void;
    toggleStacked: () => void;
    setStrokeWidth: (width: number) => void;
    setBorderRadius: (value: number) => void;
    setBarWidth: (value: number) => void;
    setBarGap: (value: number) => void;
    setFillOpacity: (opacity: number) => void;
    setXAxisField: (field: string) => void;
    setYAxisField: (field: string) => void;
    setXAxisSortOrder: (order: SortType) => void;
    setYAxisSortOrder: (order: SortType) => void;
    setOmitZeroValuesEnabled: (value: boolean) => void;
    setCumulativeEnabled: (value: boolean) => void;
    setFilters: (filters: ChartFilter[]) => void;
    addFilter: (filter: ChartFilter) => void;
    removeFilter: (index: number) => void;
    updateFilter: (index: number, filter: ChartFilter) => void;
};

export type BarChartStore = BarChartState & BarChartActions;

export const initBarChartStore = (
    data?: Partial<BarChartState>
): BarChartState => {
    return {
        ...defaultBarChartConfig,
        ...barSpecificConfigDefaults,
        ...data,
    };
};

export const createBarChartStore = (
    initialState: Partial<BarChartState> = {}
) => {
    return createStore<BarChartStore>()(
        immer((set) => ({
            ...initBarChartStore(initialState),
            toggleXAxis: () =>
                set((state) => {
                    state.xAxisEnabled = !state.xAxisEnabled;
                }),
            toggleYAxis: () =>
                set((state) => {
                    state.yAxisEnabled = !state.yAxisEnabled;
                }),
            toggleStacked: () =>
                set((state) => {
                    state.stacked = !state.stacked;
                }),
            setStrokeWidth: (width: number) =>
                set((state) => {
                    state.strokeWidth = width;
                }),
            setFillOpacity: (opacity: number) =>
                set((state) => {
                    state.fillOpacity = opacity;
                }),

            setXAxisField: (field: string) =>
                set((state) => {
                    state.xAxisField = field;
                }),
            setYAxisField: (field: string) =>
                set((state) => {
                    state.yAxisField = field;
                }),
            setXAxisSortOrder: (order: SortType) =>
                set((state) => {
                    state.xAxisSortOrder = order;
                }),
            setYAxisSortOrder: (order: SortType) =>
                set((state) => {
                    state.yAxisSortOrder = order;
                }),
            setOmitZeroValuesEnabled: (value: boolean) =>
                set((state) => {
                    state.omitZeroValuesEnabled = value;
                }),
            setCumulativeEnabled: (value: boolean) =>
                set((state) => {
                    state.cumulativeEnabled = value;
                }),
            setFilters: (filters: ChartFilter[]) =>
                set((state) => {
                    state.filters = filters;
                }),
            addFilter: (filter: ChartFilter) =>
                set((state) => {
                    state.filters.push(filter);
                }),
            removeFilter: (index: number) =>
                set((state) => {
                    state.filters.splice(index, 1);
                }),
            updateFilter: (index: number, filter: ChartFilter) =>
                set((state) => {
                    state.filters[index] = filter;
                }),
            setBorderRadius: (value: number) =>
                set((state) => {
                    state.barBorderRadius = value;
                }),
            setBarWidth: (value: number) =>
                set((state) => {
                    state.barWidth = value;
                }),
            setBarGap: (value: number) =>
                set((state) => {
                    state.barGap = value;
                }),
        }))
    );
};
