import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type FilterType = {
    column: string;
    operation: string;
    value: string;
};

export type AreaChartConfigState = {
    dataLabels: "value" | "percentage" | "None";
    xAxis: string;
    yAxis: string;
    groupBy: string;
    sortBy: string;
    filters: FilterType[];
};

export type AreaChartConfigActions = {
    setDataLabels: (value: "value" | "percentage" | "None") => void;
    setXAxis: (value: string) => void;
    setYAxis: (value: string) => void;
    setGroupBy: (value: string) => void;
    setSortBy: (value: string) => void;
    setFilters: (filters: FilterType[]) => void;
};

export type AreaChartConfigStore = AreaChartConfigState &
    AreaChartConfigActions;

export const defaultInitState: AreaChartConfigState = {
    dataLabels: "value",
    xAxis: "",
    yAxis: "",
    groupBy: "",
    sortBy: "",
    filters: [],
};

export const initAreaChartConfigStore = (): AreaChartConfigState => {
    return defaultInitState;
};

export const createAreaChartConfigStore = (
    initState: AreaChartConfigState = defaultInitState
) => {
    return createStore<AreaChartConfigStore>()(
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
