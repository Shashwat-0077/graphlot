import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type FilterType = {
    column: string;
    operation: string;
    value: string;
};

export type DonutChartConfigState = {
    dataLabels: "value" | "percentage" | "None";
    xAxis: string;
    sortBy: string;
    filters: FilterType[];
};

export type DonutChartConfigActions = {
    setDataLabels: (value: "value" | "percentage" | "None") => void;
    setXAxis: (value: string) => void;
    setSortBy: (value: string) => void;
    setFilters: (filters: FilterType[]) => void;
};

export type DonutChartConfigStore = DonutChartConfigState &
    DonutChartConfigActions;

export const defaultInitState: DonutChartConfigState = {
    dataLabels: "value",
    xAxis: "",
    sortBy: "",
    filters: [],
};

export const initDonutChartConfigStore = (): DonutChartConfigState => {
    return defaultInitState;
};

export const createDonutChartConfigStore = (
    initState: DonutChartConfigState = defaultInitState
) => {
    return createStore<DonutChartConfigStore>()(
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
