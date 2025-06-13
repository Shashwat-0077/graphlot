import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import type { ChartFilter, SortType } from "@/constants";
import {
    type RadarSpecificConfig,
    radarSpecificConfigDefaults,
    defaultRadarChartConfig,
} from "@/modules/Radar/radar-chart-default-config";
import type { RadarChartSelect } from "@/modules/Radar/schema";

export type RadarChartState = Omit<
    RadarChartSelect,
    "chartId" | "specificConfig"
> &
    RadarSpecificConfig;

export type RadarChartActions = {
    toggleXAxis: () => void;
    setStrokeWidth: (width: number) => void;
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

export type RadarChartStore = RadarChartState & RadarChartActions;

export const initRadarChartStore = (
    data?: Partial<RadarChartState>
): RadarChartState => {
    return {
        ...defaultRadarChartConfig,
        ...radarSpecificConfigDefaults,
        ...data,
    };
};

// Factory to create a standalone store instance
export const createRadarChartStore = (
    initialState: Partial<RadarChartState> = {}
) => {
    return createStore<RadarChartStore>()(
        immer((set) => ({
            ...initRadarChartStore(initialState),

            toggleXAxis: () =>
                set((state) => {
                    state.xAxisEnabled = !state.xAxisEnabled;
                }),
            setStrokeWidth: (width) =>
                set((state) => {
                    state.strokeWidth = width;
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
