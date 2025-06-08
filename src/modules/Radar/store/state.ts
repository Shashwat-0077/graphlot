import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { defaultRadarChartConfig } from "@/modules/Radar/radar-chart-default-config";
import { RadarChartSelect } from "@/modules/Radar/schema";

export type RadarChartState = Pick<
    RadarChartSelect,
    | "xAxisEnabled"
    | "yAxisEnabled"
    | "omitZeroValuesEnabled"
    | "cumulativeEnabled"
    | "strokeWidth"
>;

export type RadarChartActions = {
    toggleXAxis: () => void;
    toggleYAxis: () => void;
    toggleOmitZero: () => void;
    toggleCumulative: () => void;
    setStrokeWidth: (width: number) => void;
};

export type RadarChartStore = RadarChartState & RadarChartActions;

export const initRadarChartStore = (
    data?: Partial<RadarChartState>
): RadarChartState => {
    return { ...defaultRadarChartConfig, ...data };
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
            toggleYAxis: () =>
                set((state) => {
                    state.yAxisEnabled = !state.yAxisEnabled;
                }),
            toggleOmitZero: () =>
                set((state) => {
                    state.omitZeroValuesEnabled = !state.omitZeroValuesEnabled;
                }),
            toggleCumulative: () =>
                set((state) => {
                    state.cumulativeEnabled = !state.cumulativeEnabled;
                }),
            setStrokeWidth: (width) =>
                set((state) => {
                    state.strokeWidth = width;
                }),
        }))
    );
};
