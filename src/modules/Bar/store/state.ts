import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { defaultBarChartConfig } from "@/modules/Bar/bar-chart-default-config";
import { BarChartSelect } from "@/modules/Bar/schema";

export type BarChartState = Pick<
    BarChartSelect,
    | "xAxisEnabled"
    | "yAxisEnabled"
    | "barBorderRadius"
    | "barWidth"
    | "barGap"
    | "fillOpacity"
    | "strokeWidth"
>;

export type BarChartActions = {
    toggleXAxis: () => void;
    toggleYAxis: () => void;
    satBarBorderRadius: (radius: number) => void;
    setBarWidth: (width: number) => void;
    setBarGap: (gap: number) => void;
    setFillOpacity: (opacity: number) => void;
    setStrokeWidth: (width: number) => void;
};

export type BarChartStore = BarChartState & BarChartActions;

export const initBarChartStore = (data?: BarChartState): BarChartState => {
    if (data) {
        return data;
    }
    return defaultBarChartConfig;
};

export const createBarChartStore = (
    initialState: Partial<BarChartState> = {}
) => {
    return createStore<BarChartStore>()(
        immer((set) => ({
            ...defaultBarChartConfig,
            ...initialState,

            toggleXAxis: () =>
                set((state) => {
                    state.xAxisEnabled = !state.xAxisEnabled;
                }),
            toggleYAxis: () =>
                set((state) => {
                    state.yAxisEnabled = !state.yAxisEnabled;
                }),
            setBarWidth: (width) =>
                set((state) => {
                    state.barWidth = width;
                }),
            setBarGap: (gap) =>
                set((state) => {
                    state.barGap = gap;
                }),
            setFillOpacity: (opacity) =>
                set((state) => {
                    state.fillOpacity = opacity;
                }),
            setStrokeWidth: (width) =>
                set((state) => {
                    state.strokeWidth = width;
                }),
            satBarBorderRadius: (radius) =>
                set((state) => {
                    state.barBorderRadius = radius;
                }),
        }))
    );
};
