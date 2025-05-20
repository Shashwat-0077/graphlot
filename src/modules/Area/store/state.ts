import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { AreaChartStyle } from "@/constants";
import { defaultAreaChartConfig } from "@/modules/Area/area-chart-default-config";
import { AreaChartSelect } from "@/modules/Area/schema";

export type AreaChartState = Pick<
    AreaChartSelect,
    | "xAxisEnabled"
    | "yAxisEnabled"
    | "stackedEnabled"
    | "areaStyle"
    | "strokeWidth"
    | "fillOpacity"
    | "isAreaChart"
>;

export type AreaChartActions = {
    toggleXAxis: () => void;
    toggleYAxis: () => void;
    toggleStacked: () => void;
    setAreaStyle: (style: AreaChartStyle) => void;
    setStrokeWidth: (width: number) => void;
    setFillOpacity: (opacity: number) => void;
    toggleIsAreaChart: () => void;
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
        }))
    );
};
