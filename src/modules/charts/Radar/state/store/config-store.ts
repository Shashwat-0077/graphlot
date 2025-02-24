import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type FilterType = {
    column: string;
    operation: string;
    value: string;
};

export type RadarChartConfigState = {
    dataLabels: "value" | "percentage" | "None";
    xAxis: string;
    yAxis: string;
    groupBy: string;
    sortBy: string;
    filters: FilterType[];
};

export type RadarChartConfigActions = {
    setDataLabels: (value: "value" | "percentage" | "None") => void;
    setXAxis: (value: string) => void;
    setYAxis: (value: string) => void;
    setGroupBy: (value: string) => void;
    setSortBy: (value: string) => void;
    setFilters: (filters: FilterType[]) => void;
};

export type RadarChartConfigStore = RadarChartConfigState &
    RadarChartConfigActions;

export const defaultInitState: RadarChartConfigState = {
    dataLabels: "value",
    xAxis: "",
    yAxis: "",
    groupBy: "",
    sortBy: "",
    filters: [],
};

export const initRadarChartConfigStore = (): RadarChartConfigState => {
    return defaultInitState;
};

export const createRadarChartConfigStore = (
    initState: RadarChartConfigState = defaultInitState
) => {
    return createStore<RadarChartConfigStore>()(
        immer((set) => ({
            ...initState,
            setDataLabels: (value) =>
                set((state) => {
                    state.dataLabels = value;
                }),
            setXAxis: (value) =>
                set((state) => {
                    state.xAxis = value;
                }),
            setYAxis: (value) =>
                set((state) => {
                    state.yAxis = value;
                }),
            setGroupBy: (value) =>
                set((state) => {
                    state.groupBy = value;
                }),
            setSortBy: (value) =>
                set((state) => {
                    state.sortBy = value;
                }),
            setFilters: (filters) =>
                set((state) => {
                    state.filters = filters;
                }),
        }))
    );
};
