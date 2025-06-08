import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { AreaChartStyle, ChartFilter, SortType } from "@/constants";
import { defaultAreaChartConfig } from "@/modules/Area/area-chart-default-config";
import { AreaChartSelect } from "@/modules/Area/schema";

export type AreaChartState = Omit<AreaChartSelect, "chartId">;

export type AreaChartActions = {
    toggleXAxis: () => void;
    toggleYAxis: () => void;
    toggleStacked: () => void;
    setAreaStyle: (style: AreaChartStyle) => void;
    setStrokeWidth: (width: number) => void;
    setFillOpacity: (opacity: number) => void;
    toggleIsAreaChart: () => void;
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

export type AreaChartStore = AreaChartState & AreaChartActions;

export const initAreaChartStore = (
    data?: Partial<AreaChartState>
): AreaChartState => {
    return { ...defaultAreaChartConfig, ...data };
};

export const createAreaChartStore = (
    initialState: Partial<AreaChartState> = {}
) => {
    return createStore<AreaChartStore>()(
        immer((set) => ({
            ...initAreaChartStore(initialState),

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
                    state.stackedEnabled = !state.stackedEnabled;
                }),
            setAreaStyle: (style) =>
                set((state) => {
                    state.areaStyle = style;
                }),
            setStrokeWidth: (width) =>
                set((state) => {
                    state.strokeWidth = width;
                }),
            setFillOpacity: (opacity) =>
                set((state) => {
                    state.fillOpacity = opacity;
                }),
            toggleIsAreaChart: () =>
                set((state) => {
                    state.isAreaChart = !state.isAreaChart;
                }),
            setXAxisField: (field) =>
                set((state) => {
                    state.xAxisField = field;
                }),
            setYAxisField: (field) =>
                set((state) => {
                    state.yAxisField = field;
                }),
            setXAxisSortOrder: (order) =>
                set((state) => {
                    state.xAxisSortOrder = order;
                }),
            setYAxisSortOrder: (order) =>
                set((state) => {
                    state.yAxisSortOrder = order;
                }),
            setOmitZeroValuesEnabled: (value) =>
                set((state) => {
                    state.omitZeroValuesEnabled = value;
                }),
            setCumulativeEnabled: (value) =>
                set((state) => {
                    state.cumulativeEnabled = value;
                }),
            setFilters: (filters) =>
                set((state) => {
                    state.filters = filters;
                }),
            addFilter: (filter) =>
                set((state) => {
                    state.filters.push(filter);
                }),
            removeFilter: (index) =>
                set((state) => {
                    state.filters.splice(index, 1);
                }),
            updateFilter: (index, filter) =>
                set((state) => {
                    state.filters[index] = filter;
                }),
        }))
    );
};
