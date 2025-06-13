import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { ChartFilter, RadialLegendPositionType, SortType } from "@/constants";
import { RadialChartSelect } from "@/modules/Radial/schema";
import {
    defaultRadialChartConfig,
    RadialSpecificConfig,
    radialSpecificConfigDefaults,
} from "@/modules/Radial/default-radial-chart- config";

// --- State Type
export type RadialChartState = Omit<
    RadialChartSelect,
    "chartId" | "specificConfig"
> &
    RadialSpecificConfig;

// --- Actions
export type RadialChartActions = {
    setXAxisField: (field: string) => void;
    setXAxisSortOrder: (order: SortType) => void;
    setOmitZeroValuesEnabled: (value: boolean) => void;
    setFilters: (filters: ChartFilter[]) => void;
    addFilter: (filter: ChartFilter) => void;
    removeFilter: (index: number) => void;
    updateFilter: (index: number, filter: ChartFilter) => void;
    setInnerRadius: (value: number) => void;
    setOuterRadius: (value: number) => void;
    setStartAngle: (angle: number) => void;
    setEndAngle: (angle: number) => void;
    setLegendPosition: (pos: RadialLegendPositionType) => void;
    setLegendTextSize: (size: number) => void;
    setGap: (gap: number) => void;
    toggleStacked: () => void;
};

// --- Store Type
export type RadialChartStore = RadialChartState & RadialChartActions;

// --- Initializer
export const initRadialChartStore = (
    data?: Partial<RadialChartState>
): RadialChartState => {
    return {
        ...defaultRadialChartConfig,
        ...radialSpecificConfigDefaults,
        ...data,
    };
};

// --- Zustand Store
export const createRadialChartStore = (
    initialState: Partial<RadialChartState> = {}
) => {
    return createStore<RadialChartStore>()(
        immer((set) => ({
            ...initRadialChartStore(initialState),

            setXAxisField: (field: string) =>
                set((state) => {
                    state.xAxisField = field;
                }),
            setXAxisSortOrder: (order: SortType) =>
                set((state) => {
                    state.xAxisSortOrder = order;
                }),
            setOmitZeroValuesEnabled: (value: boolean) =>
                set((state) => {
                    state.omitZeroValuesEnabled = value;
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
            setInnerRadius: (value: number) =>
                set((state) => {
                    state.innerRadius = value;
                }),
            setOuterRadius: (value: number) =>
                set((state) => {
                    state.outerRadius = value;
                }),
            setStartAngle: (angle: number) =>
                set((state) => {
                    state.startAngle = angle;
                }),
            setEndAngle: (angle: number) =>
                set((state) => {
                    state.endAngle = angle;
                }),
            setLegendPosition: (pos: RadialLegendPositionType) =>
                set((state) => {
                    state.legendPosition = pos;
                }),
            setLegendTextSize: (size: number) =>
                set((state) => {
                    state.legendTextSize = size;
                }),
            setGap: (gap: number) =>
                set((state) => {
                    state.gap = gap;
                }),
            toggleStacked: () =>
                set((state) => {
                    state.stacked = !state.stacked;
                }),
        }))
    );
};
