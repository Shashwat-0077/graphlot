import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { RadialLegendPositionType } from "@/constants";
import { RadialChartSelect } from "@/modules/Radial/schema";
import { defaultDonutChartConfig } from "@/modules/Radial/default-radial-chart- config";

// --- State Type
export type RadialChartState = Pick<
    RadialChartSelect,
    | "endAngle"
    | "innerRadius"
    | "outerRadius"
    | "startAngle"
    | "legendPosition"
    | "legendTextSize"
>;

// --- Actions
export type RadialChartActions = {
    setInnerRadius: (value: number) => void;
    setOuterRadius: (value: number) => void;
    setStartAngle: (angle: number) => void;
    setEndAngle: (angle: number) => void;
    setLegendPosition: (pos: RadialLegendPositionType) => void;
    setLegendTextSize: (size: number) => void;
};

// --- Store Type
export type RadialChartStore = RadialChartState & RadialChartActions;

// --- Initializer
export const initRadialChartStore = (
    data?: Partial<RadialChartState>
): RadialChartState => ({
    ...defaultDonutChartConfig,
    ...data,
});

// --- Zustand Store
export const createRadialChartStore = (
    initialState: Partial<RadialChartState> = {}
) => {
    return createStore<RadialChartStore>()(
        immer((set) => ({
            ...defaultDonutChartConfig,
            ...initialState,

            setInnerRadius: (value) =>
                set((state) => {
                    state.innerRadius = value;
                }),
            setOuterRadius: (value) =>
                set((state) => {
                    state.outerRadius = value;
                }),
            setStartAngle: (angle) =>
                set((state) => {
                    state.startAngle = angle;
                }),
            setEndAngle: (angle) =>
                set((state) => {
                    state.endAngle = angle;
                }),
            setLegendPosition: (pos) =>
                set((state) => {
                    state.legendPosition = pos;
                }),
            setLegendTextSize: (size) =>
                set((state) => {
                    state.legendTextSize = size;
                }),
        }))
    );
};
